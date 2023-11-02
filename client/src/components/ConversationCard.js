import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import axios from "axios";
import backendUrl from "../config";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ConversationCard(props) {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const findByUserID = async () => {
    axios
      .get(`${backendUrl}api/findByUserID/${props.conversation_id}`)
      .then((response) => {
        const message = response.data;
        //console.log(message);
        setName(message.first_name + " " + message.last_name);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };
  const goToConversation = (var1, var2) => {
    navigate(`/conversation?user_id=${var1}&conversation_id=${var2}`);
  };
  useEffect(() => {
    findByUserID();
  }, []);

  return (
    <Card
      sx={{
        width: "99vw",
        backgroundColor:
          props.message.is_read || props.message.sender_id == props.user_id
            ? "white"
            : "rgb(24,118,210,0.25)",
      }}
    >
      <CardActionArea
        onClick={() => goToConversation(props.user_id, props.conversation_id)}
      >
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.message.content}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
export default ConversationCard;
