import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import backendUrl from "../config";
import { useEffect } from "react";

function UserCard(props) {
  const [following, setFollowing] = useState(false);
  const followUser = async () => {
    const currentTimestamp = new Date().toISOString();
    axios
      .post(`${backendUrl}api/newFollow`, {
        user_id: props.result.user_id,
        follower_id: props.userInfo,
        created_at: currentTimestamp,
      })
      .then((response) => {
        const { message } = response.data;
        setFollowing(true);
        console.log("Response from server:", message);
      })
      .catch((error) => {
        console.error("Error posting data: ", error);
      });
    axios
      .post(`${backendUrl}api/newNotification`, {
        user_id: props.result.user_id,
        content: `${props.userName} is now following you!`,
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
  };
  const unfollowUser = async () => {
    //   const currentTimestamp = new Date().toISOString();
    axios
      .delete(`${backendUrl}api/unfollow`, {
        data: {
          user_id: props.result.user_id,
          follower_id: props.userInfo,
        },
      })
      .then((response) => {
        const { message } = response.data;
        setFollowing(false);
        console.log("Response from server:", message);
      })
      .catch((error) => {
        console.error("Error deleting data: ", error);
      });
  };

  const isFollowing = async () => {
    axios
      .get(
        `${backendUrl}api/following/${props.result.user_id}/${props.userInfo}`
      )
      .then((response) => {
        const message = response.data.rows;
        console.log("Response from server:", message);
        if (message.length > 0) setFollowing(true);
        else setFollowing(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };
  useEffect(() => {
    isFollowing();
  }, []);

  if (!following)
    return (
      <Card style={{ maxWidth: "100%" }}>
        <CardContent>
          <Typography gutterBottom variant="h4" component="div">
            {props.result.first_name + " " + props.result.last_name}
          </Typography>
          <Typography variant="h5" color="text.secondary">
            {props.result.username}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={followUser}>
            Follow
          </Button>
        </CardActions>
      </Card>
    );
  else
    return (
      <Card style={{ maxWidth: "100%" }}>
        <CardContent>
          <Typography gutterBottom variant="h4" component="div">
            {props.result.first_name + " " + props.result.last_name}
          </Typography>
          <Typography variant="h5" color="text.secondary">
            {props.result.username}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={unfollowUser}>
            Unfollow
          </Button>
        </CardActions>
      </Card>
    );
}
export default UserCard;
