const express = require("express");
const socket = require("socket.io");
const RTCMultiConnectionServer = require('rtcmulticonnection-server');
const app = express();
const cors = require('cors');
const path = require('path');
const port = process.env.PORT || 3000;

const http = require("http");
const server = http.createServer(app);

const io = socket(server);
app.use(cors());
console.log(fs.existsSync(path.join(__dirname, 'ssl', 'private.key')))
io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
  RTCMultiConnectionServer.addSocket(socket, {
    socketURL: 'https://webrtc.musio.io/',
    dirPath: "",
    socketMessageEvent: 'RTCMultiConnection-Message',
    socketCustomEvent: 'RTCMultiConnection-Custom-Message',
    port: '9001',
    enableLogs: 'false',
    isUseHTTPs: 'true',
    sslKey: path.join(__dirname, 'ssl', 'private.key'),
    sslCert: path.join(__dirname, 'ssl', 'certificate.crt'),
    autoRebootServerOnFailure: false,
    enableAdmin: false,
    adminUserName: 'username',
    adminPassword: 'password',
  });
});
server.listen(port, () => console.log(`Server is running on ${port}`));
