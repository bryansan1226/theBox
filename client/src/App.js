import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import SearchResults from "./pages/SearchResults";
import Messages from "./pages/Messages";
import Conversation from "./pages/Conversation";
import NotificationsPage from "./pages/NotificationsPage";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/searchResults" element={<SearchResults />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/conversation" element={<Conversation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
