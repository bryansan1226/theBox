import { Card, CardActions, CardContent } from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import axios from "axios";
import backendUrl from "../config";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";

function NewPostForm(props) {
  const [newPostText, setNewPostText] = useState("");
  const [postEmpty, setPostEmpty] = useState(false);

  const handleNewPostText = (event) => {
    const inputValue = event.target.value;
    setNewPostText(inputValue);
  };

  const handleNewPost = (event) => {
    const currentTimestamp = new Date().toISOString();
    if (newPostText.trim().length) {
      setPostEmpty(false);
      axios
        .post(`${backendUrl}api/newPost`, {
          user_id: props.userInfo.user_id,
          content: newPostText,
          media: null,
          created_at: currentTimestamp,
        })
        .then((response) => {
          const { message } = response.data;
          console.log("Response from server:", message);
          props.getUserPosts();
          setNewPostText("");
        })
        .catch((error) => {
          console.error("Error posting data: ", error);
        });
    } else setPostEmpty(true);
  };

  return (
    <Card>
      <CardContent>
        <div>
          <Typography variant="h5" gutterBottom>
            New Post:
          </Typography>

          {!postEmpty ? (
            <TextField
              id="outlined-multiline-static"
              label=""
              multiline
              rows={4}
              fullWidth
              onChange={handleNewPostText}
              value={newPostText}
            />
          ) : (
            <TextField
              error
              id="outlined-multiline-static"
              label=""
              multiline
              rows={4}
              fullWidth
              helperText="New post cannot be empty"
              onChange={handleNewPostText}
              value={newPostText}
            />
          )}
        </div>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="small" onClick={handleNewPost}>
          Post
        </Button>
      </CardActions>
    </Card>
  );
}
export default NewPostForm;
