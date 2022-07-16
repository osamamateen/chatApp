import "../styles/topbar.css";
import { useContext } from "react";

import { logout } from "../apiCalls";
import { AuthContext } from "../context/AuthContext";

export default function Topbar() {
  const { dispatch } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    logout(dispatch);
  };
  return (
    <div className="topbarContainer">
      <div className="topbarCenter"></div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span onClick={handleClick} className="topbarLink">
            Logout
          </span>
        </div>
      </div>
    </div>
  );
}
