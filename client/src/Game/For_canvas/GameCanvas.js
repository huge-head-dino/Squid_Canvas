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

   // MRSEO:
  const {
    setCanSubmitAns,
    gamers,
    redScoreCnt, 
    blueScoreCnt,
  } = useStore(
    state => ({
      setCanSubmitAns: state.setCanSubmitAns,
      gamers: state.gamers,
      redScoreCnt: state.redScoreCnt,
      blueScoreCnt: state.blueScoreCnt,
    })
  )

    // MRSEO: 카운트 조건 초기화
    const [round1Countdown, setRound1Countdown] = useState(false);
    const [round2Countdown, setRound2Countdown] = useState(false);

   // MRSEO:
  useEffect(() => {

    // MRSEO: 이벤트 리스너 관리를 위한 함수 추가와 클린업 함수 추가
    const round1CountdownHandler = () => {
      console.log('round1Countdown_client@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      setRound1Countdown(true);
      setTimeout(() => {
        setRound1Countdown(false);
        setCanSubmitAns(true);
        console.log(useStore.getState().host, myUserName);
        if ( useStore.getState().host === myUserName ) {
          console.log("b4startTimer1@@@@@@@@@@@@@@@@@@@@@");
          socket.emit('startTimer1');
        }
      }, 5000)
    };


    const round2CountdownHandler = () => {
      setCanSubmitAns(false);
      console.log('round2Countdown_client@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      setRound2Countdown(true);
      setTimeout(() => {
        setRound2Countdown(false);
        setCanSubmitAns(true);
        console.log(useStore.getState().host, myUserName);
        if ( useStore.getState().host ===  myUserName ) {
          console.log("b4startTimer2@@@@@@@@@@@@@@@@@@@@@");
          socket.emit('startTimer2');
        }
      }, 5000)
    }


    const round2EndHandler = (result) => {
      console.log('result_client@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      // MRSEO: 게임 종료 후 결과 페이지로 이동

      if (result === 'red') {
        alert('레드팀 승리');
      } else if (result === 'blue') {
        alert('블루팀 승리');
      } else{
        alert('무승부');
      }
    }

    socket.on('round1Countdown', round1CountdownHandler);
    socket.on('round2Countdown', round2CountdownHandler);
    socket.on('round2End', round2EndHandler);

    return () => {
      socket.off('round1Countdown', round1CountdownHandler);
      socket.off('round2Countdown', round2CountdownHandler);
      socket.off('round2End', round2EndHandler);
    }
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
