import React, { useEffect, useState } from "react";
import UserVideoComponent from "../Openvidu/UserVideoComponent";
import useStore from "../store";
import "./BasicUI.css";

import RealCanvas from "./For_canvas/RealCanvas";

import socket from "../Openvidu/socket";

// 게임 컴포넌트
import GameCanvas from "./For_canvas/GameCanvas";
// JANG: 08.06 - 폭죽 애니메이션
import confetti from "canvas-confetti";
import Countdown from "./Countdown";

import Navbar from "./For_screen/Navbar";

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



const SpyUI = () => {

    // MRSEO: 타이머 값 상태
  const [suggestWord, setSuggestWord] = useState('');
  const [ans, setAns] = useState('');

  const {
    gamers,
    setPlayerCount,
    curSession,
    sortGamer,
    myUserId,
    iAmSpy,
    setIAmSpy,
    setSpyPainter,
    setMode,
  } = useStore(
    state => ({
      gamers: state.gamers,
      setPlayerCount: state.setPlayerCount,
      curSession: state.curSession,
      sortGamer: state.sortGamer,
      myUserId: state.myUserId,
      iAmSpy: state.iAmSpy,
      setIAmSpy: state.setIAmSpy,
      setSpyPainter: state.setSpyPainter,
      setMode: state.setMode,
    })
  );

  useEffect(() => {
    if (curSession !== undefined) {
      setPlayerCount(gamers.length);
    }
    // 재 렌더링 되는 건 맞지만, 자식 요소가 재 렌더링 되지는 않음
    sortGamer();

  }, [gamers]);


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

  // JUNHO: 스파이모드 시작
  const [spyTimerValue, setSpyTimerValue] = useState(0);
  //JUNHO: (1)
  const [spyCountdown, setSpyCountdown] = useState(false);
  const [spyPlayers, setSpyPlayers] = useState([0, 1, 2, 3]);
  const [playerTurn, setPlayerTrun] = useState(0);
  //JANG: 스파이 모드 결과창을 위해 상태 추가
  const [showSpy, setShowSpy] = useState('');
  //YEONGWOO: 스파이 모드 에서 누가 그리고 있는지 알려주는 상태
  const [currentPainterId, setCurrentPainterId] = useState(null);

  useEffect(() => {
    if (gamers.length === 4) {
      for (let i = 0; i < 4; i++) {
        if (gamers[spyPlayers[i]].name === myUserId) {
          setPlayerTrun(i + 1);
        }
      }
    }
  }, [spyPlayers]);


  useEffect(() => {
    // 보이는 타이머 업데이트
    const spyTimerUpdateHandler = (value) => {
      console.log('timerUpdate_client@@@@@@@@@@@@@@@@');
      setSpyTimerValue(value);
    };

    socket.on('spy1GO', (spyPlayer1, spy, spyPlayers) => {
      console.log('spy1GO');
      console.log(spy)
      setSpyPlayers(spyPlayers); // spyPlayers 순서 배정을 위해저장.

      if (gamers[spy].name === myUserId) {
        setIAmSpy(true)
      }

      setSpyCountdown(true);
      setCurrentPainterId(gamers[spyPlayer1].name);

      setTimeout(() => {
        setSpyCountdown(false);
        if (gamers[spyPlayer1].name === myUserId) {
          setSpyPainter(true);
        }
        if (gamers[0].name === myUserId) {
          socket.emit('startSpyTimer1', spyPlayer1);
        }
      }, 5000);
    });

    socket.on('spyTimer1End', (spyPlayer1) => {
      console.log('spyTimer1End');
      if (gamers[spyPlayer1].name === myUserId) {
        setSpyPainter(false);
      }
      if (gamers[0].name === myUserId) {
        socket.emit('spy2Ready');
      }
    });

    socket.on('spy2GO', (spyPlayer2) => {
      console.log('spy2GO');

      setSpyCountdown(true);
      setCurrentPainterId(gamers[spyPlayer2].name);

      setTimeout(() => {
        setSpyCountdown(false);
        console.log("spyPlayer2 : " + spyPlayer2);
        if (gamers[spyPlayer2].name === myUserId) {
          setSpyPainter(true);
        }
        if (gamers[0].name === myUserId) {
          socket.emit('startSpyTimer2', spyPlayer2);
        }
      }, 5000);
    });

    socket.on('spyTimer2End', (spyPlayer2) => {
      console.log('spyTimer2End');
      if (gamers[spyPlayer2].name === myUserId) {
        setSpyPainter(false);
      }
      if (gamers[0].name === myUserId) {
        socket.emit('spy3Ready');
      }
    });

    socket.on('spy3GO', (spyPlayer3) => {
      console.log('spy3GO');

      setSpyCountdown(true);
      setCurrentPainterId(gamers[spyPlayer3].name);

      setTimeout(() => {
        setSpyCountdown(false);
        if (gamers[spyPlayer3].name === myUserId) {
          setSpyPainter(true);
        }
        if (gamers[0].name === myUserId) {
          socket.emit('startSpyTimer3', spyPlayer3);
        }
      }, 5000);
    });

    socket.on('spyTimer3End', (spyPlayer3) => {
      console.log('spyTimer3End');
      if (gamers[spyPlayer3].name === myUserId) {
        setSpyPainter(false);
      }
      if (gamers[0].name === myUserId) {
        socket.emit('spy4Ready');
      }
    });

    socket.on('spy4GO', (spyPlayer4) => {
      console.log('spy4GO');

      setSpyCountdown(true);
      setCurrentPainterId(gamers[spyPlayer4].name);

      setTimeout(() => {
        if (gamers[spyPlayer4].name === myUserId) {
          setSpyPainter(true);
        }
        setSpyCountdown(false);
        if (gamers[0].name === myUserId) {
          socket.emit('startSpyTimer4', spyPlayer4);
        }
      }, 5000);
    });

    socket.on('spyTimer4End', (spyPlayer4) => {
      if (gamers[spyPlayer4].name === myUserId) {
        setSpyPainter(false);
      }
      setIAmSpy(false);
      console.log('모든 과정이 종료되었습니다.');
      setSpyPhase('Vote'); // JUNHO: 여기서 Vote로 바꿔줌
      setTimeout(() => {
        setSpyPhase('Result');
        socket.emit('submitVotedSpy', votedSpy);
      }, [200000000000000000]);
    });

    socket.on('spyVoteResult', (votedSpy, result) => {
      console.log('spyVoteResult');
      if ( result === 'spyWin' ) {
        alert('스파이가 승리했습니다.');
      } else if ( result === 'spyLose' ){
        alert('스파이가 패배했습니다.');
      } else {
        alert('error');
      }
      setShowSpy(gamers[votedSpy].name);
      alert('스파이는 ' + gamers[votedSpy].name + '입니다.')
    });

    //YEONGWOO: 현재 그리는 사람의 id 전달
    socket.on('updateCurrentPainterId', (currentPainterId) => {
      console.log('updateCurrentPainterId_client: ', currentPainterId);
      setCurrentPainterId(currentPainterId);
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
      socket.off('spyVoteResult');
      socket.off('updateCurrentPainterId');
    }

  }, [socket, myUserId, gamers]);


  // JANG: 08.06 - 스파이 투표 상태 -> "유저1" 변경!!!
  const [votedSpy, setVotedSpy] = React.useState('유저1');
  const [spyPhase, setSpyPhase] = React.useState('Game');

  // JUNHO: 스파이 모드 시작 버튼 핸들러// 루프 시작하는 버튼
  const spyButtonHandler = () => {
    socket.emit('spy1Ready');
    socket.emit('updateQuestWords');
    // gamers[0].name === myUserName ? setIAmPainter(false) : setIAmPainter(true);
  };

  //YEONGWOO: 스파이 모드에서 그리는 사람이 누구인지 알려주는 상태
  useEffect(() => {
    if(currentPainterId) {
      socket.emit('updateCurrentPainterId', currentPainterId);
    }
  }, [currentPainterId]);

  useEffect(() => {
    const suggestWords = (names) => {
      const word = names;
      setSuggestWord(word);
    };
    socket.on('suggestWord', suggestWords);

    return () => {
      socket.off('suggestWord', suggestWords);
    };
  }, [socket]);
  
  // MRSEO: 대기실 버튼으로 대기실로 돌아가는 이벤트 핸들러
  useEffect(() => {
    socket.on('gameEnd', () => {
      alert('게임이 종료되었습니다.');
      setMode('waitingRoom');
    })

    return () => {
      socket.off('gameEnd');
    }
  },[socket]);

  const spySubmitHandler = () => {
    if (suggestWord === ans) {
      alert('정답입니다.');
    }
  };

  const votedSpyHandler = () => {

  };
 
  // MRSEO: 대기실 버튼으로 대기실로 돌아가는 함수
  const goToWaitingRoom = () => {
    setIAmSpy(false);
    setSpyPainter(false);
    socket.emit('goToWaitingRoom')
  };

  // JUNHO: 스파이모드 끝

    return(
        <>
            {/* JANG: 08.06 - ★★★ 상단 어떻게 처리할 건지..? */}
             {/* JUNHO: 빨간색, 노란색, 파란색 상단 네모 3개 시작*/}
             <Navbar />

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

                {!iAmSpy ? (
                  <Box
                    bg="yellow.500"
                    width="100px"
                    height="50px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {suggestWord}
                  </Box>
                ) : null}

                <Box
                  bg="blue.500"
                  width="200px"
                  height="50px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap="5px"
                >
                  당신은 {playerTurn}번째 차례입니다.
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
                {/* YEONGWOO: 현재 누가 그리고 있는지 확인 */}
                <Box
                  bg="blue.500"
                  width="200px"
                  height="50px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap="5px"
                >
                  현재 {currentDrawerId}님이 그리고 있습니다.
                </Box>
              </Flex>

                  {/* JUNHO: 빨간색, 노란색, 파란색 상단 네모 3개 끝 */}






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
                    {/* JANG: 스파이모드 1 : 그냥 캔버스 */}
                    {spyPhase === "Game" ? (
                      <>
                      <Grid>
                      {/* //JUNHO: 시작버튼과 타이머영역 */}
                        <div Name="junhozone">
                        <Flex>
                          <Button colorScheme="red" flex="1" color="white" size="lg"
                            m='10px' className="junhobtn" onClick={spyButtonHandler}>스파이모드 시작</Button>

                          <h2></h2>

                          <Button colorScheme="yellow" flex="1" color="white" size="lg">
                            <h1 style={{ fontWeight: "bold" }}>타이머 : {spyTimerValue}</h1>
                          </Button>

                          {spyCountdown && <Countdown />}
                        </Flex>
                        </div>

                        {/* //JUNHO: 초록색 영역 */}
                        <Box
                        name= "초록색영역" 
                        // JANG: 캔버스 크기 임시 조정
                          h="500px"
                          w="800px"
                          bg="teal"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          mb="10px"
                        >
                          <RealCanvas />
                        </Box>
                        </Grid>
                      </>
                      ):null}
                    






                    {/* JUNHO: 스파이모드 투표하는 창 */}
                    {/* JANG: 스파이모드 2 : 투표 창 */}
                    {spyPhase === "Vote" ? (
                      <>
                      <Box
                        width="100%"
                        height="100%"
                        bg="rgba(255, 255, 255, 0.7)"
                        backdropFilter="auto" // 블러
                        backdropBlur="5px"    // 블러
                        boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px"
                        mr={4}
                        borderRadius="20px" // 모서리 둥글게
                        display="flex"
                        alignItems="center" // 중앙정렬
                        justifyContent="center" // 중앙정렬
                        fontStyle={{ fontWeight: "bold", fontSize: "1.5rem" }}
                      >




                        <Grid
                          bg="rgba(255, 255, 255, 0.9)" // 반투명 하얀 배경색으로 설정
                          boxShadow="inset 0px 0px 10px rgba(0,0,0,0.1)" // 선명한 그림자 추가
                          padding="20px"
                          borderRadius="10px"
                          display="grid"
                          gridTemplateRows="auto 1fr auto"
                          gridGap="1rem"
                          position="relative" // 자식 요소의 position을 absolute로 설정하기 위해 relative로 설정
                        >


                          <Text fontSize="xl" fontWeight="bold" mb="1rem" textAlign="center" color="darkgray">
                            스파이를 찾아라!
                          </Text>



                          <Grid flexDirection="column">
                            {/* JANG: ★★★★★★ 스파이 모드 투표 처리 */}



                            <form onSubmit={setVotedSpy} value={votedSpy}>


                            {/* <RadioGroup onChange={setVotedSpy} value={votedSpy}> */}
                              <Radio size="lg" colorScheme="teal" value={0}>
                                <Text mr="1rem" flex="1" color="black">
                                  {gamers[0].name}
                                </Text>
                              </Radio>
                              <Radio size="lg" colorScheme="teal" value={1}>
                                <Text mr="1rem" flex="1" color="black">
                                  {/* {gamers[1].name} */}
                                </Text>
                              </Radio>
                              <Radio size="lg" colorScheme="teal" value={2}>
                                <Text mr="1rem" flex="1" color="black">
                                  {/* {gamers[2].name} */}
                                </Text>
                              </Radio>
                              <Radio size="lg" colorScheme="teal" value={3}>
                                <Text mr="1rem" flex="1" color="black">
                                  {/* {gamers[3].name} */}
                                </Text>
                              </Radio>
                            {/* </RadioGroup> */}


                              <Flex>
                                <Button colorScheme="blue" onClick={votedSpyHandler}>
                                  제출하기
                                </Button>
                              </Flex>

                              
                            </form>





                          </Grid>
                        </Grid>
                      </Box>
                      </>
                    ) : null }






                      {/* JUNHO: 스파이 모드 결과창 */}
                    {/* JANG: 스파이모드 3 : 결과 창 */}
                    {spyPhase === "Result" ? (
                      <>
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
                          <Grid>
                            <Text style={{fontSize: "1rem", fontWeight: "bold"}}>
                              스파이는 <span style={{color: "red"}}>{showSpy}</span>였습니다!
                            </Text>
                            <br />
                            <Text style={{fontSize: "1rem", fontWeight: "bold"}}>
                              제시어는 <span style={{color: "red"}}>{suggestWord}</span>였습니다!
                            </Text>
                          </Grid>
                        {/* JANG: 위에 value와 setValue 참고해서, 스파이 띄우기! */}
                        </Box>
                      </>
                      ) : null}
                  </Flex>
                </Box>
              </Flex>



              {/* JUNHO: 스파이가 입력하는 창  */}
              <Flex justifyContent="center" alignItems="center">
                {/* JANG: 스파이만 이 입력 창 보이게끔 설정! */}
                {iAmSpy ? (
                  <FormControl>
                    <FormLabel><h5 style={{ color: "black" }}>스파이만 보이는 입력칸</h5></FormLabel>
                    <Input placehloder="정답은?" value={ans} onChange={(e) => setAns(e.target.value)} />
                    <Button colorScheme="blue" onClick={spySubmitHandler}>제출</Button>
                  </FormControl>
                ) : null}
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
              <Flex>
              <Button onClick={goToWaitingRoom}>대기방으로~</Button>
              </Flex>
              {/*** @2-2. 스파이 모드 ***/}
        </>
    )
}


export default SpyUI;