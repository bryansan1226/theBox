import * as React from "react";
import LoginForm from "../components/LoginForm";
import Container from "@mui/material/Container";

//The login function is used to open or close the NewAccountForm component
function Login() {
  console.log("In login.js");
  return (
    <>
      <Container
        sx={{
          minWidth: "100vw",
          minHeight: "100vh",
          backgroundColor: "rgb(24,118,210,0.25)",
        }}
      >
        {/*This component handles user credentials and is always displayed */}
        <LoginForm />
      </Container>
    </>
  );
}

export default Login;
