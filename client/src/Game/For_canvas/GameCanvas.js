import React, { useContext, useEffect, useState } from "react";
import RealCanvas from "./RealCanvas";
import Countdown from "../Countdown";
import socket from "../../Openvidu/socket";

// YEONGWOO: context 추가
import SessionContext from "../../Openvidu/SessionContext";

import "./GameCanvas.css";
import useStore from "../../store";

// SANGYOON: Sound Effect
import { RoundMusic, SubmitSound, CorrectAnswer, WrongAnswer } from "../audio";

// JANG: 08.06 - chakra-ui 추가 + react-bootstrap 변경할 것!
import { Box, Input, Flex, Grid, Button, Img } from "@chakra-ui/react";

function GameCanvas() {
  const { mySessionId, myUserName } = useContext(SessionContext);

  // MRSEO:
  const {
    setCanSubmitAns,
    gamers,
    redScoreCnt,
    blueScoreCnt,
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
    myUserId,
    audio,
    setAudio,
    setAudioStatus,
    canvas,
    setCanvas,
  } = useStore((state) => ({
    setCanSubmitAns: state.setCanSubmitAns,
    gamers: state.gamers,
    redScoreCnt: state.redScoreCnt,
    blueScoreCnt: state.blueScoreCnt,
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
    myUserId: state.myUserId,
    audio: state.audio,
    setAudio: state.setAudio,
    setAudioStatus: state.setAudioStatus,
    canvas: state.canvas,
    setCanvas: state.setCanvas,
  }));

  // MRSEO: 카운트 조건 초기화
  const [round1Countdown, setRound1Countdown] = useState(false);
  const [round2Countdown, setRound2Countdown] = useState(false);

  // MRSEO: 정답 제출 가능 여부
  const [iAmSolverRender, setIAmSolverRender] = useState(false);

  const [correctRender, setCorrectRender] = useState(false);
  const [incorrectRender, setIncorrectRender] = useState(false);
  const [blinking, setBlinking] = useState(false);


  // MRSEO:

  // JUNHO: 깜박이는 애니메이션
  const handleButtonClick = () => {
    setBlinking(true);

    // 10초 후에 깜박거리는 효과 종료
    setTimeout(() => {
      setBlinking(false);
    }, 10000);
  };
  // JUNHO: 깜박이는 애니메이션

  useEffect(() => {
    // MRSEO: 이벤트 리스너 관리를 위한 함수 추가와 클린업 함수 추가
    const round1CountdownHandler = () => {
      console.log("Round 1 - Countdown_client !!!!!");
      // MRSEO:  red팀 소리 끄기
      for (let i = 0; i < gamers.length; i++) {
        if (i === 0 || i === 2) {
          setAudioStatus(false, myUserId);
          setAudio(false);
        }
      }
      setRound1Countdown(true);
      setTimeout(() => {
        setRound1Countdown(false);
        setCanSubmitAns(true);
        console.log(useStore.getState().host, myUserName);
        if (useStore.getState().host === myUserName) {
          //SANGYOON: 스타트 버튼 누르면 제시어 생성
          socket.emit("updateQuestWords_Com");
          console.log("Round 1 - 제시어 나옴");
          console.log("startTimer 1 on");
          socket.emit("startTimer1");
        }
      }, 3000);
    };

    const round2CountdownHandler = () => {
      // MRSEO:  red팀 소리 켜기
      for (let i = 0; i < gamers.length; i++) {
        if ((i === 0 || i === 2) && gamers[i].name === myUserId) {
          setAudioStatus(true, myUserId);
          setAudio(true);
        }
      }
      setCanSubmitAns(false);
      console.log("Round 2 - Countdown_client !!!!!");
      setRound2Countdown(true);
      setTimeout(() => {
        setRound2Countdown(false);
        setCanSubmitAns(true);
        console.log(useStore.getState().host, myUserName);
        if (useStore.getState().host === myUserName) {
          //SANGYOON: 스타트 버튼 누르면 제시어 생성
          RoundMusic.play();
          RoundMusic.volume = 0.3;
          socket.emit("updateQuestWords_Com");
          console.log("Round 2 - 제시어 나옴");
          console.log("startTimer 2 on");
          socket.emit("startTimer2");
        }
      }, 3000);
    };

    const round2EndHandler = (result) => {
      console.log("Result_client !!!!");
      // MRSEO: 게임 종료 후 결과 페이지로 이동
      if (result === "red") {
        alert("레드팀 승리");
      } else if (result === "blue") {
        alert("블루팀 승리");
      } else {
        alert("무승부");
      }
      gameCanvasInitializer();
      if (useStore.getState().host === myUserName) {
        socket.emit("completitionFinish"); // competionGameFinish 이벤트 발생으로 게임 종료 후 결과 페이지로 이동
      }
    };

    socket.on("round1Countdown", round1CountdownHandler);
    socket.on("round2Countdown", round2CountdownHandler);
    socket.on("round2End", round2EndHandler);

    return () => {
      socket.off("round1Countdown", round1CountdownHandler);
      socket.off("round2Countdown", round2CountdownHandler);
      socket.off("round2End", round2EndHandler);
    };
  }, [socket]);

  // MRSEO: 정답 제출 가능 여부 시작
  useEffect(() => {
    if (phase === "Game1") {
      if (gamers[2].name === myUserName) {
        setIAmSolverRender(true);
      }
    } else if (phase === "Game2") {
      if (gamers[3].name === myUserName) {
        setIAmSolverRender(true);
        //YEONGWOO: 월요일 데모 직전 수정) 방해하기 버튼 가진 사람이 제시어가 안보이는 버그 수정
      } else if (gamers[0].name === myUserName) {
        setIAmSolverRender(false);
      } else if (gamers[2].name === myUserName) {
        setIAmSolverRender(false);
      }
    }
  }, [phase]);

  useEffect(() => {
    if (round === 1 && team === "red") {
      console.log("redteam iAmSolverRender@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      setIAmSolverRender(!iAmSolverRender);
    } else if (round === 2 && team === "blue") {
      console.log(
        "blueteam iAmSolverRender@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
      );
      setIAmSolverRender(!iAmSolverRender);
    }
  }, [iAmSolver]);

  useEffect(() => {
    const res_changeSolverHandler = (res_team) => {
      console.log("res_changeSolver_client@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      if (res_team === team) {
        setIAmSolver(!iAmSolver);
        setIAmPainter(!iAmPainter);
      }
    };

    socket.on("res_changeSolver", res_changeSolverHandler);

    return () => {
      socket.off("res_changeSolver", res_changeSolverHandler);
    };
  }, [socket, team, iAmSolver]);

  useEffect(() => {
    socket.on('clearCanvasBySubmit', () => {
      canvas?.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    })

    return () => {
      socket.off('clearCanvasBySubmit');
    }
  }, [socket, canvas]);

  // 경쟁모드 정답 제출 시 정답, 오답 알림
  useEffect(() => {
    socket.on('correctAnswer', () => {
      setCorrectRender(true);
      setTimeout(() => {
        setCorrectRender(false);
      }, 1000);
    });

    socket.on('incorrectAnswer', () => {
      setIncorrectRender(true);
      setTimeout(() => {
        setIncorrectRender(false);
      }, 1000);
    });

    return () => {
      socket.off('correctAnswer');
      socket.off('incorrectAnswer');
    }
  }, [socket, correctRender, incorrectRender]);

  // MRSEO: 정답 제출
  const submitAns = () => {
    // SubmitSound.play(); // SANGYOON: 정답, 오답시 sound effect 추가
    if (!useStore.getState().canSubmitAns) return;
    if (round === 1) {
      if (ans === suggestWord) {
        CorrectAnswer.play();
        socket.emit("clearCanvasBySubmit");

        setCanSeeAns(!gamers[0].canSeeAns, gamers[0].name);
        setDrawable(!gamers[0].drawable, gamers[0].name);

        setCanSeeAns(!gamers[2].canSeeAns, gamers[2].name);
        setDrawable(!gamers[2].drawable, gamers[2].name);

        setRedScoreCnt(redScoreCnt + 1);

        socket.emit('correctAnswer')

        socket.emit("sendScore", team);
        socket.emit("req_changeSolver", "red");
        socket.emit("updateQuestWords_Com");
      } else {
        WrongAnswer.play();

        socket.emit('incorrectAnswer')
      }
    }
    if (round === 2) {
      if (ans === suggestWord) {
        CorrectAnswer.play();
        socket.emit("clearCanvasBySubmit");

        setCanSeeAns(!gamers[1].canSeeAns, gamers[1].name);
        setDrawable(!gamers[1].drawable, gamers[1].name);

        setCanSeeAns(!gamers[3].canSeeAns, gamers[3].name);
        setDrawable(!gamers[3].drawable, gamers[3].name);

        setBlueScoreCnt(blueScoreCnt + 1);

        socket.emit('correctAnswer')

        socket.emit("sendScore", team);
        socket.emit("req_changeSolver", "blue");
        socket.emit("updateQuestWords_Com");
      } else {
        WrongAnswer.play();

        socket.emit('incorrectAnswer')
      }
    }
    setAns("");
  };

  // MRSEO: 정답 제출 가능 여부 끝

  // MRSEO: 관전팀 그리기
  const hacking = () => {
    console.log("hacking@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    setIAmPainter(true);
    setTimeout(() => {
      setIAmPainter(false);
    }, 5000);
  };

  // SANGYOON: 1. PASS 누르면 서버(index.js)로 발신(emit)
  const handlePass = () => {
    SubmitSound.play(); // sound 추가
    socket.emit("updateQuestWords_Com");
  };

  // SANGYOON: 4. 제시어를 서버(index.js)에서 수신
  const [suggestWord, setSuggestWord] = useState("");

  useEffect(() => {
    const suggestWords = (names) => {
      const word = names;
      setSuggestWord(word);
    };
    socket.on("suggestWord", suggestWords);

    return () => {
      socket.off("suggestWord", suggestWords);
    };
  }, []);

  const gameCanvasInitializer = () => {
    setRound1Countdown(false);
    setRound2Countdown(false);
    setIAmSolverRender(false);
    setSuggestWord("");
    setCanSubmitAns(false);
    setIAmPainter(true);
    setCanSeeAns(true, myUserId);
    setDrawable(true, myUserId);
    setIAmSolver(false);
    setRedScoreCnt(0);
    setBlueScoreCnt(0);
    setAns("");
  };

  return (
    <>
      {/* JANG: 08 - 1. 캔버스 크기 및 제시어 조정 */}
      <Flex
        width="100%"
        height="100%"
        className="RealCanvas_3"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        marginTop="0px"
        animation={blinking ? "blinking 1s infinite" : ""}
      >
        {/* 캔버스 상단 - 제시어 0.5 */}
        {/* JANG: 폰트 크기, 굵기, 스타일 수정! */}
        <Flex
          className="제시어"
          textAlign="center"
          justifyContent="center"
          alignItems="center"
          flex="1"
        >
          {!iAmSolverRender && (
            <h1 style={{ color: "white" }}>제시어 : {suggestWord}</h1>
          )}
        </Flex>

        {/* 캔버스 중단 - 진짜 캔버스 8*/}
        <Flex
          className="진짜_캔버스"
          justifyContent="center"
          flex="9"
          width="90%"
        >
          <div style={{ position: 'relative' }}>
            <RealCanvas
              mySessionId={mySessionId}
              myUserName={myUserName}
              width="100%"
            />
            {correctRender && (
              <Img
                src={`${process.env.PUBLIC_URL}/resources/images/O.png`}
                alt="character"
                width="60%"
                height="90%"
                style={{
                  position: 'absolute',
                  top: '0%', // Adjust as necessary
                  left: '20%', // Centering the image if it's 80% width
                }}
              />
            )}
            {incorrectRender && (
              <Img
                src={`${process.env.PUBLIC_URL}/resources/images/X.png`}
                alt="character"
                width="70%"
                height="90%"
                style={{
                  position: 'absolute',
                  top: '0%', // Adjust as necessary
                  left: '20%', // Centering the image if it's 80% width
                }}
              />
            )}
          </div>

        </Flex>

        {/* 캔버스 하단 - 버튼 1.5 */}
        <Flex className="ButtonZone" justifyContent="center" flex="2">
          {phase === 'Game1' || phase === 'Game2' ? (
            <>
              <Flex justifyContent="center" gap="2" width="80%">
                {(round === 1 && team === 'red' && iAmSolverRender === true) || (round === 2 && team === 'blue' && iAmSolverRender === true) ?
                  (
                    <>
                      <Input
                        placeholder="정답을 입력하시오"
                        size="lg"
                        value={ans}
                        onChange={(e) => setAns(e.target.value)}
                        _placeholder={{ color: "white" }}
                        color="white"
                        fontSize="30px"
                      />
                      <Button
                        colorScheme="facebook"
                        size="lg"
                        onClick={submitAns}
                        style={{ margin: "auto 1px auto 1px" }}
                        fontSize="30px"
                      >
                        제출
                      </Button>
                    </>
                  ) : null}
                {(round === 1 && team === 'red' && iAmPainter === true) || (round === 2 && team === 'blue' && iAmPainter === true) ?
                  (
                    <Button
                      colorScheme="blue"
                      size="lg"
                      onClick={handlePass}
                      style={{ margin: "auto 1px auto 1px" }}
                      fontSize="30px"
                    >
                      PASS
                    </Button>
                  ) : null}
              </Flex>
            </>
          ) : null}

          {(round === 1 && team === 'blue' && gamers[1].name === myUserName) || (round === 2 && team === 'red' && gamers[0].name === myUserName) ? (
            <>
              {/* JUNHO: 깜박이는 애니메이션 넣기 */}
              <Button colorScheme="green" width="250px" size="lg" fontSize="30px"
                onClick={() => { hacking(); handleButtonClick() }}
              >
                방해하기!
              </Button>
            </>
          ) : null}
        </Flex>
      </Flex>

      {/* 캔버스 이펙트 효과 */}

      {/* JANG: 카운트다운 위치 수정 */}
      {/* <div style={{ position: "absolute", marginBottom: 'auto', color: "gray", fontSize: "24px", zIndex: 100 }}> */}
      <div
        style={{
          position: "fixed",
          top: "45%",
          left: "42%",
          color: "gray",
          fontSize: "24px",
          zIndex: 100,
        }}
      >
        {round1Countdown === true ? (
          <>
            <h1 style={{ fontWeight: "bold" }}>레드팀 준비해주세요~!</h1>
            <Countdown />
          </>
        ) : null}
        {round2Countdown === true ? (
          <>
            <h1 style={{ fontWeight: "bold" }}>블루팀 준비해주세요~!</h1>
            <Countdown />
          </>
        ) : null}
      </div>
    </>
  );
}

export default GameCanvas;
