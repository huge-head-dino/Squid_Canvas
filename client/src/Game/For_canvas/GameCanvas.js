import React, { useContext, useEffect, useState } from "react";
import RealCanvas from './RealCanvas'
import Countdown from '../Countdown'
import socket from '../../Openvidu/socket'

// YEONGWOO: context 추가
import SessionContext from '../../Openvidu/SessionContext'

import './GameCanvas.css'
import useStore from "../../store";

import {Col} from 'react-bootstrap'


function GameCanvas() {
  const { mySessionId, myUserName } = useContext(SessionContext);
  console.log("##########################sessionId : ", mySessionId, myUserName);

   // MRSEO:
  const {
    canSubmitAns,
    setCanSubmitAns,
  } = useStore()

    // MRSEO: 카운트 조건 초기화
    const [round1Countdown, setRound1Countdown] = useState(false);
    const [round2Countdown, setRound2Countdown] = useState(false);

   // MRSEO:
  useEffect(() => {
    socket.on('round1Countdown', () => {
      console.log('round1Countdown_client@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      setRound1Countdown(true);
      setTimeout(() => {
        setRound1Countdown(false);
        setCanSubmitAns(true);
        socket.emit('startTimer1');
      }, 5000)
    });
  
    socket.on('round2Countdown', () => {
      setCanSubmitAns(false);
      console.log('round2Countdown_client@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      setRound2Countdown(true);
      setTimeout(() => {
        setRound2Countdown(false);
        setCanSubmitAns(true);
        socket.emit('startTimer2');
      }, 5000)
    });

    socket.on('gameEnd', () => {
      console.log('gameEnd_client@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      // MRSEO: 게임 종료 후 결과 페이지로 이동
      let redScoreCnt = useStore.getState().redScoreCnt;
      let blueScoreCnt = useStore.getState().blueScoreCnt;
      console.log('redScoreCnt: ', redScoreCnt);
      console.log('blueScoreCnt: ', blueScoreCnt);
      if (redScoreCnt > blueScoreCnt) {
        alert('레드팀 승리');
      } else if (redScoreCnt < blueScoreCnt) {
        alert('블루팀 승리');
      } else{
        alert('무승부');
      }
    });
  }, [socket]);


  return (
    <>
      <Col>
      <div className="RealCanvas_3">
        <div className='RealCanvas_2' style={{ height: "100%"}}>
          <RealCanvas mySessionId = { mySessionId } myUserName = {myUserName}/>
          <h1 style={{ fontWeight: "bold" }}>사과</h1>
        </div>
        <div className='ButtonZone'>
          <div style={{ position: "absolute", marginBottom: 'auto', color: "gray", fontSize: "24px", zIndex: 100 }}>
          {/* MRSEO: 조건 추가 */}

          <div>
              {round1Countdown === true ? (
                  <>
                  <h1 style={{ fontWeight: "bold" }}>레드팀 준비해주세요~!</h1>
                  < Countdown />
                  </>
              ): null}
              {round2Countdown === true ? (
                  <>
                  <h1 style={{ fontWeight: "bold" }}>블루팀 준비해주세요~!</h1>
                  < Countdown />
                  </>
              ): null}
               </div>

          </div>
        </div>
      </div>
      </Col>
    </>
  );
}

export default GameCanvas;
