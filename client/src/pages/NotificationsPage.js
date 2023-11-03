import { Typography, Container } from "@mui/material";
import AppBar from "../components/AppBar";
import Notifications from "../components/Notifications";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import backendUrl from "../config";

function NotificationsPage() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const userInfo = queryParams.get("userInfo");
  const [notifications, setNotifications] = useState([]);
  console.log(userInfo);
  const getNotifications = async () => {
    await axios
      .get(`${backendUrl}api/getNotifications/${userInfo}`)
      .then((response) => {
        const message = response.data.rows;
        setNotifications(
          message.sort((a, b) => {
            const timeStampA = new Date(a.created_at).getTime();
            const timeStampB = new Date(b.created_at).getTime();
            return timeStampB - timeStampA;
          })
        );
        console.log("Response from server:", message);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };
  useEffect(() => {
    getNotifications();
  }, []);
  return (
    <>
      <AppBar />
      <Container
        sx={{
          minWidth: "100vw",
          minHeight: "90vh",
        }}
      >
        <Typography variant="h4">Notifications</Typography>
        <Notifications content={notifications} />
      </Container>
    </>
  );
}
export default NotificationsPage;
