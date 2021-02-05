// const peerConnections = {};
// let peerConnection;
// let socketId;
// const config = {
//   iceServers: [
//     {
//       "urls": "stun:stun.l.google.com:19302",
//     },
//   ]
// };
//
// const socket = io.connect(window.location.origin);
// socket.on("connect", () => {
//   socketId = socket.id;
//   //broadcaster
//   socket.on("answer", (id, description) => {
//     if(socketId !== id) {
//       peerConnections[id].setRemoteDescription(description);
//     }
//   });
//   socket.on("watcher", id => {
//     if(socketId !== id) {
//       const peerConnection = new RTCPeerConnection();
//       peerConnections[id] = peerConnection;
//
//       let stream = videoElement.srcObject;
//       stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
//
//       peerConnection.onicecandidate = event => {
//         if (event.candidate) {
//           socket.emit("candidate", id, event.candidate);
//         }
//       };
//       peerConnection
//         .createOffer()
//         .then(sdp => peerConnection.setLocalDescription(sdp))
//         .then(() => {
//           socket.emit("offer", id, peerConnection.localDescription);
//         });
//     }
//   });
//   socket.on("candidate", (id, candidate) => {
//     if(id === socketId) {
//       //broadcast
//       peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error('broadcaster', e));
//     }
//     if(id === socketId) {
//       //watcher
//       peerConnection
//         .addIceCandidate(new RTCIceCandidate(candidate))
//         .catch(e => console.error('watcher', e));
//     }
//   });
//   socket.on("disconnectPeer", id => {
//     if(id) {
//       //broadcast
//       peerConnections[id].close();
//       delete peerConnections[id];
//     } else {
//       //watcher
//       peerConnection.close();
//     }
//
//   });
//   window.onunload = window.onbeforeunload = () => {
//     socket.close();
//   };
//
//   //watcher
//   socket.on("offer", (id, description) => {
//     if(id !== socketId) {
//       console.log('offer')
//       console.log(peerConnections)
//       console.log(peerConnection)
//       peerConnection = new RTCPeerConnection();
//       peerConnection
//         .setRemoteDescription(description)
//         .then(() => peerConnection.createAnswer())
//         .then(sdp => peerConnection.setLocalDescription(sdp))
//         .then(() => {
//           socket.emit("answer", id, peerConnection.localDescription);
//         });
//       peerConnection.ontrack = event => {
//         outputElement.srcObject = event.streams[0];
//       };
//       peerConnection.onicecandidate = event => {
//         if (event.candidate) {
//           socket.emit("candidate", id, event.candidate);
//         }
//       };
//     }
//   });
//   socket.on("broadcaster", () => {
//     socket.emit("watcher");
//   });
//
// // Get camera and microphone
//   const videoElement = document.querySelector("video");
//   const outputElement = document.querySelector("#watcher");
//   const audioSelect = document.querySelector("select#audioSource");
//   const videoSelect = document.querySelector("select#videoSource");
//
//   audioSelect.onchange = getStream;
//   videoSelect.onchange = getStream;
//
//   getStream()
//     .then(getDevices)
//     .then(gotDevices);
//   socket.emit("watcher");
//   function getDevices() {
//     return navigator.mediaDevices.enumerateDevices();
//   }
//
//   function gotDevices(deviceInfos) {
//     window.deviceInfos = deviceInfos;
//     for (const deviceInfo of deviceInfos) {
//       const option = document.createElement("option");
//       option.value = deviceInfo.deviceId;
//       if (deviceInfo.kind === "audioinput") {
//         option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
//         audioSelect.appendChild(option);
//       } else if (deviceInfo.kind === "videoinput") {
//         option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
//         videoSelect.appendChild(option);
//       }
//     }
//   }
//
//   function getStream() {
//     if (window.stream) {
//       window.stream.getTracks().forEach(track => {
//         track.stop();
//       });
//     }
//     const audioSource = audioSelect.value;
//     const videoSource = videoSelect.value;
//     const constraints = {
//       audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
//       video: { deviceId: videoSource ? { exact: videoSource } : undefined }
//     };
//     return navigator.mediaDevices
//       .getUserMedia(constraints)
//       .then(gotStream)
//       .catch(handleError);
//   }
//
//   function gotStream(stream) {
//     window.stream = stream;
//     audioSelect.selectedIndex = [...audioSelect.options].findIndex(
//       option => option.text === stream.getAudioTracks()[0].label
//     );
//     videoSelect.selectedIndex = [...videoSelect.options].findIndex(
//       option => option.text === stream.getVideoTracks()[0].label
//     );
//     videoElement.srcObject = stream;
//     socket.emit("broadcaster");
//   }
//
//   function handleError(error) {
//     console.error("Error: ", error);
//   }
// });
//
//
