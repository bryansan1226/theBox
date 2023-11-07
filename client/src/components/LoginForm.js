import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NewAccountForm from "./NewAccountForm";
import Backdrop from "@mui/material/Backdrop";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import backendUrl from "../config";
function LoginForm() {
  //declaring variables to handle user input and allow navigating within the app using navigate
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleUsername = (event) => {
    const inputValue = event.target.value;
    setUsername(inputValue);
  };
  const handlePassword = (event) => {
    const inputValue = event.target.value;
    setPassword(inputValue);
  };
  const handleLogin = async () => {
    //console.log(backendUrl);
    try {
      /*Makes an API call to the backend with the provided username and password. 
      If the API returns a token, it will be set in localstorage and the user will be navigated to the homepage*/
      const response = await axios.post(`${backendUrl}api/login`, {
        username,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);

      navigate("/home");
    } catch (error) {
      console.error(error.response?.data?.error || "Error during login");
    }
  };
  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh", // Adjust this to control vertical centering
      }}
    >
      <Card sx={{ minWidth: 275 }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h3" gutterBottom>
            The Box
          </Typography>
          <TextField
            id="username"
            onChange={handleUsername}
            onKeyDown={handleEnterKeyPress}
            label="Username"
            sx={{ margin: "8px" }}
          />
          <TextField
            id="password"
            type="password"
            onChange={handlePassword}
            label="Password"
            onKeyDown={handleEnterKeyPress}
            sx={{ marginTop: "8px" }}
          />
        </CardContent>
        <CardActions>
          <Button variant="contained" size="small" onClick={handleLogin}>
            Sign in
          </Button>
          <Button variant="contained" size="small" onClick={handleOpen}>
            Create new account
          </Button>
        </CardActions>
        {/*The backdrop will also render the NewAccount component when opened and passes the handleClose
        function so it can be closed from within the component */}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          //onClick={handleClose}
        >
          <NewAccountForm handleClose={handleClose} />
        </Backdrop>
      </Card>
    </Container>
  );
}
export default LoginForm;
