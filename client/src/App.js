import Login from "./pages/login/";
import Register from "./pages/register";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger";

function hasJWT() {
  let flag = false;
  localStorage.getItem("token") ? (flag = true) : (flag = false);
  return flag;
}

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Switch>
        <Route path="/login">
          {user && hasJWT() ? <Redirect to="/" /> : <Login />}
        </Route>
        <Route path="/register">
          {user && hasJWT() ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route path="/">
          {user && hasJWT() ? <Messenger /> : <Register />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
