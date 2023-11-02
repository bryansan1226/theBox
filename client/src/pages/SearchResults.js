import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import backendUrl from "../config";
import axios from "axios";
import UserCard from "../components/UserCard";
import AppBar from "../components/AppBar";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function SearchResults() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const searchQuery = queryParams.get("searchQuery");
  const userInfo = queryParams.get("userInfo");
  const [results, setResults] = useState([]);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const searchForUser = async () => {
    axios
      .get(`${backendUrl}api/search/users/${searchQuery}`)
      .then((response) => {
        const message = response.data.rows;
        setResults(message);
        console.log("Response from server:", message);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

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
      setUserName(info.first_name + " " + info.last_name);
      // console.log("User info ", info);
    } else {
      console.log("User not authenticated or an error occured.");
    }
  };
  useEffect(() => {
    searchForUser();
    getUserInfo();
  }, []);

  return (
    <>
      <AppBar />
      <div>
        <Typography variant="h4">Results:</Typography>
      </div>
      <div>
        {results.map((result, index) => (
          <UserCard
            key={index}
            result={result}
            userInfo={userInfo}
            userName={userName}
          />
        ))}
      </div>
    </>
  );
}
export default SearchResults;
