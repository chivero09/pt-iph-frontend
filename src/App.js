import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Terminal from "./pages/Terminal";
import Group from "./pages/Group";
import Chat from "./pages/Chat";
import Menu from "./components/Menu";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Menu />
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/terminales" element={<Terminal />} />
                <Route path="/grupos" element={<Group />} />
                <Route path="/chats" element={<Chat />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
