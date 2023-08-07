import React, { useEffect, useState } from "react";
import UserVideoComponent from "../Openvidu/UserVideoComponent";
import useStore from "../store";
import "./BasicUI.css";

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
  const {
    gamers,
    setPlayerCount,
    curSession,
    sortGamer,
  } = useStore(
    state => ({
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

  

  const {
    mode,
    setMode
  } = useStore();
  const cllickCompetition = () => {
    setMode('competition');
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
          <Navbar />

          {/*** @2-0. 게임 시작 전 ***/}
          {mode === 'waitingRoom' ? (
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
                    src={`${process.env.PUBLIC_URL}/resources/images/jingjing.png`}
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
                      onClick={cllickCompetition}
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
            <div>
              
              <CompetitionUI />
            
              {/*** @2-1. 경쟁 모드 ***/}
            </div>
          ) : (
            <>
              {/*** @2-2. 스파이 모드 ***/}

              <SpyUI/>

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