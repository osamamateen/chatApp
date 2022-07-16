import "../../styles/messenger.css";

import Topbar from "../../components/Topbar";
import Conversation from "../../components/Conversation";
import Message from "../../components/Message";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { setAuthToken } from "../../helpers/setAuthToken";
import axios from "axios";
import { io } from "socket.io-client";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();
  const searchValue = useRef();
  const [searchText, setSearchText] = useState("");

  setAuthToken(localStorage.getItem("token"));

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    const getUsers = async () => {
      try {
        const res = await axios.get("/users/", {
          params: { userId: user._id },
        });
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
    getUsers();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    currentChat && getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      await handleSubmit(e);
    }
  };

  const createConversation = async (e, receiverId, user) => {
    e.preventDefault();
    const res = await axios.post("/conversations", {
      senderId: user._id,
      receiverId,
    });

    setConversations(res.data);
    setCurrentChat(res.data[0]);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChange = async (e) => {
    e.preventDefault();
    setSearchText(searchValue.current.value);
    const res = await axios.get("/users/", {
      params: { username: searchValue.current.value, userId: user._id },
    });
    setUsers(res.data);
  };

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              placeholder="Search for friends"
              onChange={(e) => handleChange(e)}
              ref={searchValue}
              className="chatMenuInput"
            />
            {users.map((u) => (
              <div onClick={(e) => createConversation(e, u._id, user)}>
                <div className="conversation">
                  <img
                    className="conversationImg"
                    src={`https://avatars.dicebear.com/api/bottts/${u?._id}.svg`}
                    alt=""
                  />
                  <span className="conversationName">{u?.username}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.length ? (
                    messages.map((m) => (
                      <div ref={scrollRef}>
                        <Message message={m} own={m.sender === user._id} />
                      </div>
                    ))
                  ) : (
                    <>
                      <div style={{ textAlign: "center" }}>
                        <img
                          src="http://localhost:3000/assets/inbox.svg"
                          alt=""
                          style={{
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginTop: "100px",
                            width: " 40%",
                            opacity: "5%",
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="chatBoxBottom">
                  <input
                    type="text"
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                    onKeyDown={handleKeyDown}
                  />
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <img
                  src="http://localhost:3000/assets/inbox.svg"
                  alt=""
                  style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: "100px",
                    width: " 40%",
                    opacity: "5%",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
