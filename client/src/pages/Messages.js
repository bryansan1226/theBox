import { useLocation, useNavigate } from "react-router-dom";
import AppBar from "../components/AppBar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";
import PopupState, { bindToggle, bindPopper } from "material-ui-popup-state";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import { TextField } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import backendUrl from "../config";
import { useEffect } from "react";
import ConversationCard from "../components/ConversationCard";

function Messages() {
  const { search } = useLocation();
  const userInfo = new URLSearchParams(search);
  const user_id = userInfo.get("userInfo");
  const [newMessageValue, setNewMessageValue] = useState("");
  const [following, setFollowing] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  const getFollowing = async () => {
    console.log(userInfo);
    console.log(user_id);
    await axios
      .get(`${backendUrl}api/getFollowing/${user_id}`)
      .then((response) => {
        const message = response.data.rows;
        setFollowing(message);
        console.log(message);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };
  const handleSendMessage = async () => {
    const currentTimestamp = new Date().toISOString();
    axios
      .post(`${backendUrl}api/newMessage`, {
        sender_id: user_id,
        receiver_id: selectedUser.user_id,
        content: newMessageValue,
        created_at: currentTimestamp,
      })
      .then((response) => {
        const { message } = response.data;
        console.log("Response from server:", message);
        setNewMessageValue("");
      })
      .catch((error) => {
        console.error("Error posting data: ", error);
      });
  };
  const getMessages = async () => {
    await axios
      .get(`${backendUrl}api/getMessages/${user_id}`)
      .then((response) => {
        const message = response.data.rows;
        setMessages(
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
  const getConversations = async (arr) => {
    let map = new Map();
    for (let msg of arr) {
      if (msg.sender_id != user_id) {
        if (!map.has(msg.sender_id)) map.set(msg.sender_id, [msg]);
        else map.get(msg.sender_id).push(msg);
      } else {
        if (!map.has(msg.receiver_id)) map.set(msg.receiver_id, [msg]);
        else map.get(msg.receiver_id).push(msg);
      }
    }
    //console.log(map);
    console.log(Array.from(map));
    setConversations(Array.from(map));
  };

  useEffect(() => {
    getFollowing();
    getMessages();
  }, []);
  useEffect(() => {
    getConversations(messages);
  }, [messages]);
  return (
    <>
      <AppBar />
      <PopupState variant="popper" popupId="demo-popup-popper">
        {(popupState) => (
          <div>
            <Button
              variant="contained"
              {...bindToggle(popupState)}
              style={{ margin: "15px" }}
            >
              New Message
            </Button>
            <Popper {...bindPopper(popupState)} transition>
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <Paper
                    sx={{
                      width: "75vw",
                      height: "35vh",
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      overflow: "auto",
                    }}
                  >
                    <Typography style={{ margin: "10px", display: "flex" }}>
                      To:
                      <PopupState variant="popper" popupId="demo-popup-popper">
                        {(popupState) => (
                          <>
                            <Button {...bindToggle(popupState)}>
                              {selectedUser
                                ? `${selectedUser.first_name} ${selectedUser.last_name}`
                                : "Select from following:"}
                            </Button>
                            <Popper {...bindPopper(popupState)} transition>
                              {({ TransitionProps }) => (
                                <Fade {...TransitionProps} timeout={350}>
                                  <Paper>
                                    {following.map((item, index) => (
                                      <Typography
                                        key={index}
                                        onClick={() => {
                                          setSelectedUser(item);
                                          popupState.close();
                                        }}
                                        style={{
                                          width: "15vw",
                                          textAlign: "center",
                                          fontSize: "110%",
                                        }}
                                      >
                                        {item.first_name + " " + item.last_name}
                                      </Typography>
                                    ))}
                                  </Paper>
                                </Fade>
                              )}
                            </Popper>
                          </>
                        )}
                      </PopupState>
                    </Typography>
                    <TextField
                      id="standard-multiline-static"
                      label="Message"
                      multiline
                      rows={10}
                      defaultValue=""
                      variant="filled"
                      fullWidth
                      style={{
                        minHeight: "35%",
                        maxHeight: "75%",
                        overflow: "auto",
                      }}
                      onChange={(e) => {
                        setNewMessageValue(e.target.value);
                      }}
                    />
                    <Typography sx={{ p: 2 }}>
                      <Button variant="contained" onClick={handleSendMessage}>
                        Send
                      </Button>
                      <Button {...bindToggle(popupState)}>Cancel</Button>
                    </Typography>
                  </Paper>
                </Fade>
              )}
            </Popper>
          </div>
        )}
      </PopupState>
      {conversations.length ? (
        conversations.map((conversation) => (
          <ConversationCard
            key={conversation[0]}
            message={conversation[1][0]}
            user_id={user_id}
            conversation_id={conversation[0]}
          />
        ))
      ) : (
        <Typography>You have no messages to view</Typography>
      )}
    </>
  );
}
export default Messages;
