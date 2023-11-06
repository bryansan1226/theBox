import React, { useState } from "react";
import backendUrl from "../config";
import axios from "axios";
import { useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";

function Comment(props) {
  const [userInfo, setUserInfo] = useState([]);

  const findByUserID = async () => {
    axios
      .get(`${backendUrl}api/findByUserID/${props.content.user_id}`)
      .then((response) => {
        const message = response.data;
        setUserInfo(message);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };
  useEffect(() => {
    findByUserID();
  }, []);
  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {userInfo.first_name} {userInfo.last_name}
        </Typography>
        <Typography variant="body2" component="div">
          {props.content.content}
        </Typography>
      </CardContent>
    </Card>
  );
}
export default Comment;
