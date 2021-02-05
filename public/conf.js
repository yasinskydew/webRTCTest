let peerConnection;
const peerConnections = {};
const config = {
  iceServers: [
    {
      "urls": "stun:207.154.194.111",
    },
    // {
    //   "urls": "turn:TURN_IP?transport=tcp",
    //   "username": "TURN_USERNAME",
    //   "credential": "TURN_CREDENTIALS"
    // }
  ]
};
const socket1 = io.connect(window.location.origin);
const socket2 = io.connect(window.location.origin);