import React, { useEffect, useState } from "react";
import UserVideoComponent from "../Openvidu/UserVideoComponent";
import useStore from "../store";
import "./BasicUI.css";

// SANGYOON: BGM 설정
import { WaitingSound } from "./audio";

// JANG: 경쟁, 스파이 모드 컴포넌트 분리
import CompetitionUI from "./CompetitionUI";
import SpyUI from "./SpyUI";

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

function BasicUI() {
  const { gamers, setPlayerCount, curSession, sortGamer } = useStore(
    (state) => ({
      gamers: state.gamers,
      setPlayerCount: state.setPlayerCount,
      curSession: state.curSession,
      sortGamer: state.sortGamer,
    })
  );

  useEffect(() => {
    if (curSession !== undefined) {
      setPlayerCount(gamers.length);
    }
    // 재 렌더링 되는 건 맞지만, 자식 요소가 재 렌더링 되지는 않음
    sortGamer();
  }, [gamers]);


  // JUNHO: 1
  const { mode, setMode } = useStore();

  const [selectedMode, setSelectedMode] = useState(null);

  const showCompetitionDescription = () => {
    setSelectedMode("competition");
  };

  const showSpyDescription = () => {
    setSelectedMode("spy");
  };

  const joinSelectedMode = () => {
    if (selectedMode === "competition") {
      cllickCompetition();
    } else if (selectedMode === "spy") {
      clickSpy();
    }
  };

  // JUNHO: 1

  const cllickCompetition = () => {
    WaitingSound.pause(); // 경쟁모드 클릭시 WaitingSound play off
    // 경쟁모드 클릭시 CompetitionSound play on
    setMode("competition");
  };

  const clickSpy = () => {
    setMode("spy");
    // 스파이모드 클릭시 WaitingSound play off
    // 스파이모드 클릭시 SpySound play off
  };

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
          {/*** @2-0. 게임 시작 전 ***/}
          {mode === "waitingRoom" ? (
            <>
              {/* 모드 선택하는 창 */}
              {/* <Navbar /> */}

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
                  backdropBlur="5px" // 블러
                  boxShadow="rgba(0, 0, 0, 0.2) 0px 1px 8px"
                  mr={4}
                  borderRadius="20px" // 모서리 둥글게
                  display="flex"
                  alignItems="center" // 중앙정렬
                  justifyContent="center" // 중앙정렬
                >
                  <Grid gap={20}>
                    <Button
                      colorScheme="teal"
                      flex={1}
                      size="xl"
                      fontSize="50px" // 글자 크기 조정
                      onClick={showCompetitionDescription}
                      className="Button_Mode"
                      _hover={{ transform: "scale(1.1)" }} // hover시 커지게
                    >
                      오징어 격투
                    </Button>

                    <Button
                      colorScheme="teal"
                      flex={1}
                      size="xl"
                      fontSize="50px" // 글자 크기 조정
                      onClick={showSpyDescription}
                      className="Button_Mode"
                      _hover={{ transform: "scale(1.1)" }}
                    >
                      스파이 문어
                    </Button>

                    {/* JUNHO: Join Button */}

                    
                      <Button
                        colorScheme="teal"
                        flex={1}
                        size="xl"
                        fontSize="50px" // 글자 크기 조정
                        onClick={joinSelectedMode}
                        className="Button_Mode"
                        _hover={{ transform: "scale(1.1)" }}
                      >
                        게임룸 입장
                      </Button>
                   
                  </Grid>
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
                  _hover={{
                    // hover시 효과 설정 (그림자, 크기)
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
                    {/* Mode Descriptions */}
                    {selectedMode === "competition" && (
                      <div>이 모드는 오징어 격투 입니다.
                      1. 2 대 2 로 팀을 나누어 진행합니다.
                      2. 팀 안에 그리는 사람, 맞추는 사람의 역할이 나누어 지며 정답을 맞추면 역할이 서로 바뀌게 됩니다.
                      3. 레드팀, 블루팀 총 2라운드로 진행되며 각 라운드당 제한시간 70초 내에 더 많은 답을 맞춘 팀이 승리합니다.
                      4. 라운드가 진행되는 동안, 상대팀은 '방해하기' 아이템을 한 번 사용할 수 있으며 10초 동안 캔버스에 끼어들어 같이 그림을 그릴 수 있습니다. '방해하기' 아이템을 통해 상대팀을 최대한 헷갈리게 해보세요!
                      </div>
                    )}

                    {selectedMode === "spy" && (
                      <div>
                      이 모드는 스파이 문어 입니다
                      1. 4명의 플레이어가 함께 진행합니다.
                      2. 4명 중 1명의 스파이 문어가 존재하며 나머지 3명은 평범한 오징어 입니다.
                      3. 제시어 한 개가 주어지며, 스파이는 이 제시어를 알지 못 합니다.
                      4. 카운트가 시작되면, 플레이어마다 10초씩 그림을 이어 그려서 제시어를 완성시킵니다.
                      5. 모든 플레이어가 그림을 그리기 전까지, 스파이가 제시어를 눈치채 정답을 맞추면 스파이의 승리! 답을 맞출 기회는 총 3번입니다.
                      6. 스파이가 답을 맞추지 못 한채로 모든 턴이 끝이 난다면, 플레이어들은 투표를 통해 스파이 문어를 색출합니다.
                      7. 투표를 통해 색출한 플레이어가 스파이 문어이면 오징어들의 승리!
                      문어를 색출하지 못하면 스파이 문어의 승리입니다.
                      </div>
                    )}
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
                      // key={gamers[0].name}
                      key={0}
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
                      // key={gamers[1].name}
                      key={1}
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
                      // key={gamers[2].name}
                      key={2}
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
                      // key={gamers[3].name}
                      key={3}
                    />
                  )}
                </Box>
              </Flex>
              {/*** @2-0. 게임 시작 전 ***/}
            </>
          ) : mode === "competition" ? (
            <>
              <CompetitionUI />

              {/*** @2-1. 경쟁 모드 ***/}
            </>
          ) : (
            <>
              {/*** @2-2. 스파이 모드 ***/}

              <SpyUI />

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
