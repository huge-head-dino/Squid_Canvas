// spyTimer.js
let timerSeconds = 10;
let intervalId = null;


// 타이머 값을 1초마다 감소시키고 클라이언트들에게 전달하는 함수
const startTimer = (io, initialTimerSeconds = 10, callback) => {
  console.log('타이머 시작');
  // MRSEO: 타이머 값 초기화
  timerSeconds = initialTimerSeconds; // set the initial timer seconds
  intervalId = setInterval(() => { 
    sendTimerValueToClients(io);
    timerSeconds--;

    if (timerSeconds < 0) {
      clearInterval(intervalId); // 타이머 중지
      // TODO: 게임 종료 처리
      // MRSEO: 타이머 값 초기화
      timerSeconds = initialTimerSeconds;
      //MRSEO: 타이머 종료 후 콜백 함수 호출
      if (typeof callback === 'function') {
        callback(); // 콜백 함수 호출
      }
    }
  }, 1000);
};

// 타이머 값을 클라이언트들에게 전달하는 함수
const sendTimerValueToClients = (io) => {
  //JANG: 타이머 수정
  console.log("타이머 진행")
  io.emit('spyTimerUpdate', timerSeconds);
};

// 현재 타이머 값을 가져오는 함수
const getTimerValue = () => {
  return timerSeconds;
};

const getIntervalId = () => {
  return intervalId;
}

module.exports = {
  startTimer,
  getTimerValue,
  getIntervalId,
};
