import React, { useEffect, useState } from "react";
import UserVideoComponent from "../Openvidu/UserVideoComponent";
import useStore from "../store";
import "./BasicUI.css";

import socket from "../Openvidu/socket";

// 게임 컴포넌트
import GameCanvas from "./For_canvas/GameCanvas";
// JANG: 08.06 - 폭죽 애니메이션
import confetti from "canvas-confetti";

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
} from "@chakra-ui/react";

import Navbar from "./For_screen/Navbar";
// JANG: 08.06 - react-bootstrap 추가
import { Form } from "react-bootstrap";


function BasicUI() {
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

    const scoreUpdateHandler = ({redScore, blueScore}) => {
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

  const {
    mode,
    setMode
  } = useStore();
  const cllickCompetitive = () => {
    setMode('competitive');
  }
  const clickSpy = () => {
    setMode('spy');
  }

  // JANG: 08.06 - 모드 선택 애니메이션
  const bounce = keyframes`
  0% { transform: translateY(15px); }
  50% { transform: translateY(-15px);}
  100% { transform: translateY(15px); }
  `;
  const animation = `${bounce} infinite 2s ease`;
  // JANG: 08.06 - ★★★ 아래 요소는 임시로 넣어 둠 (승자/패자에 대한 효과 처리)
  const [status, setStatus] = useState("game"); // game, vote, result

  useState(() => {  
    confetti();
  }, []);


  return (
    <>
      <Flex height="100%" width="100%" flexDirection="column">
        {/********* @ 2. 게임 진행 창 **********/}
        <VStack
          height="100%"
          width="100%"
          justifyContent="center"
          alignItems="center"
          spacing={4}
        >
          <Navbar />

          {/*** @2-0. 게임 시작 전 ***/}
          {mode === undefined ? (
            <>
              {/* 모드 선택하는 창 */}
              <Flex
                h="66%"
                w="100%"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  className="Game_Character"
                  h="100%"
                  w="15%"
                  bg="rgba(255, 255, 255, 0.7)"
                  backdropFilter="auto" // 블러
                  backdropBlur="5px"    // 블러
                  boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px"
                  mr={4}
                  borderRadius="20px" // 모서리 둥글게
                  display="flex"
                  alignItems="center" // 중앙정렬
                  justifyContent="center" // 중앙정렬
                >
                  <Img
                    src={`${process.env.PUBLIC_URL}/resources/images/character.png`}
                    alt="character"
                    width="80%"
                    animation={animation}
                  />
                </Box>
                <Box
                  h="100%"
                  bg="rgba(255, 255, 255, 0.7)"
                  backdropFilter="auto"
                  backdropBlur="5px"
                  boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px"
                  w="50%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  className="Game_Mode"
                  borderRadius="20px" // 모서리 둥글게
                  transition="0.3s ease" // 부드러운 애니메이션
                  _hover={{ // hover시 효과 설정 (그림자, 크기)
                    boxShadow: "15px 15px 50px rgba(0, 0, 0, .2)",
                    transformOrigin: "right top", // 원점 설정
                    transform:
                      "perspective(1000px) rotateX(2deg) rotateY(-2deg) rotateZ(0.1deg)", // 회전
                  }} // Hover시 tilt 효과
                >
                  {/* @2-1. 경쟁/스파이 모드 선택 */}
                  <Flex
                    justifyContent="space-between"
                    alignContent="center"
                    width="80%"
                    gap="30px"
                  >
                    <Button
                      colorScheme="teal"
                      flex={1}
                      size="lg"
                      onClick={cllickCompetitive}
                      className="Button_Mode"
                      _hover={{ transform: "scale(1.1)" }} // hover시 커지게
                    >
                      경쟁 모드
                    </Button>

                    <Button
                      colorScheme="teal"
                      flex={1}
                      size="lg"
                      onClick={clickSpy}
                      className="Button_Mode"
                      _hover={{ transform: "scale(1.1)" }}
                    >
                      스파이 모드
                    </Button>
                  </Flex>
                </Box>
              </Flex>

              {/* 게이머들 나열 */}
              <Flex
                h="33%"
                w="90%"
                justifyContent="space-between"
                marginBottom="20px"
              >
                <Box
                  className="Gamer_Box"
                  w="23%"
                  height="fit-content" // 내용물에 맞게 높이 조절
                  minHeight="150px"
                  bg="rgba(255, 255, 255, 0.7)" // 반투명 하얀 배경색으로 설정
                  backdropFilter="auto" // 블러
                  backdropBlur="5px" // 블러
                  boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px" // 선명한 그림자 추가
                  borderRadius="20px" // 모서리 둥글게
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
                  w="23%"
                  height="fit-content"
                  minHeight="150px"
                  bg="rgba(255, 255, 255, 0.7)"
                  backdropFilter="auto"
                  backdropBlur="5px"
                  boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px"
                  borderRadius="20px"
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
                  w="23%"
                  height="fit-content"
                  minHeight="150px"
                  bg="rgba(255, 255, 255, 0.7)"
                  backdropFilter="auto"
                  backdropBlur="5px"
                  boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px"
                  borderRadius="20px"
                >
                  {gamers[2] && (
                    <UserVideoComponent
                      streamManager={gamers[2].streamManager}
                      my_name={gamers[2].name}
                      key={gamers[2].name}
                    />
                  )}
                </Box>
                <Box
                  className="Gamer_Box"
                  w="23%"
                  height="fit-content"
                  minHeight="150px"
                  bg="rgba(255, 255, 255, 0.7)"
                  backdropFilter="auto"
                  backdropBlur="5px"
                  boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px"
                  borderRadius="20px"
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
              {/*** @2-0. 게임 시작 전 ***/}
            </>
          ) : mode === "competitive" ? (
            <div style={{ height: "100%" }}>
              
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
              <Grid h="10%" w="98%" templateColumns="2fr 5fr 2fr">
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

              <Box h="90%" w="100%" justifyContent="center" marginBottom="20px">
                <Grid h="100%" marginLeft="20px" templateColumns="2fr 5fr 2fr">
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
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "50px",
                    }}
                  >
                    <Box
                      h="80%"
                      bg="teal"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mb="10px"
                    >
                      <GameCanvas />
                    </Box>
                    {/* JANG: 08.06 - ★★★ 입력 창과 제출 버튼, pass 버튼 처리 어떻게? */}
                    {/* <Box
                      bg="transparent"
                      height="50px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap="5px"
                    >
                      <input
                        placeholder="입력하세요"
                        style={{
                          width: "200px",
                          background: "white",
                          padding: "4px",
                          boxShadow: "0px 5px 20px #00000030",
                          borderRadius: "5px",
                        }}
                      />
                      <Button
                        size="sm"
                        background="white"
                        boxShadow="0px 5px 20px #00000030"
                      >
                        제출
                      </Button>
                    </Box> */}
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
              </Box>
              {/*** @2-1. 경쟁 모드 ***/}
            </div>
          ) : (
            <>
              {/*** @2-2. 스파이 모드 ***/}

              {/* JANG: 08.06 - ★★★ 상단 어떻게 처리할 건지..? */}
              <Flex alignItems="center" justifyContent="space-between">
                <Box
                  bg="red.500"
                  width="100px"
                  height="50px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  TIMER
                </Box>
                <Box
                  bg="yellow.500"
                  width="100px"
                  height="50px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  제시어
                </Box>
                <Box
                  bg="blue.500"
                  width="200px"
                  height="50px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap="5px"
                >
                  {/* JANG: 08.06 - ★★★ 입력칸과 제출 버튼 처리 어떻게..? */}
                  {/* <input
                    placeholder="입력하세요"
                    style={{
                      width: "130px",
                      background: "white",
                      padding: "2px",
                      boxShadow: "0px 5px 20px #00000030",
                      borderRadius: "5px",
                    }}
                  />
                  <Button
                    size="sm"
                    background="white"
                    boxShadow="0px 5px 20px #00000030"
                  >
                    제출
                  </Button> */}
                </Box>
              </Flex>
              {/* JANG: 08.06 - ★★★ 상단 어떻게 처리할 건지..? */}

              {/* JANG: 08.06 - 스파이모드 캔버스 영역 */}
              <Flex
                h="66%"
                w="100%"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  h="100%"
                  bg="transparent"
                  w="50%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Flex
                    justifyContent="center"
                    alignContent="center"
                    width="60%"
                  >
                    {/* JANG: 08.06 - 스파이모드 1 : 그냥 캔버스 */}
                    {status === "game" ? (
                      <Box
                        h="80%"
                        bg="teal"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mb="10px"
                      >
                        <GameCanvas />
                      </Box>
                    ) : null}

                    {/* JANG: 08.06 - 스파이모드 2 : 투표 창 */}
                    {status === "vote" ? (
                      <Box
                        width="100%"
                        height="100%"
                        padding="1rem"
                        bg="rgba(255, 255, 255, 0.7)"
                        backdropFilter="auto"
                        backdropBlur="5px"
                        boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px"
                        borderRadius="20px"
                      >
                        <Text fontSize="xl" fontWeight="bold" mb="1rem">
                          마피아를 찾아라!
                        </Text>
                        <Flex flexDirection="column">
                          <Flex alignItems="center" mb="0.5rem">
                            <Text mr="1rem" flex="1">
                              {/* JANG: 유저 이름 */}
                            </Text>
                            <RadioGroup>
                              <Radio size="lg" colorScheme="teal" />
                            </RadioGroup>
                          </Flex>
                          <Flex alignItems="center" mb="0.5rem">
                            <Text mr="1rem" flex="1">
                              {/* JANG: 유저 이름 */}
                            </Text>
                            <RadioGroup>
                              <Radio size="lg" colorScheme="teal" />
                            </RadioGroup>
                          </Flex>
                          <Flex alignItems="center" mb="0.5rem">
                            <Text mr="1rem" flex="1">
                              {/* JANG: 유저 이름 */}
                            </Text>
                            <RadioGroup>
                              <Radio size="lg" colorScheme="teal" />
                            </RadioGroup>
                          </Flex>
                          <Flex alignItems="center" mb="0.5rem">
                            <Text mr="1rem" flex="1">
                              {/* JANG: 유저 이름 */}
                            </Text>
                            <RadioGroup>
                              <Radio size="lg" colorScheme="teal" />
                            </RadioGroup>
                          </Flex>
                        </Flex>
                        {/* <Button colorScheme="blue" onClick={함수}> */}
                        <Button colorScheme="blue" >
                          제출하기
                        </Button>
                      </Box>
                    ) : null}

                    {/* JANG: 08.06 - 스파이모드 3 : 결과 창 */}
                    {status === "result" ? (
                      <Box
                        width="100%"
                        height="100%"
                        minHeight="500px"
                        bg="rgba(255, 255, 255, 0.7)"
                        backdropFilter="auto"
                        backdropBlur="5px"
                        boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px"
                        borderRadius="20px"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {/* <img src={mafia} alt=""></img> */}
                        스파이는..!
                      </Box>
                    ) : null}
                  </Flex>
                </Box>
              </Flex>

              {/* JANG: 08.06 - 게이머들 */}
              <Flex
                h="33%"
                w="90%"
                justifyContent="space-between"
                margin="10px"
              >
                <Box
                  w="23%"
                  height="fit-content"
                  minHeight="150px"
                  bg="rgba(255, 255, 255, 0.7)"
                  backdropFilter="auto" // 블러
                  backdropBlur="5px"    // 블러
                  boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px"
                  borderRadius="20px"
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
                  w="23%"
                  height="fit-content"
                  minHeight="150px"
                  bg="rgba(255, 255, 255, 0.7)"
                  backdropFilter="auto"
                  backdropBlur="5px"
                  boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px"
                  borderRadius="20px"
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
                  w="23%"
                  height="fit-content"
                  minHeight="150px"
                  bg="rgba(255, 255, 255, 0.7)"
                  backdropFilter="auto"
                  backdropBlur="5px"
                  boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px"
                  borderRadius="20px"
                >
                  {gamers[2] && (
                    <UserVideoComponent
                      streamManager={gamers[2].streamManager}
                      my_name={gamers[2].name}
                      key={gamers[2].name}
                    />
                  )}
                </Box>
                <Box
                  w="23%"
                  height="fit-content"
                  minHeight="150px"
                  bg="rgba(255, 255, 255, 0.7)"
                  backdropFilter="auto"
                  backdropBlur="5px"
                  boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px"
                  borderRadius="20px"
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
              {/*** @2-2. 스파이 모드 ***/}
            </>
          )}
        </VStack>
        {/********* @ 2. 게임 진행 창 **********/}

        {/* (추가) ※ 하단 우측에 아바타 버튼을 만들어서, 각각 게임에 대한 설명이 나타날 수 있도록! */}
      </Flex>
    </>
  );
}
export default BasicUI;