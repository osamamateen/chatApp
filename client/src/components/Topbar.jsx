import "../styles/topbar.css";
import { useContext } from "react";

import { logout } from "../apiCalls";
import { AuthContext } from "../context/AuthContext";

export default function Topbar() {
  const { dispatch } = useContext(AuthContext);
  const { user } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    logout(dispatch);
  };
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <div>
          <h3 style={{ marginLeft: "30px", color: "white" }}>Chat App</h3>
        </div>
      </div>

      <div className="topbarRight">
        <div>
          <img
            className="topbarImg"
            src={`https://avatars.dicebear.com/api/bottts/${user?._id}.svg`}
            alt=""
          />

          <p onClick={handleClick} className="topbarLink">
            Logout
          </p>
        </div>
      </div>
    </div>
  );
}
