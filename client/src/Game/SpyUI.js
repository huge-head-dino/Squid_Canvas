import React, { useEffect, useState } from "react";
import UserVideoComponent from "../Openvidu/UserVideoComponent";
import useStore from "../store";
import "./BasicUI.css";

import RealCanvas from "./For_canvas/RealCanvas";

import socket from "../Openvidu/socket";

// SANGYOON: Spy Sound
import { WaitingSound, SpySound, EntranceEffect } from "./audio";

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
  Select,
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
    host,
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
  //YEONGWOO: 스파이 모드 에서 현재 그리는 사람, 현재 라운드
  const [currentPainterId, setCurrentPainterId] = useState(null);
  const [currentRound, setCurrentRound] = useState(-1);

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
        if (host === myUserId) {
          socket.emit('spyFinish');
        }
      }, 20000);
    });

    socket.on('spyVoteResult', (spy, result) => {
      console.log('spyVoteResult');
      setSpyHowToWin('vote');
      if (result === 'spyWin') {
        setSpyWin(true);
        console.log('스파이가 승리했습니다.');
      } else if (result === 'spyLose') {
        console.log('스파이가 패배했습니다.');
      }
      setShowSpy(gamers[spy].name);
      console.log('스파이는 ' + gamers[spy].name + '입니다.')
    });

    socket.on('spyFinish', () => {
      console.log('spyFinish');
      alert('스파이모드가 종료되었습니다.');
      spyUIInitializer();
      setMode('waitingRoom');
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
  const [selectedGamer, setSelectedGamer] = useState("");
  const [spyHowToWin, setSpyHowToWin] = useState(''); // vote or submit
  const [spyWin, setSpyWin] = useState(false);

  // JUNHO: 스파이 모드 시작 버튼 핸들러// 루프 시작하는 버튼
  const spyButtonHandler = () => {
    socket.emit('spy1Ready');
    socket.emit('updateQuestWords_Spy');
    // gamers[0].name === myUserName ? setIAmPainter(false) : setIAmPainter(true);
  };

  //YEONGWOO: 스파이 모드에서 현재 그리는 사람 & 현재 라운드
  useEffect(() => {
    if ( currentPainterId === myUserId ) {
      socket.emit('updateCurrentPainterId', currentPainterId);
    }
    setCurrentRound(currentRound + 1);
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
    socket.on('gameEndByButton', () => {
      setMode('waitingRoom');
    })

    return () => {
      socket.off('gameEndByButton');
    }
  }, [socket]);

  const spySubmitHandler = () => {
    if (suggestWord === ans) {
      setSpyHowToWin('submit');
      setSpyPhase('Result');
      setSpyWin(true);
    }
  };

  const votedSpyHandler = (selectedGamer) => {
    socket.emit('submitVotedSpy', selectedGamer);
    // setSpyPhase('loading'); // TODO: 제출 이후 로딩창
  };

  const spyUIInitializer = () => {
    setIAmSpy(false);
    setSpyPainter(false);
    setVotedSpy('유저1');
    setSpyPhase('Game');
    setSelectedGamer("");
    setSpyHowToWin('');
    setSpyWin(false);
    setSuggestWord('');
    setAns('');
    setSpyTimerValue(0);
    setSpyCountdown(false);
    setSpyPlayers([0, 1, 2, 3]);
    setPlayerTrun(0);
    setShowSpy('');
    setCurrentPainterId(null);
    setCurrentRound(-1);
  };

  // MRSEO: 대기실 버튼으로 대기실로 돌아가는 함수
  const goToWaitingRoom = () => {
    spyUIInitializer();
    socket.emit('goToWaitingRoom')
  };

  // JUNHO: 스파이모드 끝

  // SANGYOON: 경쟁모드에서 대기실로 돌아가서 입장 사운드 실행
  const waitingroomSound = () => {
    SpySound.pause();
    EntranceEffect.play();
    WaitingSound.loop = true;
    WaitingSound.currentTime = 0;
    WaitingSound.play();
    WaitingSound.volume = 0.5;
  };

  return (
    <>
      {
        gamers.length === 4 ? (
          <>
            {/* JANG: 08.06 - ★★★ 상단 어떻게 처리할 건지..? */}
            {/* JUNHO: 빨간색, 노란색, 파란색 상단 네모 3개 시작*/}
            {/* <Navbar /> */}

          <Flex height="100%" width="100%" flexDirection="column">

            <VStack
              height="100%"
              width="100%"
              justifyContent="center"
              alignItems="center"
              spacing={4}
              marginTop={4}
            >
              {/* <Flex justifyContent="center">
                <h1>스파이 모드 게임</h1>
              </Flex> */}

              <Flex
                h="66%"
                w="100%"
                alignItems="center"
                justifyContent="center"
              >   

              <Box
                className="Game_Character"
                h="100%"
                w="20%"
                bg="rgba(255, 255, 255, 0.7)"
                backdropFilter="auto" // 블러
                backdropBlur="5px"    // 블러
                boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px"
                mr={4}
                borderRadius="20px" // 모서리 둥글게
                display="flex"
                flexDirection="column" // 세로 정렬
                alignItems="center" // 중앙정렬
                justifyContent="center" // 중앙정렬
                gap={20}
              >
                  <Flex>
                    {/* 왼쪽1 : 타이머 */}
                    <h1 style={{ fontWeight: "bold" }}>타이머 : {spyTimerValue}</h1>
                  </Flex>
                  <Flex>
                    {/* 왼쪽3 : 현재 몇 번째 턴 */}
                    <h3>현재  4턴 중 <br/><br/>
                    <span style={{color: "red" }}>{currentRound}</span> 번째 차례 입니다.</h3>
                  </Flex>
                  <Flex>
                    {/* 왼쪽2 : 스파이모드 시작 */}
                    <Button colorScheme="red" flex="1" color="white" size="lg"
                      m='10px' className="junhobtn" onClick={spyButtonHandler}>스파이모드 시작</Button>
                  </Flex>
      
              </Box>

              <Box
                  h="100%"
                  w="50%"
                  bgColor="brown"
                  // backdropFilter="auto"
                  // backdropBlur="5px"
                  boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  className="Game_Mode"
                  borderRadius="20px" // 모서리 둥글게
                  transition="0.3s ease" // 부드러운 애니메이션
                >
                  {/* 중앙 : 캔버스 / 투표 / 결과 */}
                      <Flex
                        justifyContent="center"
                        alignContent="center"
                        width="90%"
                        h="80%"
                        className="캔버스Box1"
                      >
                        {/* JANG: 스파이모드 1 : 그냥 캔버스 */}
                        {spyPhase === "Game" ? (
                          <> 
                              {/* //JUNHO: 초록색 영역 */}
                              <Box
                                name="초록색영역"
                                // JANG: 캔버스 크기 임시 조정
                                bg="white"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                width="100%"
                                mb="20px"
                              >
                                <RealCanvas />
                              </Box>
                          </> 
                        ) : null}

                        {/* JANG: 스파이모드 2 : 투표 창 */}
                        {spyPhase === "Vote" ? (
                          <>
                            <Center
                              width="100%"
                              height="100%"
                              bg="rgba(255, 255, 255, 0.7)"
                              boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px"
                              mr={4}
                              borderRadius="20px" // 모서리 둥글게
                              fontStyle={{ fontWeight: "bold", fontSize: "1.5rem" }}
                            >
                               <VStack spacing={6} w="80%" alignItems="center"> 
                                <Text fontSize="3xl" fontWeight="bold" textAlign="center" color="black">
                                    스파이를 찾아라!
                                </Text>

                                <Select placeholder="스파이 선택" size="lg" width="100%" onChange={(e) => setSelectedGamer(e.target.value)}>
                                    <option value={0}>{gamers[0].name}</option>
                                    <option value={1}>{gamers[1].name}</option>
                                    <option value={2}>{gamers[2].name}</option>
                                    <option value={3}>{gamers[3].name}</option>
                                </Select>

                                <Button colorScheme="green" width="50%" onClick={() => { votedSpyHandler(selectedGamer) }}>
                                    제출하기
                                </Button>
                            </VStack>
                            </Center>
                          </> 
                       ) : null} 

                        {/* JANG: 스파이모드 3 : 결과 창 */}
                        {spyPhase === "Result" ? (
                          <>
                            <Center
                              width="100%"
                              height="100%"
                              bg="white"
                              boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px"
                              borderRadius="20px"
                            >
                              {/* <img src={mafia} alt=""></img> */}
                            <VStack spacing={4} alignItems="center">
                                <Text fontSize="2rem" fontWeight="bold">
                                    스파이는 <Text as="span" color="red" display="inline">{showSpy}</Text>였습니다!
                                </Text>

                                <Text fontSize="2rem" fontWeight="bold">
                                    제시어는 <Text as="span" color="red" display="inline">{suggestWord}</Text>였습니다!
                                </Text>

                                {spyWin ? (
                                    spyHowToWin === 'vote' ? (
                                        <Text fontSize="3rem" fontWeight="bold">
                                            게임 결과 : 투표로 스파이 승리!
                                        </Text>
                                    ) : (
                                        <Text fontSize="3rem" fontWeight="bold">
                                            게임 결과 : 제시어로 스파이 승리!
                                        </Text>
                                    )
                                ) : (
                                    <Text fontSize="3rem" fontWeight="bold">
                                        게임 결과 : 스파이 <span style={{color: "red"}}>패배!</span>
                                    </Text>
                                )}
                            </VStack>
                              {/* JANG: 위에 value와 setValue 참고해서, 스파이 띄우기! */}
                            </Center>
                          </>
                         ) : null} 
                      </Flex>
                  </Box>

                <Box
                  className="Game_Character"
                  h="100%"
                  w="20%"
                  bg="rgba(255, 255, 255, 0.7)"
                  backdropFilter="auto" // 블러
                  backdropBlur="5px"    // 블러
                  boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px"
                  ml={4}
                  borderRadius="20px" // 모서리 둥글게
                  display="flex"
                  flexDirection="column" // 세로 정렬
                  alignItems="center" // 중앙정렬
                  justifyContent="center" // 중앙정렬
                  gap={10}
                >
                  
                  <Flex>
                    {/* 오른쪽1 : 내 순서 -> 나중에 빛나는 효과 입히기 */}
                    <h3>내 순서 : <span style={{color: "red"}}>{playerTurn}</span> 번째</h3>
                  </Flex>
                  <Flex
                      flexDirection="column"
                      gap={4}  // 이 Flex 내부의 아이템 사이의 간격 설정
                  >
                      {!iAmSpy ? (
                          <Flex
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                          >
                              <h1 style={{color: "red"}}>{suggestWord}</h1>
                          </Flex>
                      ) : null}
                      <Box
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="center"
                          gap={2}  // 이 Box 내부의 아이템 사이의 간격 설정
                      >
                          {iAmSpy ? (
                                <div>
                                  <FormLabel><h5 style={{ color: "gray"}}>(쉿! 당신은 스파이입니다.)</h5></FormLabel>
                                  <Flex>
                                    <Input placehloder="정답은?" value={ans} onChange={(e) => setAns(e.target.value)} />
                                    <Button colorScheme="blue" onClick={spySubmitHandler} ml={1}>제출</Button>
                                  </Flex>
                              </div>
                          ) : null}
                      </Box>
                  </Flex>

                </Box>
              </Flex>


            {/* JANG: 08.06 - 게이머들 */}
            <Flex
              h="30%"
              w="90%"
              justifyContent="space-between"
              margin="10px"
            >
              <Box
                w="23%"
                height="fit-content"
                minHeight="150px"
                bg={gamers[0].name === currentPainterId ? "yellow" : "rgba(255, 255, 255, 0.7)"}
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
                bg={gamers[1].name === currentPainterId ? "yellow" : "rgba(255, 255, 255, 0.7)"}
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
                bg={gamers[2].name === currentPainterId ? "yellow" : "rgba(255, 255, 255, 0.7)"}
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
                bg={gamers[3].name === currentPainterId ? "yellow" : "rgba(255, 255, 255, 0.7)"}
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
            {/* JANG: 푸시 때 주석 해제! */}
            {/*** @2-2. 스파이 모드 ***/}
          </VStack>
          <Button 
            onClick={() => {
              goToWaitingRoom();
              waitingroomSound();
            }}
            style={{width: "min-content", position: "relative"}}>
            대기실로 이동
          </Button>
        </Flex>
        </>
        ) : (
          <>
            <h1>인원이 모자랍니다. 잠시만 기다려 주세요~</h1>
            <Flex>
              <Button 
                onClick={() => {
                  goToWaitingRoom();
                  waitingroomSound();
                }}
                >
                대기실로 이동
              </Button>
            </Flex>
          </>
        )
      }
    </>
  )
}


export default SpyUI;