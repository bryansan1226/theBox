import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import backendUrl from "../config";
import axios from "axios";
import { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Popper from "@mui/material/Popper";
import PopupState, { bindToggle, bindPopper } from "material-ui-popup-state";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Comment from "./Comment";
import Box from "@mui/material/Box";

function Post(props) {
  const [userInfo, setUserInfo] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, isLiked] = useState(false);
  const [commentEmpty, setCommentEmpty] = useState(false);

  const handleCommentText = (event) => {
    const inputValue = event.target.value;
    setCommentText(inputValue);
  };
  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      handleNewComment();
    }
  };
  const handleNewComment = async () => {
    if (commentText.trim().length) {
      const currentTimestamp = new Date().toISOString();
      axios
        .post(`${backendUrl}api/newComment`, {
          post_id: props.content.post_id,
          user_id: props.userInfo.user_id,
          content: commentText,
          created_at: currentTimestamp,
        })
        .then((response) => {
          const { message } = response.data;
          console.log("Response from server:", message);
          setCommentText("");
          setCommentEmpty(false);
        })
        .catch((error) => {
          console.error("Error posting data: ", error);
        });

      axios
        .post(`${backendUrl}api/newNotification`, {
          user_id: props.content.user_id,
          content: `${props.userInfo.first_name} commented on your post!`,
          created_at: currentTimestamp,
          is_read: false,
        })
        .then((response) => {
          const { message } = response.data;
          console.log("Response from server:", message);
        })
        .catch((error) => {
          console.error("Error posting data: ", error);
        });
    } else {
      setCommentEmpty(true);
      setCommentText("");
    }
  };
  const handleLike = async () => {
    if (!liked) {
      const currentTimestamp = new Date().toISOString();
      axios
        .post(`${backendUrl}api/likePost`, {
          post_id: props.content.post_id,
          user_id: props.userInfo.user_id,
          created_at: currentTimestamp,
        })
        .then((response) => {
          const { message } = response.data;
          isLiked(true);
          console.log("Response from server:", message);
          getLikes();
          axios
            .post(`${backendUrl}api/newNotification`, {
              user_id: props.content.user_id,
              content: `${props.userInfo.first_name} liked your post!`,
              created_at: currentTimestamp,
              is_read: false,
            })
            .then((response) => {
              const { message } = response.data;
              console.log("Response from server:", message);
            })
            .catch((error) => {
              console.error("Error posting data: ", error);
            });
        })
        .catch((error) => {
          console.error("Error posting data: ", error);
        });
    } else {
      axios
        .delete(`${backendUrl}api/dislikePost`, {
          data: {
            user_id: props.userInfo.user_id,
            post_id: props.content.post_id,
          },
        })
        .then((response) => {
          const { message } = response.data;
          isLiked(false);
          console.log("Response from server:", message);
          getLikes();
        })
        .catch((error) => {
          console.error("Error deleting data: ", error);
        });
    }
  };

  const getComments = async () => {
    axios
      .get(`${backendUrl}api/getComments/${props.content.post_id}`)
      .then((response) => {
        const message = response.data.rows;
        setComments(message);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };
  const getLikes = async () => {
    return axios
      .get(`${backendUrl}api/getLikes/${props.content.post_id}`)
      .then((response) => {
        const message = response.data.rows;
        //  console.log(message);
        setLikes(message);
        return message;
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        return [];
      });
  };
  const isLikedByUser = async (arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].user_id == props.userInfo.user_id) return true;
    }
    return false;
  };

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
  const fetchData = async () => {
    await findByUserID();
    await getComments();
    let data = await getLikes();
    const likedByUser = await isLikedByUser(data);
    isLiked(likedByUser);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Box m={2}>
      <Paper elevation={4}>
        <Card style={{ maxWidth: "100%" }}>
          <CardContent>
            {
              <Typography gutterBottom variant="h5" component="div">
                {userInfo.first_name} {userInfo.last_name}
              </Typography>
            }
            <Typography variant="body1" color="text.secondary">
              {props.content.content}
            </Typography>
            <PopupState variant="popper" popupId="demo-popup-popper">
              {(popupState) => (
                <div>
                  <Button size="small" {...bindToggle(popupState)}>
                    View comments ({comments.length})
                  </Button>
                  <Popper {...bindPopper(popupState)} transition>
                    {({ TransitionProps }) => (
                      <Fade {...TransitionProps} timeout={350}>
                        <Box>
                          <Paper
                            sx={{
                              width: "80vw",
                              height: "25vh",
                              maxHeight: "25vh",
                              overflow: "auto",
                            }}
                          >
                            {comments.map((content, index) => (
                              <Comment key={index} content={content} />
                            ))}
                          </Paper>
                        </Box>
                      </Fade>
                    )}
                  </Popper>
                </div>
              )}
            </PopupState>
          </CardContent>
          <CardActions>
            {!commentEmpty ? (
              <TextField
                variant="filled"
                fullWidth
                onChange={handleCommentText}
                value={commentText}
                onKeyDown={handleEnterKeyPress}
              />
            ) : (
              <TextField
                error
                variant="filled"
                fullWidth
                onChange={handleCommentText}
                value={commentText}
                helperText="Comment cannot be empty"
                onKeyDown={handleEnterKeyPress}
              />
            )}
            <Button size="small" onClick={handleNewComment}>
              Comment
            </Button>
            {liked ? (
              <Button size="small" variant="contained" onClick={handleLike}>
                Like ({likes.length})
              </Button>
            ) : (
              <Button size="small" onClick={handleLike}>
                Like ({likes.length})
              </Button>
            )}
          </CardActions>
        </Card>
      </Paper>
    </Box>
  );
}
export default Post;
