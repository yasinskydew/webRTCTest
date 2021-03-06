const express = require("express");
const socket = require("socket.io");
const RTCMultiConnectionServer = require('rtcmulticonnection-server');
const cors = require('cors');
const path = require('path');
const http = require("http");
const app = express();
app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use((req, res, next) => {
  res.header('Access-Control-Expose-Headers', '*');
  next();
});
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: '*',
  }
});

io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
  RTCMultiConnectionServer.addSocket(socket, {
    socketURL: '/',
    dirPath: "",
    socketMessageEvent: 'RTCMultiConnection-Message',
    socketCustomEvent: 'RTCMultiConnection-Custom-Message',
    port: '3000',
    enableLogs: true,
    isUseHTTPs: true,
    sslKey: path.join(__dirname, 'ssl', 'private.key'),
    sslCert: path.join(__dirname, 'ssl', 'certificate.crt'),
    autoRebootServerOnFailure: false,
    enableAdmin: false
  });
});
server.listen(port, () => console.log(`Server is running on ${port}`));
