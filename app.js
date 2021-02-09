const express = require("express");
const socket = require("socket.io");
const RTCMultiConnectionServer = require('rtcmulticonnection-server');
const app = express();

let broadcaster;
const port = process.env.PORT || 3000;

const http = require("http");
const server = http.createServer(app);

const io = socket(server);
app.use(express.static(__dirname + "/public"));

io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
  RTCMultiConnectionServer.addSocket(socket, {
    socketURL: 'https://webrtc.musio.io/',
    dirPath: "",
    socketMessageEvent: 'RTCMultiConnection-Message',
    socketCustomEvent: 'RTCMultiConnection-Custom-Message',
    port: '9001',
    enableLogs: 'false',
    autoRebootServerOnFailure: false,
    enableAdmin: false,
    adminUserName: 'username',
    adminPassword: 'password',
  });
  // socket.on("broadcaster", () => {
  //   console.log("broadcaster")
  //   broadcaster = socket.id;
  //   socket.broadcast.emit("broadcaster");
  // });
  // socket.on("watcher", () => {
  //   console.log("watcher")
  //   socket.to(broadcaster).emit("watcher", socket.id);
  // });
  // socket.on("offer", (id, message) => {
  //   console.log("offer")
  //   socket.to(id).emit("offer", socket.id, message);
  // });
  // socket.on("answer", (id, message) => {
  //   console.log("answer")
  //   socket.to(id).emit("answer", socket.id, message);
  // });
  // socket.on("candidate", (id, message) => {
  //   console.log("candidate")
  //   socket.to(id).emit("candidate", socket.id, message);
  // });
  // socket.on("disconnect", () => {
  //   console.log("disconnect")
  //   socket.to(broadcaster).emit("disconnectPeer", socket.id);
  // });
});
server.listen(port, () => console.log(`Server is running on ${port}`));
