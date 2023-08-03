// timer.js
let timerSeconds = 50;

// 타이머 값을 1초마다 감소시키고 클라이언트들에게 전달하는 함수
const startTimer = (io) => {
  console.log('타이머 시작');
  let intervalId = setInterval(() => { 
    sendTimerValueToClients(io);
    timerSeconds--;

    if (timerSeconds === -1) {
        clearInterval(intervalId); // 타이머 중지
        // TODO: 게임 종료 처리
    }
  }, 1000);
};

// 타이머 값을 클라이언트들에게 전달하는 함수
const sendTimerValueToClients = (io) => {
  io.emit('timerUpdate', timerSeconds);
};

// 현재 타이머 값을 가져오는 함수
const getTimerValue = () => {
  return timerSeconds;
};

module.exports = {
  startTimer,
  getTimerValue,
};
