import React, { useEffect, useState } from "react";
import UserVideoComponent from "../Openvidu/UserVideoComponent";
import useStore from "../store";
import "./BasicUI.css";

import socket from "../Openvidu/socket";

// 게임 컴포넌트
import GameCanvas from "./For_canvas/GameCanvas";

// Chakra UI
import { 
  Button, Box,
  Center,
  Flex, 
  GridItem,
  Spacer,
  VStack,
  Grid,
  Input,

} from "@chakra-ui/react";

//JANG: (08.05) - Navbar 컴포넌트 추가
import Navbar from "./For_screen/Navbar";

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
    setIAmSolver,
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
      setIAmSolver: state.setIAmSolver,
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



    // JANG: 경쟁, 스파이 모드 추가 (임시)
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

    return (

      <>
        <Box textAlign="center" className="1_Box">


          {/********* @ 2. 게임 진행 창 **********/}
          <VStack height="80vh" justifyContent="center" alignItems="center" spacing={4}>
            <Navbar/>


              {/*** @2-0. 게임 시작 전 ***/}
              {mode === undefined ? (
                  <>
                    {/* 모드 선택하는 창 */}
                      <Flex h="66%" w="100%" alignItems="center" justifyContent="center">
                          <Box h="100%" w="15%" bg="blue.500" mr={4} > 캐릭터 둥둥 </Box>
                          <Box h="100%" bg="blue.200" w="50%" display="flex" alignItems="center" justifyContent="center">
                              {/* @2-1. 경쟁/스파이 모드 선택 */}
                              <Flex justifyContent="space-between" alignContent="center" width="60%" >
                                <Button colorScheme="red" size="lg"
                                        onClick={cllickCompetitive}>
                                  경쟁 모드
                                </Button>
                                <Button colorScheme="red" size="lg" 
                                        onClick={clickSpy}>
                                  스파이 모드
                                </Button>
                              </Flex>
                          </Box>
                      </Flex>
                      
                      {/* 게이머들 나열 */}
                      <Flex h="33%" w="90%" justifyContent="space-between" marginBottom="20px">
                        <Box w="23%" bg="green.200">
                            {gamers[0] && (
                            <UserVideoComponent 
                              streamManager={gamers[0].streamManager}
                              my_name={gamers[0].name}
                              key={gamers[0].name}
                            />
                          )}
                        </Box>
                        <Box w="23%" bg="purple.200">
                            {gamers[1] && (
                            <UserVideoComponent
                              streamManager={gamers[1].streamManager}
                              my_name={gamers[1].name}
                              key={gamers[1].name}
                            />
                          )}
                        </Box>
                        <Box w="23%" bg="yellow.200">
                            {gamers[2] && (
                            <UserVideoComponent
                              streamManager={gamers[2].streamManager}
                              my_name={gamers[2].name}
                              key={gamers[2].name}
                            />
                          )}
                        </Box>
                        <Box w="23%" bg="pink.200">
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
                ): (
                  mode === 'competitive' ? ( 
                  <>
                    {/*** @2-1. 경쟁 모드 ***/}
                    <Grid h="10%" w="90%" templateColumns="2fr 5fr 2fr">
                    <Flex alignItems="center" justifyContent="center">
                        <Box bg="red.500">RED SCORE : {useStore.getState().redScoreCnt}</Box>
                    </Flex>
                    <Flex alignItems="center" justifyContent="center">
                        <Box bg="yellow.500">ROUND : {round} / TIMER : {timerValue}</Box>
                    </Flex>
                    <Flex alignItems="center" justifyContent="center">
                        <Box bg="blue.500">BLUE SCORE : {useStore.getState().blueScoreCnt}</Box>
                    </Flex>
                </Grid>

                <Box h="100%" w="90%" justifyContent="center" marginBottom="20px">
                
                  <Grid h="100%" templateColumns="2fr 5fr 2fr">
                    {/* 왼쪽 박스 1과 2 */}
                    <Flex flexDirection="column" justifyContent="space-between" h="80%" w="90%" >
                      <Box bg="green.200" h="40%" mb={1} mt={10}>
                        {gamers[0] && (
                            <UserVideoComponent 
                              streamManager={gamers[0].streamManager}
                              my_name={gamers[0].name}
                              key={gamers[0].name}
                            />
                          )}
                      </Box>
                      <Box bg="purple.200" h="40%" mb={5} mt={1}>
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
                    <div>
                    <Box h="80%" bg="blue.200" display="flex" alignItems="center" justifyContent="center" mb="10px">
                      <GameCanvas/>
                    </Box>
                    </div>

                    {/* 오른쪽 박스 3과 4 */}
                    <Flex flexDirection="column" justifyContent="space-between" h="80%" w="90%" ml="auto" >
                      <Box bg="green.200" h="40%" mb={1} mt={10}>
                        {gamers[1] && (
                            <UserVideoComponent 
                              streamManager={gamers[1].streamManager}
                              my_name={gamers[1].name}
                              key={gamers[1].name}
                            />
                          )}
                      </Box>
                      <Box bg="purple.200" h="40%" mb={5} mt={1}>
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
                </>
                  ) : (
                  <>
                    {/*** @2-2. 스파이 모드 ***/}
                    <Flex alignItems="center" justifyContent="space-between">
                      <Box bg="red.500">TIMER</Box>
                      <Box bg="yellow.500">제시어</Box>
                      <Box bg="blue.500">입력칸과 제출버튼</Box>
                    </Flex>

                    <Flex h="66%" w="100%" alignItems="center" justifyContent="center">
                        <Box h="100%" bg="blue.200" w="50%" display="flex" alignItems="center" justifyContent="center">
                            {/* @2-1. 경쟁/스파이 모드 선택 */}
                            <Flex justifyContent="center" alignContent="center" width="60%" >
                              <GameCanvas /> 
                            </Flex>
                        </Box>
                    </Flex>
                    <Flex h="33%" w="90%" justifyContent="space-between" margin="10px">
                        <Box w="23%" h="85%" bg="green.200">
                          {gamers[0] && (
                            <UserVideoComponent 
                              streamManager={gamers[0].streamManager}
                              my_name={gamers[0].name}
                              key={gamers[0].name}
                            />
                          )}
                        </Box>
                        <Box w="23%" h="85%" bg="purple.200">
                          {gamers[1] && (
                            <UserVideoComponent 
                              streamManager={gamers[1].streamManager}
                              my_name={gamers[1].name}
                              key={gamers[1].name}
                            />
                          )}
                        </Box>
                        <Box w="23%" h="85%" bg="yellow.200">
                          {gamers[2] && (
                            <UserVideoComponent 
                              streamManager={gamers[2].streamManager}
                              my_name={gamers[2].name}
                              key={gamers[2].name}
                            />
                          )}
                        </Box>
                        <Box w="23%" h="85%" bg="pink.200">
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
                  )
                )}

          </VStack>
          {/********* @ 2. 게임 진행 창 **********/}

          {/* (추가) ※ 하단 우측에 아바타 버튼을 만들어서, 각각 게임에 대한 설명이 나타날 수 있도록! */}


      </Box>
    </>
    );  
  }
  export default BasicUI;