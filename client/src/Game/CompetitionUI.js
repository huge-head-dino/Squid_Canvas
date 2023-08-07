import React, { useEffect, useState } from "react";
import UserVideoComponent from "../Openvidu/UserVideoComponent";
import useStore from "../store";
import "./BasicUI.css";

import socket from "../Openvidu/socket";

// 게임 컴포넌트
import GameCanvas from "./For_canvas/GameCanvas";
// JANG: 08.06 - 폭죽 애니메이션
import confetti from "canvas-confetti";
import Countdown from "./Countdown";

// JANG: Chakra UI 추가
import {
  Button,
  Box,
  Center,
  Flex,
  GridItem,
  Spacer,
  VStack,
  Grid,
  Input,
  Radio,
  RadioGroup,
  Text,
  keyframes,
  Img,
  FormControl,
  FormLabel,
  
} from "@chakra-ui/react";

import Navbar from "./For_screen/Navbar";


const CompetitionUI = () => {

    // MRSEO: 타이머 값 상태
  const [timerValue, setTimerValue] = useState(0);

  const {
    gamers,
    playerCount,
    setPlayerCount,
    myUserID,
    setMyIndex,
    curSession,
    redScoreCnt,
    blueScoreCnt,
    setRedScoreCnt,
    setBlueScoreCnt,
    round,
    setRound,
    sortGamer,
    setCanSeeAns,
    setDrawable,
    setIAmPainter,
    phase,
    setPhase,
    myUserId,
    iAmSpy,
    setIAmSpy,
    setSpyPainter,
    host,
  } = useStore(
    state => ({
      gamers: state.gamers,
      playerCount: state.playerCount,
      setPlayerCount: state.setPlayerCount,
      myUserID: state.myUserID,
      setMyIndex: state.setMyIndex,
      curSession: state.curSession,
      setRedScoreCnt: state.setRedScoreCnt,
      setBlueScoreCnt: state.setBlueScoreCnt,
      round: state.round,
      setRound: state.setRound,
      sortGamer: state.sortGamer,
      setCanSeeAns: state.setCanSeeAns,
      setDrawable: state.setDrawable,
      setIAmPainter: state.setIAmPainter,
      phase: state.phase,
      setPhase: state.setPhase,
      myUserId: state.myUserId,
      iAmSpy: state.iAmSpy,
      myUserId: state.myUserId,
      setIAmSpy: state.setIAmSpy,
      setSpyPainter: state.setSpyPainter,
      host: state.host,
    })
  );

  useEffect(() => {
    if (curSession !== undefined) {
      setPlayerCount(gamers.length);
    }
    // 재 렌더링 되는 건 맞지만, 자식 요소가 재 렌더링 되지는 않음
    sortGamer();

  }, [gamers]);

  // MRSEO: 
  useEffect(() => {

    // MRSEO: 소켓 관리를 위한 함수 추가와 클린업 함수 추가
    const timerUpdateHandler = (value) => {
      console.log('timerUpdate_client@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      setTimerValue(value);
    };

    const scoreUpdateHandler = ({ redScore, blueScore }) => {
      setRedScoreCnt(redScore);
      setBlueScoreCnt(blueScore);
    };

    const round2CountdownHandler = () => {
      setRound(2);
      setPhase('Game2');
      // MRSEO: 게임 초기화
    }
    // 서버로부터 타이머 값을 수신하는 이벤트 리스너
    socket.on('timerUpdate', timerUpdateHandler);
    socket.on('scoreUpdate', scoreUpdateHandler);

    // MRSEO: 라운드를 2로 업데이트
    socket.on('round2Countdown', round2CountdownHandler);

    return () => {
      socket.off('timerUpdate', timerUpdateHandler);
      socket.off('scoreUpdate', scoreUpdateHandler);
      socket.off('round2Countdown', round2CountdownHandler);
    }

  }, [socket]);


  // JANG: 08.06 - 모드 선택 애니메이션
  const bounce = keyframes`
  0% { transform: translateY(15px); }
  50% { transform: translateY(-15px);}
  100% { transform: translateY(15px); }
  `;
  const animation = `${bounce} infinite 2s ease`;

  //MRSEO: 08.06 useState를 useEffect로 바꿈.
  useEffect(() => {
    confetti();
  }, []);

    return(
        <>
            <div style={{ height: "100%", width:"100%"}}>

                {/* ** 패배 시 뜨는 창 **
                <div
                style={{
                    background: "#000000a0",
                    width: "100vw",
                    height: "100vh",
                    position: "absolute",
                    zIndex: "10000",
                    left: "0",
                    top: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "700",
                    fontSize: "60px",
                }}
                >
                패배
                </div> */}
                {/* ** 승리 시 confetti(); 실행하면 폭죽효과 생김 ** */}

                {/*** @2-1. 경쟁 모드 ***/}
                <Grid h="10%" w="100%" templateColumns="2fr 5fr 2fr">
                <Flex alignItems="center" justifyContent="center">
                    <Box
                    className="Red_Score"
                    bg="red.500"
                    p="10px"
                    borderRadius="5px"
                    fontSize="x-large" // 글자 크기를 x-large로 설정
                    fontWeight="bold" // 글자를 두껍게 설정
                    _hover={{
                        boxShadow: "0 0 20px rgba(255, 0, 0, 0.8)", // 네온 샤인처럼 빛이 나는 hover 효과 (빨간색)
                    }}
                    transition="box-shadow 0.3s ease-in-out" // 부드러운 애니메이션 효과
                    >
                    RED SCORE : {useStore.getState().redScoreCnt}
                    </Box>
                </Flex>
                <Flex alignItems="center" justifyContent="center">
                    <Box
                    className="Round_Timer"
                    bg="yellow.500"
                    p="10px"
                    borderRadius="5px"
                    fontSize="x-large" // 글자 크기를 x-large로 설정
                    fontWeight="bold" // 글자를 두껍게 설정
                    _hover={{
                        boxShadow: "0 0 20px rgba(255, 255, 0, 0.8)", // 네온 샤인처럼 빛이 나는 hover 효과 (노란색)
                    }}
                    transition="box-shadow 0.3s ease-in-out" // 부드러운 애니메이션 효과
                    >
                    ROUND : {round} / TIMER : {timerValue}
                    </Box>
                </Flex>
                <Flex alignItems="center" justifyContent="center">
                    <Box
                    className="Blue_Score"
                    bg="blue.500"
                    p="10px"
                    borderRadius="5px"
                    fontSize="x-large" // 글자 크기를 x-large로 설정
                    fontWeight="bold" // 글자를 두껍게 설정
                    _hover={{
                        boxShadow: "0 0 20px rgba(0, 0, 255, 0.8)", // 네온 샤인처럼 빛이 나는 hover 효과 (파란색)
                    }}
                    transition="box-shadow 0.3s ease-in-out" // 부드러운 애니메이션 효과
                    >
                    BLUE SCORE : {useStore.getState().blueScoreCnt}
                    </Box>
                </Flex>
                </Grid>

                <Grid h="90%" w="100%" marginLeft="20px" templateColumns="2fr 5fr 2fr" marginTop="10px">
                {/* 왼쪽 박스 1과 2 */}
                <Flex
                    flexDirection="column"
                    justifyContent="space-between"
                    h="80%"
                    w="90%"
                >
                    <Box
                    className="Gamer_Box"
                    w="100%"
                    minHeight="20px"
                    bg="transparent" // 투명한 배경색으로 설정
                    boxShadow="rgba(0, 0, 0, 0.1) 0px 1px 8px" // 선명한 그림자 추가
                    border="4px dashed red" // 1px 굵기의 빨간 색 테두리 점선 추가
                    borderRadius="5px" // 5px의 둥근 모서리 추가
                    _hover={{
                        boxShadow: "0 0 20px rgba(255, 0, 0, 0.8)", // 네온 샤인처럼 빛이 나는 hover 효과
                        // shouldApplyHoverEffect
                        //   ? {
                        //       boxShadow: "0 0 20px rgba(0, 0, 255, 0.8)", // 네온 샤인처럼 빛이 나는 hover 효과 (파란색)
                        //     }
                        //   : {} // 특정 조건이 아닐 때는 빈 객체를 전달하여 hover 효과를 적용하지 않음
                    }}
                    >
                    {gamers[0] && (
                        <UserVideoComponent
                        streamManager={gamers[0].streamManager}
                        my_name={gamers[0].name}
                        key={gamers[0].name}
                        />
                    )}
                    </Box>
                    <Box
                    className="Gamer_Box"
                    w="100%"
                    minHeight="20px"
                    bg="transparent" // 투명한 배경색으로 설정
                    boxShadow="rgba(0, 0, 0, 0.1) 0px 1px 8px" // 선명한 그림자 추가
                    border="4px dashed red" // 1px 굵기의 빨간 색 테두리 점선 추가
                    borderRadius="5px" // 5px의 둥근 모서리 추가
                    _hover={{
                        boxShadow: "0 0 20px rgba(255, 0, 0, 0.8)", // 네온 샤인처럼 빛이 나는 hover 효과
                    }}
                    >
                    {gamers[2] && (
                        <UserVideoComponent
                        streamManager={gamers[2].streamManager}
                        my_name={gamers[2].name}
                        key={gamers[2].name}
                        />
                    )}
                    </Box>
                </Flex>

                {/* 가운데 Canvas */}
                <div
                    style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    }}
                    className="GameCanvas 들어갈 영역 1"
                >
                    <Box
                    h="85%"
                    w="90%"
                    bg="teal"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    className="GameCanvas 감싸는 거 1"
                    position="absolute"
                    top="50%" // 부모 요소의 정중앙으로 위치하기 위해 50% 설정
                    left="50%" // 부모 요소의 정중앙으로 위치하기 위해 50% 설정
                    transform="translate(-50%, -50%)" // 자기 자신의 크기만큼 왼쪽과 위로 이동하여 정중앙 정렬                    
                    >
                    <GameCanvas />
                    </Box>
                </div>

                {/* 오른쪽 박스 3과 4 */}
                <Flex
                    flexDirection="column"
                    justifyContent="space-between"
                    h="80%"
                    w="90%"
                >
                    <Box
                    className="Gamer_Box"
                    w="100%"
                    minHeight="20px"
                    bg="transparent" // 투명한 배경색으로 설정
                    boxShadow="rgba(0, 0, 0, 0.1) 0px 1px 8px" // 선명한 그림자 추가
                    border="4px dashed blue" // 1px 굵기의 파란색 테두리 점선 추가
                    borderRadius="5px" // 5px의 둥근 모서리 추가
                    _hover={{
                        boxShadow: "0 0 20px rgba(0, 0, 255, 0.8)", // 네온 샤인처럼 빛이 나는 hover 효과 (파란색)
                    }}
                    >
                    {gamers[1] && (
                        <UserVideoComponent
                        streamManager={gamers[1].streamManager}
                        my_name={gamers[1].name}
                        key={gamers[1].name}
                        />
                    )}
                    </Box>
                    <Box
                    className="Gamer_Box"
                    w="100%"
                    minHeight="20px"
                    bg="transparent" // 투명한 배경색으로 설정
                    boxShadow="rgba(0, 0, 0, 0.1) 0px 1px 8px" // 선명한 그림자 추가
                    border="4px dashed blue" // 1px 굵기의 파란색 테두리 점선 추가
                    borderRadius="5px" // 5px의 둥근 모서리 추가
                    _hover={{
                        boxShadow: "0 0 20px rgba(0, 0, 255, 0.8)", // 네온 샤인처럼 빛이 나는 hover 효과 (파란색)
                    }}
                    >
                    {gamers[3] && (
                        <UserVideoComponent
                        streamManager={gamers[3].streamManager}
                        my_name={gamers[3].name}
                        key={gamers[3].name}
                        />
                    )}
                    </Box>
                </Flex>
                </Grid>
                {/*** @2-1. 경쟁 모드 ***/}
                </div>
        </>
    )
}

export default CompetitionUI;