import { Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import backendUrl from "../config";
import React, { useEffect } from "react";

function Notifications(props) {
  const setNotificationsAsRead = async () => {
    const anyUnread = await checkIfUnread(props.content);
    console.log(anyUnread);
    if (anyUnread) {
      await axios
        .put(`${backendUrl}api/setNotificationsAsRead`, {
          user_id: props.content[0].user_id,
        })
        .then((response) => {
          const { message } = response.data;
          console.log("Response from server:", message);
        })
        .catch((error) => {
          console.error("Error posting data: ", error);
        });
    }
  };
  const checkIfUnread = (arr) => {
    let result = false;
    for (let i of arr) {
      if (!i.is_read) {
        result = true;
        break;
      }
    }
    return result;
  };
  useEffect(() => {
    setNotificationsAsRead();
  }, []);
  return (
    <>
      {props.content.map((notification, index) => (
        <Card
          key={index}
          sx={{
            margin: "1vh",
            backgroundColor: notification.is_read
              ? "white"
              : "rgb(24,118,210,0.25)",
            width: "95%",
          }}
        >
          <CardContent>
            <Typography variant="body2">{notification.content}</Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
export default Notifications;
