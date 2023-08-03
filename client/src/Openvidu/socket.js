import io from "socket.io-client";

const socket = io("https://mysquidcanvas.shop", {
  // CORS 설정 (클라이언트와 다른 도메인에서 접근 가능하도록 설정)
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  reconnectionDelayMax: 10000, // 최대 재연결 시간 간격 (10초)
});

socket.on("connect", () => {
    console.log("first socket connected");
});
socket.on("connect_error", (error) => {
    console.log("error : ", error);
});

export default socket;