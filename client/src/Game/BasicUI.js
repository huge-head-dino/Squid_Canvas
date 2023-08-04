import React, { useEffect, useState } from "react";
import UserVideoComponent from "../Openvidu/UserVideoComponent";
import useStore from "../store";
import "./BasicUI.css";

import {Row, Col, Button, Badge } from "react-bootstrap";
import socket from "../Openvidu/socket";

// 게임 컴포넌트
import GameCanvas from "./For_canvas/GameCanvas";


function BasicUI() {
    // MRSEO: 타이머 값 상태
    const [timerValue, setTimerValue] = useState(100);

  const {
    gamers,
    playerCount,
    setPlayerCount,
    myUserID,
    setMyIndex,
    curSession,
    redScoreCnt,
    blueScoreCnt,
    round,
    setRound,
    sortGamer,
    setCanSeeAns,
    setDrawable,
  } = useStore();

  useEffect(() => {
    if (curSession !== undefined) {
      setPlayerCount(gamers.length);
    }
    // 재 렌더링 되는 건 맞지만, 자식 요소가 재 렌더링 되지는 않음
    sortGamer();

  }, [gamers]);

    // MRSEO: 
    useEffect(() => {
      // 서버로부터 타이머 값을 수신하는 이벤트 리스너
      socket.on('timerUpdate', (value) => {
        console.log('timerUpdate_client@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        setTimerValue(value);
      })

      // MRSEO: 라운드를 2로 업데이트
      socket.on('round2Countdown', () => {
        setRound(2);
        // MRSEO: 게임 초기화
        GameInitializer();
      });

     }, []);

     // MRSEO: 게임 초기화
const GameInitializer = () => {
  if ( round === 1 ){
      for (let i = 0; i < gamers.length; i++) {
          if ( i === 0 ){
              setCanSeeAns(false, gamers[i].name);
              setDrawable(false, gamers[i].name);
          } else if ( i === 1 || i === 3) {
              setCanSeeAns(true, gamers[i].name);
              setDrawable(false, gamers[i].name);
          } else {
              setCanSeeAns(false, gamers[i].name);
              setDrawable(false, gamers[i].name);
          }
      }
  }

  if ( round === 2 ){
      for (let i = 0; i < gamers.length; i++) {
          if ( i === 1 ){
              setCanSeeAns(true, gamers[i].name);
              setDrawable(true, gamers[i].name);
          } else if ( i === 0 || i === 2) {
              setCanSeeAns(true, gamers[i].name);
              setDrawable(false, gamers[i].name);
          } else {
              setCanSeeAns(false, gamers[i].name);
              setDrawable(false, gamers[i].name);
          }
      }
  }
  // console.log(gamers);
}


  
    return (

      <>
      <div>
      <Row>
        <Col xs={3} style={{ color: 'white', textAlign: 'center' }}>
          <Button variant="outline-danger"><h1 style={{ fontWeight: 'bold' }}>RED SCORE : {redScoreCnt}</h1></Button>
        </Col>
        <Col xs ={3} style={{color: 'white', textAlign: 'center'}}>
          <Button variant="outline-success"><h1 style={{ fontWeight: 'bold' }}>라운드 : {round}</h1></Button>
        </Col>
        <Col xs ={3} style={{color: 'white', textAlign: 'center'}}>
          <Button variant="outline-warning"><h1 style={{ fontWeight: 'bold' }}>타이머 : {timerValue}</h1></Button>
        </Col>
        <Col xs ={3} style={{color: 'white', textAlign: 'center'}}>
          <Button variant="outline-primary"><h1 style={{ fontWeight: 'bold' }}>BLUE SCORE : {blueScoreCnt}</h1></Button>
        </Col>
      </Row>

      <Row style={{'width': '100%', margin: '10 auto'}}>
      
      <Col xs={3} className="User_Left">
        <div className="LeftVideoBox">
            <div className="VideoBox">
              <div id={0} className="VideoFrame_Out">
                {gamers[0] && (
                  <div className="VideoFrame_In">
                    <UserVideoComponent
                      streamManager={gamers[0].streamManager}
                      my_name={gamers[0].name}
                      key={gamers[0].name}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="VideoBox">
              <div id={2} className="VideoFrame_Out">
                {gamers[2] && (
                  <div className="VideoFrame_In">
                    <UserVideoComponent
                      streamManager={gamers[2].streamManager}
                      my_name={gamers[2].name}
                      key={gamers[2].name}
                    />
                  </div>
                )}
              </div>
            </div>
        </div>
      {/* </div> */}
      </Col>
      
      <Col xs={6}>
        <div className="GameCanvas_Right">
          <GameCanvas/>
        </div>
      </Col>
      
      <Col xs={3} className="User_Right">
        <div className="VideoBox">
        <div id={1} className="VideoFrame_Out">
          {gamers[1] && (
            <div className="VideoFrame_In">
              <UserVideoComponent
                streamManager={gamers[1].streamManager}
                my_name={gamers[1].name}
                key={gamers[1].name}

              />
            </div>
          )}
        </div>
      </div>

      <div className="VideoBox">
        <div id={3} className="VideoFrame_Out">
          {gamers[3] && (
            <div className="VideoFrame_In">
              <UserVideoComponent
                streamManager={gamers[3].streamManager}
                my_name={gamers[3].name}
                key={gamers[3].name}

              />
            </div>
          )}
        </div>
      </div>
    </Col>
    </Row>
    </div>
    </>
    );  
  }
  export default BasicUI;