const express = require("express");
const socket = require("socket.io");
const RTCMultiConnectionServer = require('rtcmulticonnection-server');
const cors = require('cors');
const path = require('path');
const http = require("http");
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socket(server);

io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
  RTCMultiConnectionServer.addSocket(socket, {
    socketURL: 'https://webrtc.musio.io/',
    dirPath: "",
    socketMessageEvent: 'RTCMultiConnection-Message',
    socketCustomEvent: 'RTCMultiConnection-Custom-Message',
    port: '9001',
    enableLogs: false,
    isUseHTTPs: true,
    sslKey: path.join(__dirname, 'ssl', 'private.key'),
    sslCert: path.join(__dirname, 'ssl', 'certificate.crt'),
    autoRebootServerOnFailure: false,
    enableAdmin: false
  });
});
server.listen(port, () => console.log(`Server is running on ${port}`));
