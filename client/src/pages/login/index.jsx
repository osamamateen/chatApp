import { useContext, useRef } from "react";
import "../../styles/login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { useHistory } from "react-router";

export default function Login() {
  const username = useRef();
  const password = useRef();
  const history = useHistory();
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleClick = async (e) => {
    e.preventDefault();
    await loginCall(
      { username: username.current.value, password: password.current.value },
      dispatch
    );
    history.push("/");
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <form className="loginBox" onSubmit={handleClick}>
          <center>
            <h3 style={{ color: "#1775ee" }}>Login</h3>
          </center>
          <input
            placeholder="Username"
            type="username"
            required
            className="loginInput"
            ref={username}
          />
          <input
            placeholder="Password"
            type="password"
            required
            minLength="6"
            className="loginInput"
            ref={password}
          />
          <button className="loginButton" type="submit" disabled={isFetching}>
            {isFetching ? (
              <CircularProgress color="white" size="20px" />
            ) : (
              "Log In"
            )}
          </button>
          <button
            className="loginRegisterButton"
            onClick={() => history.push("/register")}
          >
            {isFetching ? (
              <CircularProgress color="white" size="20px" />
            ) : (
              "Create a New Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
