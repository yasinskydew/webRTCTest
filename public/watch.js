const video = document.getElementById("watcher");
const enableAudioButton = document.querySelector("#enable-audio");
const idDate = Date.now();
enableAudioButton.addEventListener("click", enableAudio)

socket1.on("offer", (id, description) => {
  peerConnection = new RTCPeerConnection(config);
  peerConnection
    .setRemoteDescription(description)
    .then(() => peerConnection.createAnswer())
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      console.log('answer')
      socket1.emit("answer", id, peerConnection.localDescription);
    });
  peerConnection.ontrack = event => {
    console.log('vent.streams[0]')
    video.srcObject = event.streams[0];
  };
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      console.log('candidate')
      socket1.emit("candidate", id, event.candidate);
    }
  };
});
socket1.on("candidate", (id, candidate) => {
  peerConnection
    .addIceCandidate(new RTCIceCandidate(candidate))
    .catch(e => console.error(e));
});
socket1.on("connect", () => {
  socket1.emit("watcher");
});
socket1.on("broadcaster", () => {
  socket1.emit("watcher");
});
socket1.on("disconnectPeer", () => {
  peerConnection.close();
});
//
// window.onunload = window.onbeforeunload = () => {
//   socket.close();
// };

function enableAudio() {
  console.log("Enabling audio")
  video.muted = false;
}