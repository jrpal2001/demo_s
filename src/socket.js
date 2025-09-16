import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ;
// const SOCKET_URL = 'http://localhost:5000';
console.log("🚀 ~ SOCKET_URL:", SOCKET_URL)

const socket = io(SOCKET_URL, {
  withCredentials: true,
  // Add any other options you need
});

export default socket;
