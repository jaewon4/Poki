import React, { useState } from "react";
import Login from "./pages/General/Login";
import axios from "axios";
import io from "socket.io-client";
import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";

axios.defaults.withCredentials = true;
// export const socket = io("http://3.34.134.62:3000");
// export const socket = io("http://localhost:4000");
//export const socket = io("https://api.pokids.site:8000");
export const socket = io(process.env.REACT_APP_SOCKET_URL);

function App() {
  const [tokenFcm, setTokenFcm ] = useState("");
  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Generate Token
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIRE_VAPID_KEY,
      });
      // console.log("Token Gen", token);
      setTokenFcm(token);
      // Send this token  to server ( db)
    } else if (permission === "denied") {
      alert("You denied for the notification");
    }
  }

  React.useEffect(() => {
    // Req user for notification permission
    requestPermission();
  }, []);

  return <Login token={tokenFcm}/>;
}

export default App;
