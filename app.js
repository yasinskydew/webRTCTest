const fs = require('fs');
const path = require('path');
const url = require('url');
let httpServer = require('http');

const ioServer = require('socket.io');
const RTCMultiConnectionServer = require('rtcmulticonnection-server');

let PORT = 9001;
let isUseHTTPs = false;

const jsonPath = {
  config: 'config.json',
  logs: 'logs.json'
};

const BASH_COLORS_HELPER = RTCMultiConnectionServer.BASH_COLORS_HELPER;
const getValuesFromConfigJson = RTCMultiConnectionServer.getValuesFromConfigJson;
const getBashParameters = RTCMultiConnectionServer.getBashParameters;

var config = getValuesFromConfigJson(jsonPath);
config = getBashParameters(config, BASH_COLORS_HELPER);

// if user didn't modifed "PORT" object
// then read value from "config.json"
if(PORT === 9001) {
  PORT = config.port;
}
if(isUseHTTPs === false) {
  isUseHTTPs = config.isUseHTTPs;
}

function serverHandler(request, response) {
  // to make sure we always get valid info from json file
  // even if external codes are overriding it
  config = getValuesFromConfigJson(jsonPath);
  config = getBashParameters(config, BASH_COLORS_HELPER);

  response.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  response.write('RTCMultiConnection Socket.io Server');
  response.end();
}

let httpApp;

if (isUseHTTPs) {
  httpServer = require('https');

  // See how to use a valid certificate:
  // https://github.com/muaz-khan/WebRTC-Experiment/issues/62
  let options = {
    key: null,
    cert: null,
    ca: null
  };

  let pfx = false;

  if (!fs.existsSync(config.sslKey)) {
    console.log(BASH_COLORS_HELPER.getRedFG(), 'sslKey:\t ' + config.sslKey + ' does not exist.');
  } else {
    pfx = config.sslKey.indexOf('.pfx') !== -1;
    options.key = fs.readFileSync(config.sslKey);
  }

  if (!fs.existsSync(config.sslCert)) {
    console.log(BASH_COLORS_HELPER.getRedFG(), 'sslCert:\t ' + config.sslCert + ' does not exist.');
  } else {
    options.cert = fs.readFileSync(config.sslCert);
  }

  if (config.sslCabundle) {
    if (!fs.existsSync(config.sslCabundle)) {
      console.log(BASH_COLORS_HELPER.getRedFG(), 'sslCabundle:\t ' + config.sslCabundle + ' does not exist.');
    }

    options.ca = fs.readFileSync(config.sslCabundle);
  }

  if (pfx === true) {
    options = {
      pfx: sslKey
    };
  }

  httpApp = httpServer.createServer(options, serverHandler);
} else {
  httpApp = httpServer.createServer(serverHandler);
}

RTCMultiConnectionServer.beforeHttpListen(httpApp, config);
httpApp = httpApp.listen(process.env.PORT || PORT, process.env.IP || "0.0.0.0", function() {
  RTCMultiConnectionServer.afterHttpListen(httpApp, config);
});

// --------------------------
// socket.io codes goes below

ioServer(httpApp).on('connection', function(socket) {
  RTCMultiConnectionServer.addSocket(socket, config);

  // ----------------------
  // below code is optional

  const params = socket.handshake.query;

  if (!params.socketCustomEvent) {
    params.socketCustomEvent = 'custom-message';
  }

  socket.on(params.socketCustomEvent, function(message) {
    socket.broadcast.emit(params.socketCustomEvent, message);
  });
});