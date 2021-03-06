import axios from "axios";
import { useRef } from "react";
import "../../styles/register.css";

import { useHistory } from "react-router";

export default function Register() {
  const username = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("/auth/register", user);
        history.push("/login");
      } catch (err) {
        alert("User already registered");
        console.log(err);
      }
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          {/* <h3 className="loginLogo">433 Chat</h3> */}
          <div>
            <img
              style={{ width: "350px" }}
              src="http://localhost:3000/assets/chatLogo.svg"
              alt=""
            />
          </div>
          {/* <span className="loginDesc">Connect with your friends.</span>  */}
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <center>
              <h3 style={{ color: "#1775ee" }}>Sign up</h3>
            </center>
            <input
              placeholder="Username"
              required
              ref={username}
              className="loginInput"
            />
            <input
              placeholder="Password"
              required
              ref={password}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Password Again"
              required
              ref={passwordAgain}
              className="loginInput"
              type="password"
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                history.push("/login");
              }}
              className="loginRegisterButton"
            >
              Log into Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
