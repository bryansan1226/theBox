import axios from "axios";
import React, { useEffect, useState } from "react";
import backendUrl from "../config";
import { useNavigate } from "react-router-dom";
import PostFeed from "../components/PostFeed";
import AppBar from "../components/AppBar";
import Typography from "@mui/material/Typography";

function Homepage() {
  //State to store user information
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    //  console.log("got to fetch");
    try {
      //Retrieves token from localstorage, if no token is present the user will be redirected to /login
      const token = localStorage.getItem("token");
      if (!token) {
        //redirect
        navigate("/");
        return null;
      }
      //Makes a GET request to fetch user data using token
      const response = await axios.get(`${backendUrl}api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Returns user data if successful
      return response.data;
      //console.log(response.data);
    } catch (error) {
      console.error("Error fetching user information", error);
      return null;
    }
  };
  //Function to get user info using fetchUserInfo and updates userInfo state.
  const getUserInfo = async () => {
    const info = await fetchUserInfo();
    if (info) {
      setUserInfo(info);
      console.log("User info ", info);
    } else {
      console.log("User not authenticated or an error occured.");
    }
  };
  //Effect hook to get user info when component mounts
  useEffect(() => {
    getUserInfo();
  }, []);
  //Handles signing out by removing the session token from localstorage and navigates to index page.
  const handleSignOut = () => {
    setUserInfo(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  if (userInfo === null) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <>
        <AppBar />
        <Typography variant="h4" gutterBottom>
          Welcome, {userInfo.first_name}!
        </Typography>
        <PostFeed userInfo={userInfo} />
      </>
    );
  }
}
export default Homepage;
