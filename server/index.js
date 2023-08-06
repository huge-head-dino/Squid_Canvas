// ---- env
require("dotenv").config(!!process.env.CONFIG ? { path: process.env.CONFIG } : {});
// ---- dependencies
const OpenVidu = require("openvidu-node-client").OpenVidu;
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
const express = require("express");
const app = express();
const server = http.createServer(app);
// MRSEO: timer 추가
const timerModule = require('./timer');
const spyTimerModule = require('./spyTimer');

// ---- openvidu env
const SERVER_PORT = process.env.SERVER_PORT || 5050;
const OPENVIDU_URL = process.env.OPENVIDU_URL || 'http://localhost:8443';
const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET || 'NAMANMU';
const openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

// ---- middleware
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---- client num
let numClients = 0;
let redScore = 0;
let blueScore = 0;

// ---- socket.io
const io = socketIO(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
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
  socket.on('startSetting', () => {
    console.log('startTeamSetting_server@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    io.emit('setting');
  });
  socket.on('round1Start', () => {
    console.log('round1Start_server@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    io.emit('round1Countdown');
  });

  socket.on('sendScore', (team) => {
    console.log("sendScore_server@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    if (team === 'red') {
      redScore++;
    } else if (team === 'blue') {
      blueScore++;
    }
    io.emit('scoreUpdate', { redScore, blueScore });
  });

  socket.on('startTimer1', () => {
    console.log('startTimer1_server@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    timerModule.startTimer(io, 50, () => {
      console.log('타이머 종료');
      io.emit('round2Countdown');
    });
  });

  socket.on("round2Start", () => {
    console.log('round2Start_server@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    io.emit('round2Countdown');
  });

  socket.on('startTimer2', () => {
    console.log('startTimer2_server@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    timerModule.startTimer(io, 50, () => {
      console.log('타이머 종료');
      if (redScore > blueScore) {
        io.emit('round2End', 'red');
      } else if (redScore < blueScore) {
        io.emit('round2End', 'blue');
      } else {
        io.emit('round2End', 'draw');
      }
      redScore = 0;
      blueScore = 0;
    });
  });

  // ------------------------ JUNHO: 스파이모드 시작 ------------------------
  //TODO: 타이머 만들기
  
  const spyPlayers = [0, 1, 2, 3];
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // swap
    }
  }

  //1번 대기
  socket.on('spy1Ready', () => {
    console.log('spy1Ready');
    console.log(spyPlayers);
    //플레이어 순서 섞기
    shuffleArray(spyPlayers);
    console.log(spyPlayers);
    io.emit('spy1GO', spyPlayers[0]);
  });
  
  //1번 타이머 시작
  socket.on('startSpyTimer1', (spyPlayer1) => {
    console.log('startSpyTimer1');
    spyTimerModule.startTimer(io, 10, () => {
      console.log('1번 타이머 종료');
      io.emit('spyTimer1End', spyPlayer1)
    });
  });

  //2번 대기
  socket.on('spy2Ready', () => {
    console.log('spy2Ready');
    // console.log(spyPlayers);
    io.emit('spy2GO', spyPlayers[1]);
  });


  //2번 타이머 시작
  socket.on('startSpyTimer2', (spyPlayer2) => {
    console.log('startSpyTimer2');
    spyTimerModule.startTimer(io, 10, () => {
      console.log('2번 타이머 종료');
      io.emit('spyTimer2End', spyPlayer2);});
  });

  //3번 대기
  socket.on('spy3Ready', () => {
    console.log('spy3Ready');
    io.emit('spy3GO', spyPlayers[2]);
  });


  //3번 타이머 시작
  socket.on('startSpyTimer3', (spyPlayer3) => {
    console.log('startSpyTimer3');
    spyTimerModule.startTimer(io, 10, () => {
      console.log('3번 타이머 종료');
      io.emit('spyTimer3End', spyPlayer3);});

  });

  //4번 대기
  socket.on('spy4Ready', () => {
    console.log('spy4Ready');
    io.emit('spy4GO', spyPlayers[3]);
  });


  //4번 타이머 시작
  socket.on('startSpyTimer4', (spyPlayer4) => {
    console.log('startSpyTimer4');
    spyTimerModule.startTimer(io, 10, () => {
      console.log('4번 타이머 종료');
      io.emit('spyTimer4End', spyPlayer4);
  });

  // ------------------------ JUNHO: 스파이모드 끝 --------------------


  // MRSEO: 게임 종료

  // MRSEO: change Solver
  socket.on('req_changeSolver', (team) => {
    console.log('changeSolver_server@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    io.emit('res_changeSolver', team);
  });

  // // MRSEO: hacking painting
  // socket.on('req_hacking', (team) => {

  // });

  // SANGYOON: 2. Webcam.js에서 PASS 수신(on)
  socket.on('updateQuestWords', () => {
    updateQuestWords();
  })
});

// ---- Server Application Connect
server.listen(SERVER_PORT, () => {
  console.log("Application started on port: " + SERVER_PORT);
  console.warn('Application server connecting to OpenVidu at ' + OPENVIDU_URL);
});

// ---- Create Sessions
app.post("/api/sessions", async (req, res) => {
  const session = await openvidu.createSession(req.body);
  res.send(session.sessionId);
});

app.post("/api/sessions/:sessionId/connections", async (req, res) => {
  const session = openvidu.activeSessions.find(
    (s) => s.sessionId === req.params.sessionId
  );
  if (!session) {
    res.status(404).send();
  } else {
    const connection = await session.createConnection(req.body);
    res.send(connection.token);
  }
});

// ---- SANGYOON: MongoDB Conneting
// ---- local mongodb 가져오도록 설정됨
// NOTE: 배포 시, 주석 해제!
const { MONGO_URI } = process.env;
const mongoose = require("mongoose");
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(e => console.error(e));

// ---- SANGYOON: 제시어 받는 API
const FruitWord = require("./models/fruits");
let selectQuestWords = [];

const updateQuestWords = async () => {
  try {
    const FruitWords = await FruitWord.aggregate([{ $sample: { size: 20 } }]);
    selectQuestWords = FruitWords;
    const names = selectQuestWords.map((word) => word.name);
    console.log(names);
    io.emit('suggestWord', names); // 3. GameCanvas.js로 emit
  } catch (error) {
    console.log(error);
  };
};

process.on('uncaughtException', err => console.error(err));