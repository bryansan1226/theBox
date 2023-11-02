import * as React from "react";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import NewAccountForm from "../components/NewAccountForm";
import LoginForm from "../components/LoginForm";
import Container from "@mui/material/Container";

//The login function is used to open or close the NewAccountForm component
function Login() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
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
