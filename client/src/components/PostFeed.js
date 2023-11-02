import { useState } from "react";
import backendUrl from "../config";
import axios from "axios";
import { useEffect } from "react";
import Post from "./Post";
import { CardContent } from "@mui/material";
import NewPostForm from "./NewPostForm";
import Typography from "@mui/material/Typography";

function PostFeed(props) {
  const [posts, getPosts] = useState([]);
  let allPosts = [];
  const getUserPosts = async () => {
    axios
      .get(`${backendUrl}api/getUserPosts/${props.userInfo.user_id}`)
      .then((response) => {
        const message = response.data.rows;
        allPosts = [...message];
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };
  const getFollowingPosts = async () => {
    axios
      .get(`${backendUrl}api/getFollowingPosts/${props.userInfo.user_id}`)
      .then((response) => {
        const message = response.data.rows;
        allPosts = [...allPosts, ...message];
        console.log("Response from server:", message);
        getPosts(
          allPosts.sort((a, b) => {
            const timeStampA = new Date(a.created_at).getTime();
            const timeStampB = new Date(b.created_at).getTime();
            return timeStampB - timeStampA;
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  useEffect(() => {
    getUserPosts().then(() => {
      getFollowingPosts();
    });
  }, []);

  return (
    <>
      <NewPostForm userInfo={props.userInfo} getUserPosts={getUserPosts} />
      <Typography variant="h5" gutterBottom>
        Feed:
      </Typography>
      <div>
        {posts.map((content, index) => (
          <Post key={index} content={content} userInfo={props.userInfo} />
        ))}
      </div>
    </>
  );
}
export default PostFeed;
