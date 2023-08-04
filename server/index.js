require("dotenv").config(!!process.env.CONFIG ? {path: process.env.CONFIG} : {});
var express = require("express");
var bodyParser = require("body-parser");
var http = require("http");
var OpenVidu = require("openvidu-node-client").OpenVidu;
var cors = require("cors");
var app = express();
// MRSEO: timer 추가
const timerModule = require('./timer'); 

// Environment variable: PORT where the node server is listening
var SERVER_PORT = process.env.SERVER_PORT || 5050;
// Environment variable: URL where our OpenVidu server is listening
var OPENVIDU_URL = process.env.OPENVIDU_URL || 'http://localhost:8443';
// Environment variable: secret shared with our OpenVidu server
var OPENVIDU_SECRET = process.env.OPENVIDU_SECRET || 'NAMANMU';

// Enable CORS support
app.use(
  cors({
    origin: "*",
  })
);

var server = http.createServer(app);
var openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
let numClients = 0;
let redScore = 0;
let blueScore = 0;

const socketIO = require('socket.io');
const io = socketIO(server, {
  cors: {
    origin: "*",  // Allow all origins
    methods: ["GET", "POST"]  // Allow GET and POST methods
  }
});

io.on('connection', socket => {
  console.log('User connected');

  // 클라이언트가 연결될 때마다 클라이언트 수 증가
  numClients++;
  console.log('현재 클라이언트 수:', numClients);

  socket.on('joinRoom', (mySessionId) => {
    // console.log('$$$$$$$$$$$$$$$$$$$$$$$joinRoom: ', mySessionId);
    socket.join(mySessionId);
  });

  socket.on('drawing', (data) => {
    // console.log(data);
    // socket.to(data.mySessionId).emit('drawing', data);
    socket.broadcast.emit('drawing', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
    // 클라이언트가 연결 해제될 때마다 클라이언트 수 감소
    numClients--;
    console.log('현재 클라이언트 수:', numClients);
  });

  socket.on('clearCanvas', () => {
      socket.broadcast.emit('clearCanvas');
    });

  // MRSEO: 게임 시작
  socket.on('round1Start', () => {
    console.log('round1Start_server@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    io.emit('round1Countdown');
  });

  socket.on('startTimer1', () => {
    console.log('startTimer1_server@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    timerModule.startTimer(io, 50, () => {
      console.log('타이머 종료');
      io.emit('round1End');
    });
  });

  socket.on("round2Start", (redScoreCnt) => {
    console.log('round2Start_server@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    redScore = redScoreCnt;
    io.emit('round2Countdown');
  });

  socket.on('startTimer2', () => {
    console.log('startTimer2_server@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    timerModule.startTimer(io, 50, () => {
      console.log('타이머 종료');
      io.emit('round2End');
    });
  });


  socket.on('gameEnd', (blueScoreCnt) => {
    console.log('gameEnd_server@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    blueScore = blueScoreCnt;
    if (redScore > blueScore) {
      io.emit('result', 'red');
    } else if (redScore < blueScore) {
      io.emit('result', 'blue');
    } else {
      io.emit('result', 'draw');
    }
  });

});


// Allow application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Allow application/json
app.use(bodyParser.json());

// Serve static resources if available
app.use(express.static(__dirname + '/public'));

// Serve application
server.listen(SERVER_PORT, () => {
  console.log("Application started on port: ", SERVER_PORT);
  console.warn('Application server connecting to OpenVidu at ' + OPENVIDU_URL);
});

app.post("/api/sessions", async (req, res) => {
  var session = await openvidu.createSession(req.body);
  res.send(session.sessionId);
});

app.post("/api/sessions/:sessionId/connections", async (req, res) => {
  var session = openvidu.activeSessions.find(
    (s) => s.sessionId === req.params.sessionId
  );
  if (!session) {
    res.status(404).send();
  } else {
    var connection = await session.createConnection(req.body);
    res.send(connection.token);
  }
});

process.on('uncaughtException', err => console.error(err));