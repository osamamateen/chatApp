import axios from "axios";
import { setAuthToken } from "./helpers/setAuthToken";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const { data } = await axios.post("/auth/login", userCredential);
    console.log(data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setAuthToken(data.token);

    dispatch({ type: "LOGIN_SUCCESS", payload: data.user });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
    setAuthToken();
    localStorage.clear();
  }
};

export const logout = (dispatch) => {
  dispatch({ type: "LOGOUT" });
  setAuthToken();
  localStorage.clear();
};
