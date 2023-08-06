import React, { useContext, useEffect, useState } from "react";
import RealCanvas from './RealCanvas'
import Countdown from '../Countdown'
import socket from '../../Openvidu/socket'

// YEONGWOO: context 추가
import SessionContext from '../../Openvidu/SessionContext'

import './GameCanvas.css'
import useStore from "../../store";

// JANG: 08.06 - chakra-ui 추가 + react-bootstrap 변경할 것!
import {Box, 
  Input,
} from '@chakra-ui/react'
import {Button, Col} from 'react-bootstrap'


function GameCanvas() {
  const { mySessionId, myUserName } = useContext(SessionContext);

   // MRSEO:
  const {
    setCanSubmitAns,
    gamers,
    redScoreCnt, 
    blueScoreCnt,
    host,
    setSpyPainter,
    setIAmSpy,
    round,
    team,
    iAmSolver,
    setIAmPainter,
    iAmPainter,
    setCanSeeAns,
    setDrawable,
    phase,
    setIAmSolver,
    ans,
    setRedScoreCnt,
    setBlueScoreCnt,
    setAns,
  } = useStore(
    state => ({
      setCanSubmitAns: state.setCanSubmitAns,
      gamers: state.gamers,
      redScoreCnt: state.redScoreCnt, 
      blueScoreCnt: state.blueScoreCnt,
      host: state.host,
      setSpyPainter: state.setSpyPainter,
      setIAmSpy: state.setIAmSpy,
      round: state.round,
      team: state.team,
      iAmSolver: state.iAmSolver,
      setIAmPainter: state.setIAmPainter,
      iAmPainter: state.iAmPainter,
      setCanSeeAns: state.setCanSeeAns,
      setDrawable: state.setDrawable,
      phase: state.phase,
      setIAmSolver: state.setIAmSolver,
      ans: state.ans,
      setRedScoreCnt: state.setRedScoreCnt,
      setBlueScoreCnt: state.setBlueScoreCnt,
      setAns: state.setAns,
    })
  )

    // MRSEO: 카운트 조건 초기화
    const [round1Countdown, setRound1Countdown] = useState(false);
    const [round2Countdown, setRound2Countdown] = useState(false);
    //JUNHO: (1)
    const [spyCountdown, setSpyCountdown] = useState(false);
    // MRSEO: 정답 제출 가능 여부
    const [iAmSolverRender, setIAmSolverRender] = useState(false);



   // MRSEO:
  useEffect(() => {

    // MRSEO: 이벤트 리스너 관리를 위한 함수 추가와 클린업 함수 추가
    const round1CountdownHandler = () => {
      console.log('round1Countdown_client@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      setRound1Countdown(true);
      setTimeout(() => {
        setRound1Countdown(false);
        setCanSubmitAns(true);
        
        //SANGYOON: 스타트 버튼 누르면 제시어 생성
        socket.emit('updateQuestWords');

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

  // MRSEO: 정답 제출 가능 여부 시작
  useEffect(() => {
    if ( phase === 'Game1' ) {
      if ( gamers[2].name === myUserName ){
        setIAmSolverRender(true);
      }
    } else if ( phase === 'Game2' ) {
      if ( gamers[3].name === myUserName ){
        setIAmSolverRender(true);
      }
    }
  },[phase]);

  useEffect(() => {
    if (round === 1 && team === 'red' ){
      console.log("redteam iAmSolverRender@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
      setIAmSolverRender(!iAmSolverRender)
    } else if (round === 2 && team === 'blue' ){
      console.log("blueteam iAmSolverRender@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
      setIAmSolverRender(!iAmSolverRender)
    }
  },[iAmSolver]);


  useEffect(() => {

    const res_changeSolverHandler = (res_team) => {
      console.log('res_changeSolver_client@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      if ( res_team === team ){
        setIAmSolver(!iAmSolver);
        setIAmPainter(!iAmPainter);
      } 
    }

    socket.on('res_changeSolver', res_changeSolverHandler);

    return () => {
      socket.off('res_changeSolver', res_changeSolverHandler);
    }
  },[socket, team, iAmSolver]);

  // MRSEO: 정답 제출
  const submitAns = () => {
    if ( !useStore.getState().canSubmitAns ) return;
    if ( round === 1 ){
      if ( ans === suggestWord ){
        
        setCanSeeAns(!gamers[0].canSeeAns, gamers[0].name);
        setDrawable(!gamers[0].drawable, gamers[0].name);

        setCanSeeAns(!gamers[2].canSeeAns, gamers[2].name);
        setDrawable(!gamers[2].drawable, gamers[2].name);

        setRedScoreCnt(redScoreCnt + 1);

        socket.emit('sendScore', team);
        socket.emit('req_changeSolver', 'red')
        socket.emit('updateQuestWords')
      }
    }
    if ( round === 2 ){
      if ( ans === suggestWord ){

        setCanSeeAns(!gamers[1].canSeeAns, gamers[1].name);
        setDrawable(!gamers[1].drawable, gamers[1].name);

        setCanSeeAns(!gamers[3].canSeeAns, gamers[3].name);
        setDrawable(!gamers[3].drawable, gamers[3].name);

        setBlueScoreCnt(blueScoreCnt + 1);

        socket.emit('sendScore', team);
        socket.emit('req_changeSolver', 'blue');
        socket.emit('updateQuestWords')
      }
    }
      setAns('');
  };

  // MRSEO: 정답 제출 가능 여부 끝

  // SANGYOON: 4. 제시어를 서버(index.js)에서 수신
  const [suggestWord, setSuggestWord] = useState('');

  useEffect(() => {
    const suggestWords = (names) => {
      const word = names[0];
      setSuggestWord(word);
    };
    socket.on('suggestWord', suggestWords);

    return () => {
      socket.off('suggestWord', suggestWords);
    };
  }, []);
 

  

  // JUNHO: 스파이모드 시작
  const [spyTimerValue, setSpyTimerValue] = useState(0);
  
  useEffect(() => {
    // 보이는 타이머 업데이트
    const spyTimerUpdateHandler = (value) => {
      console.log('timerUpdate_client@@@@@@@@@@@@@@@@');
      setSpyTimerValue(value);
    };

    socket.on('spy1GO', (spyPlayer1) => {
      console.log('spy1GO');
      console.log("spyPlayerIndex: "+ spyPlayer1);
      setSpyCountdown(true);
      setTimeout(() => {
        setSpyCountdown(false);
        if ( gamers[spyPlayer1].name === myUserName ) {
          setSpyPainter(true);
        }
        if (host === myUserName) {
          socket.emit('startSpyTimer1', spyPlayer1);
        }
      }, 5000);
    });

    socket.on('spyTimer1End', (spyPlayer1) => {
      console.log('spyTimer1End');
      if ( gamers[spyPlayer1].name === myUserName ) {
        setSpyPainter(false);
      }
      if (host === myUserName) {
        socket.emit('spy2Ready');
      }
    });

    socket.on('spy2GO', (spyPlayer2) => {
      console.log('spy2GO');
      setSpyCountdown(true);
      setTimeout(() => {
        setSpyCountdown(false);
        if ( gamers[spyPlayer2].name === myUserName ) {
          setSpyPainter(true);
        }
        if (host === myUserName) {
          socket.emit('startSpyTimer2', spyPlayer2);
        }
      }, 5000);
    });

    socket.on('spyTimer2End', (spyPlayer2) => {
      console.log('spyTimer2End');
      if ( gamers[spyPlayer2].name === myUserName ) {
        setSpyPainter(false);
      }
      if (host === myUserName) {
        socket.emit('spy3Ready');
      }
    });

    socket.on('spy3GO', (spyPlayer3) => {
      console.log('spy3GO');
      setSpyCountdown(true);
      setTimeout(() => {
        setSpyCountdown(false);
        if ( gamers[spyPlayer3].name === myUserName ) {
          setSpyPainter(true);
        }
        if (host === myUserName) {
          socket.emit('startSpyTimer3', spyPlayer3);
        }
      }, 5000);
    });

    socket.on('spyTimer3End', (spyPlayer3) => {
      console.log('spyTimer3End');
      if ( gamers[spyPlayer3].name === myUserName ) {
        setSpyPainter(false);
      }
      if (host === myUserName) {
        socket.emit('spy4Ready');
      }
    });

    socket.on('spy4GO', (spyPlayer4) => {
      console.log('spy4GO');
      setSpyCountdown(true);
      setTimeout(() => {
        if ( gamers[spyPlayer4].name === myUserName ) {
          setSpyPainter(true);
        }
        setSpyCountdown(false);
        if (host === myUserName) {
          socket.emit('startSpyTimer4', spyPlayer4);
        }
      }, 5000);
    });

    socket.on('spyTimer4End', (spyPlayer4) => {
      if ( gamers[spyPlayer4].name === myUserName ) {
        setSpyPainter(false);
      }
      console.log('모든 과정이 종료되었습니다.');
    });


    socket.on('spyTimerUpdate', spyTimerUpdateHandler);
    return () => {
      socket.off('spyTimerUpdate', spyTimerUpdateHandler);
      socket.off('spy1GO');
      socket.off('spy2GO');
      socket.off('spy3GO');
      socket.off('spy4GO');
      socket.off('spyTimer1End');
      socket.off('spyTimer2End');
      socket.off('spyTimer3End');
      socket.off('spyTimer4End');
    }

  },[socket, myUserName]);


  // JUNHO: 스파이 모드 시작 버튼 핸들러// 루프 시작하는 버튼
  const spyButtonHandler = () => {
    socket.emit('spy1Ready');
    // gamers[0].name === myUserName ? setIAmPainter(false) : setIAmPainter(true);
  };

  // JUNHO: 스파이모드 끝

  return (
    <>
      {/* JANG: 08.06 - ★★★ 이 부분 어떻게 처리할 건지?!! */}

      <Col>
      <div className="RealCanvas_3">
        <div className='RealCanvas_2' style={{ height: "100%"}}>
          <RealCanvas mySessionId = { mySessionId } myUserName = {myUserName}/>
          {/* SANGYOON: 제시어 */}
          {!iAmSolverRender && <h1 style={{ color: "tomato" }}>제시어 : {suggestWord}</h1>}
        </div>
        <div className='ButtonZone'>
          {phase === 'Game1' || phase === 'Game2' ? (
              <>
              {/* MRSEO: 조건 수정 */}
              { ( round === 1 && team === 'red' && iAmSolverRender === true) || ( round === 2 && team === 'blue' && iAmSolverRender === true ) ?
                  (
                  // JANG: TODO - 정답 입력창 css 수정
                    <div>
                      <Input placeholder='정답을 입력하시오' value={ans} onChange={(e) => setAns(e.target.value)}/>
                      <Button colorScheme='blue' onClick={submitAns}>제출</Button>
                    </div> 
                  ):null}
              </>
            ):null}


          {/* // JUNHO: 스파이모드 시작 */}
          <div className="junhozone">
            <Button colorScheme="red" flex="1" color="white" size="lg"
             m='10px' className="junhobtn" onClick={spyButtonHandler}>스파이모드 시작</Button>

            <h2></h2>

            <Button colorScheme="yellow" flex="1" color="white" size="lg">
              <h1 style={{ fontWeight: "bold" }}>타이머 : {spyTimerValue}</h1>
            </Button>
          
            {spyCountdown &&<Countdown />}
      
          </div>
           {/* // JUNHO: 스파이모드 끝 */}


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
    
    {/* JANG: 08.06 - ★★★ 이 부분 어떻게 처리할 건지?!! */}


    </>
  );
}

export default GameCanvas;
