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
  Grid, GridItem,
  Spacer,
} from "@chakra-ui/react";


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
    round,
    setRound,
    sortGamer,
    setCanSeeAns,
    setDrawable,
  } = useStore(
    state => ({
      gamers: state.gamers,
      playerCount: state.playerCount,
      setPlayerCount: state.setPlayerCount,
      myUserID: state.myUserID,
      setMyIndex: state.setMyIndex,
      curSession: state.curSession,
      redScoreCnt: state.redScoreCnt,
      blueScoreCnt: state.blueScoreCnt,
      round: state.round,
      setRound: state.setRound,
      sortGamer: state.sortGamer,
      setCanSeeAns: state.setCanSeeAns,
      setDrawable: state.setDrawable,
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

      const round2CountdownHandler = () => {
        setRound(2);
        // MRSEO: 게임 초기화
        GameInitializer();
      }
      // 서버로부터 타이머 값을 수신하는 이벤트 리스너
      socket.on('timerUpdate', timerUpdateHandler);

      // MRSEO: 라운드를 2로 업데이트
      socket.on('round2Countdown', round2CountdownHandler);

      return () => {
        socket.off('timerUpdate', timerUpdateHandler);
        socket.off('round2Countdown', round2CountdownHandler);
      }

     }, [socket]);

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
      <Box height="100%">
      {/* 게임 진행 방 - 1) 헤더 부분 */}
        <Flex justifyContent="space-between" m="10px auto" p="2">
          <Button colorScheme="red" flex="1" color="white" size="lg" m='10px'>
            <h1 style={{ fontWeight: "bold" }}>RED SCORE : {redScoreCnt}</h1>
          </Button>
          <Spacer/>
          <Flex flex="2" gap="4">
            <Button colorScheme="yellow" flex="1" color="white" size="lg">
              <h1 style={{ fontWeight: "bold" }}>라운드 : {round}</h1>
            </Button>
            <Button colorScheme="yellow" flex="1" color="white" size="lg">
              <h1 style={{ fontWeight: "bold" }}>타이머 : {timerValue}</h1>
            </Button>
          </Flex>
          <Spacer/>
          <Button colorScheme="blue" flex="1" color="white" size="lg" m='10px'>
            <h1 style={{ fontWeight: "bold" }}>BLUE SCORE : {blueScoreCnt}</h1>
          </Button>
        </Flex>


      {/* 게임 진행 방 - 2) 유저 비디오 왼쪽 */}
      {/* JANG: UserVideoComponent가 적절하게 렌더링 되는 시점 */}
      {/* 1) gamers 배열에 변화가 생겼을 때 (sortGamer) */}
      {/* 2) streamManager가 변경될 때 (사용자가 새로 입장하거나 나가면 streamManager 변경되므로 UserVideoComponenet도 재렌더링) */}

      <Box p="2" height="100%">
        <Grid templateColumns="2fr 5fr 2fr" gap={4} height="100%">
          <GridItem>
            <Box boxShadow="md" bg="transparent" p={4} borderRadius="md" height="40%">
              {gamers[0] && (
                <UserVideoComponent 
                  streamManager={gamers[0].streamManager}
                  my_name={gamers[0].name}
                  key={gamers[0].name}
                />
              )}
            </Box>
            <Box boxShadow="md" bg="transparent" p={4} borderRadius="md" mt={4} height="40%">
              {gamers[2] && (
                <UserVideoComponent
                  streamManager={gamers[2].streamManager}
                  my_name={gamers[2].name}
                  key={gamers[2].name}
                />
              )}
            </Box>
          </GridItem>
      
          <GridItem>
            <div className="GameCanvas_Right">
              {/* JANG: 경쟁 / 스파이 모드 추가 */}
              {mode === undefined ? (
                <>
                  {/* 모드 선택하는 창 */}
                    <Center w="100%" h="100%" justifyContent="center" bg="darkgray">
                      <Button size='lg' width='150px'
                              colorScheme="green"
                              border='2px' borderColor='green' borderRadius='lg'
                              m={2}
                              onClick={cllickCompetitive}>
                        경쟁 모드
                      </Button>
                      <Button size='lg' width='150px'
                              colorScheme="green"
                              border='2px' borderColor='green' borderRadius='lg' 
                              onClick={clickSpy}>
                        스파이 모드
                      </Button>
                    </Center>
                </>
              ): (
                mode === 'competitive' ? ( 
                // 경쟁 모드
                  <GameCanvas />
                ) : (
                  // 스파이 모드
                  <GameCanvas />
                )
              )}
              {/* JANG: 경쟁/스파이 모드 */}

            </div>
          </GridItem>
      
          <GridItem>
            <Box boxShadow="md" bg="transparent" p={4} borderRadius="md" height="40%">
              {gamers[1] && (
                <UserVideoComponent
                  streamManager={gamers[1].streamManager}
                  my_name={gamers[1].name}
                  key={gamers[1].name}
                />
              )}
            </Box>
            <Box boxShadow="md" bg="transparent" p={4} borderRadius="md" mt={4} height="40%">
              {gamers[3] && (
                <UserVideoComponent
                  streamManager={gamers[3].streamManager}
                  my_name={gamers[3].name}
                  key={gamers[3].name}
                />
              )}
            </Box>
          </GridItem>
        </Grid>
      </Box>

    </Box>
    </>
    );  
  }
  export default BasicUI;