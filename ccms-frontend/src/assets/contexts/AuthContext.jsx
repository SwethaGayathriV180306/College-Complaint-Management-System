import React, { createContext, useEffect, useState } from "react";
import API from "../../api/api";
import  {jwtDecode}  from "jwt-decode";
import socket from "../../services/socket";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  // Called after successful login/registration to store token & start socket
  const saveUser = (userObj) => {
    setUser(userObj);
    localStorage.setItem("user", JSON.stringify(userObj));
    if (userObj?.token) {
      API.defaults.headers = API.defaults.headers || {};
      API.defaults.headers.Authorization = `Bearer ${userObj.token}`;
      socket.auth = { token: userObj.token };
      socket.connect();
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    try {
      delete API.defaults.headers.Authorization;
    } catch {}
    if (socket.connected) socket.disconnect();
  };

  // On mount: if token present, ensure socket connects
  useEffect(() => {
    if (user?.token && !socket.connected) {
      socket.auth = { token: user.token };
      socket.connect();
    }
    return () => {
      /* optional cleanup */
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser: saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
