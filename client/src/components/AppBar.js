import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import backendUrl from "../config";
import React, { useEffect } from "react";
import Popper from "@mui/material/Popper";
import PopupState, { bindToggle, bindPopper } from "material-ui-popup-state";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Notifications from "./Notifications";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  right: 0,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(1)})`,
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function PrimarySearchAppBar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [searchInput, setSearchInput] = React.useState("");
  const [newMessages, setNewMessages] = useState(0);
  const [newNotifications, setNewNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [userInfo, setUserInfo] = useState(null);
  //const navigate = useNavigate();

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
      getNewMessages(info);
      getNotifications(info);
      return info.first_name;
      // console.log("User info ", info);
    } else {
      console.log("User not authenticated or an error occured.");
    }
  };
  //Effect hook to get user info when component mounts
  useEffect(() => {
    getUserInfo();
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const handleSearch = () => {
    navigate(
      `/searchResults?searchQuery=${searchInput}&userInfo=${userInfo.user_id}`
    );
  };
  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const handleMessageClick = () => {
    navigate(`/messages?userInfo=${userInfo.user_id}`);
  };
  const handleNotificationsClick = () => {
    navigate(`/notifications?userInfo=${userInfo.user_id}`);
  };
  const handleLogoClick = () => {
    navigate(`/home`);
  };
  const getNewMessages = async (info) => {
    await axios
      .get(`${backendUrl}api/getNewMessages/${info.user_id}`)
      .then((response) => {
        const message = response.data.rows;
        setNewMessages(message.length);

        console.log("Response from server:", message);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };
  const getNotifications = async (info) => {
    await axios
      .get(`${backendUrl}api/getNotifications/${info.user_id}`)
      .then((response) => {
        const message = response.data.rows;
        setNotifications(
          message.sort((a, b) => {
            const timeStampA = new Date(a.created_at).getTime();
            const timeStampB = new Date(b.created_at).getTime();
            return timeStampB - timeStampA;
          })
        );
        console.log("Response from server:", message);
        let count = 0;
        for (let notification of message) {
          if (!notification.is_read) count++;
        }
        setNewNotifications(count);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  const handleSignOut = () => {
    setUserInfo(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile (Future feature)</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account (Future feature)</MenuItem>
      <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleMessageClick}>
        <IconButton size="large" aria-label="show new mails" color="inherit">
          <Badge badgeContent={newMessages} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem onClick={handleNotificationsClick}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={newNotifications} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>

      <MenuItem onClick={handleSignOut}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Sign Out</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            {/*<MenuIcon />*/}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" }, cursor: "pointer" }}
            onClick={handleLogoClick}
          >
            The Box
          </Typography>
          <Search>
            <SearchIconWrapper onClick={handleSearch}>
              <SearchIcon onClick={handleSearch} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleEnterKeyPress}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
              onClick={handleMessageClick}
            >
              <Badge badgeContent={newMessages} color="error">
                <MailIcon />
              </Badge>
            </IconButton>

            <PopupState variant="popper" popupId="demo-popup-popper">
              {(popupState) => (
                <div>
                  <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                    {...bindToggle(popupState)}
                  >
                    <Badge badgeContent={newNotifications} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                  <Popper {...bindPopper(popupState)} transition>
                    {({ TransitionProps }) => (
                      <Fade {...TransitionProps} timeout={350}>
                        <Box>
                          <Paper
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "30vw",
                              height: "50vh",
                              maxHeight: "80vh",
                              overflow: "auto",
                              spacing: "2vh",
                              backgroundColor: "rgb(24,118,210,.9)",
                            }}
                          >
                            <Notifications content={notifications} />
                          </Paper>
                        </Box>
                      </Fade>
                    )}
                  </Popper>
                </div>
              )}
            </PopupState>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
