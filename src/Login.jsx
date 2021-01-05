import React, { useState } from "react";
import "./Login.css";
import Header from "./Header.jsx";
import { Redirect } from "react-router-dom";
import {
  Card,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  CardContent,
  CardActions,
  InputAdornment,
} from "@material-ui/core";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

const Login = () => {
  const [loginParams, setLoginParams] = useState({
    user_id: "",
    user_password: "",
  });
  const [isLogged, setIsLogged] = useState(false);

  const { user_id, user_password } = loginParams;

  const handleFormChange = (event) => {
    setLoginParams({
      ...loginParams,
      [event.target.name]: event.target.value,
    });
  };

  const login = (event) => {
    if (user_id === "admin" && user_password === "123") {
      localStorage.setItem("token", "T");
      setIsLogged(true);
    }
    event.preventDefault();
  };

  if (localStorage.getItem("token")) {
    return <Redirect to="/" />;
  }
  return (
    <div className="login-wrapper">
      <div style={{ background: "#a900b0", width: "100%" }}>
        <Header isLogged={isLogged} />
      </div>
      <form onSubmit={login} style={{ marginTop: "60px" }}>
        <Card>
          <CardContent>
            <h4 style={{ textAlign: "center" }}>Login</h4>
            <TextField
              variant="outlined"
              placeholder="Email"
              margin="normal"
              required
              fullWidth
              id="user_id"
              label="Email"
              autoFocus
              autoComplete="false"
              value={user_id}
              name="user_id"
              onChange={handleFormChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              placeholder="Password"
              margin="normal"
              required
              fullWidth
              type="password"
              id="user_password"
              label="Password"
              //name="password"
              autoComplete="false"
              value={user_password}
              name="user_password"
              onChange={handleFormChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VisibilityOffIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              label="Remember me"
              control={
                <Checkbox
                  checked={true}
                  onChange={() => {}}
                  name="checkedB"
                  color="primary"
                />
              }
            />
          </CardContent>
          <CardActions>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Login
            </Button>
          </CardActions>
          <div style={{ textAlign: "center", margin: "25px 0 30px" }}>
            Don't have an account? Sign up here
          </div>
        </Card>
      </form>
    </div>
  );
};
export default Login;
