import React, { useState, useEffect } from 'react';
import './Webcam.css';
import axios from 'axios';

// YEONGWOO: provider 생성
import SessionContext from './SessionContext';

// OpenVidu
import { OpenVidu } from 'openvidu-browser';
import UserVideoComponent from './UserVideoComponent';

// Zustand
import useStore from '../store';

// BasicUI
import BasicUI from '../Game/BasicUI';

// MRSEO: 
import socket from './socket';

// JANG: Chakra UI
import { 
  Button, ButtonGroup, Box,
  Center,
  FormLabel, Flex,
  Heading,
  Input,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalCloseButton,
  Spacer, 
  useDisclosure, // CHAKRA 제공 함수
} from '@chakra-ui/react'


// NOTE: 배포 전 확인!
// const APPLICATION_SERVER_URL = "https://mysquidcanvas.shop/"
const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'production' ? '' : 'https://demos.openvidu.io/';

const Webcam = () => {
  const [mySessionId, setMySessionId] = useState('SessionA');
  const [myUserName, setMyUserName] = useState('Participant' + Math.floor(Math.random() * 100));
  const [session, setSession] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [iAmSolverRender, setIAmSolverRender] = useState(false);

  // MRSEO: ZUSTAND 상태 변수 선언
  const { 
    ans,
    setAns,
    round,
    redScoreCnt,
    setRedScoreCnt,
    blueScoreCnt,
    setBlueScoreCnt,
    canSubmitAns,
    phase,
    setPhase,
    gamers,
    setGamers,
    host,
    setHost,
    setCanSeeAns,
    setDrawable,
    setIAmPainter,
    setTeam,
    team,
    myUserId,
    setMyUserId,
    iAmSolver,
    setIAmSolver,
   } = useStore(
    state => ({
      ans: state.ans,
      setAns: state.setAns,
      round: state.round,
      redScoreCnt: state.redScoreCnt,
      setRedScoreCnt: state.setRedScoreCnt,
      blueScoreCnt: state.blueScoreCnt,
      setBlueScoreCnt: state.setBlueScoreCnt,
      canSubmitAns: state.canSubmitAns,
      phase: state.phase,
      setPhase: state.setPhase,
      gamers: state.gamers,
      setGamers: state.setGamers,
      host: state.host,
      setHost: state.setHost,
      setCanSeeAns: state.setCanSeeAns,
      setDrawable: state.setDrawable,
      setIAmPainter: state.setIAmPainter,
      setTeam: state.setTeam,
      team: state.team,
      myUserId: state.myUserId,
      setMyUserId: state.setMyUserId,
      iAmSolver: state.iAmSolver,
      setIAmSolver: state.setIAmSolver,
    })
   );

  useEffect(() => {

    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);

   // SANGYOON: 1. PASS 누르면 서버로 발신(emit)
  const handlePass = () => {
    socket.emit('updateQuestWords');
  };
  
  const onBeforeUnload = (event) => {
    leaveSession();
  };

  const handleChangeSessionId = (e) => {
    setMySessionId(e.target.value);
  };

  const handleChangeUserName = (e) => {
    setMyUserName(e.target.value);
  };

  const joinSession = async(e) => {
    e.preventDefault();
    
    const OV = new OpenVidu();
    
    const mySession = OV.initSession();
    
    mySession.on('streamCreated', (event) => {
      var subscriber = mySession.subscribe(event.stream, undefined); 
      // mySession.subscribe : openvidu 세션(mySession)에 대해 스트림 구독
      
      // MRSEO: SUBSCRIBER 로직 업데이트 -> 다시 확인!
      // var subscribers = [...subscribers];
      setGamers({
        name: JSON.parse(event.stream.connection.data).clientData,
        streamManager: subscriber,
        // MRSEO: 08.04 상태를 true로 초기화
        drawable: true,
        canSeeAns: true,
      });
      
      subscribers.push(subscriber);
      setSubscribers(subscribers);
    });
    
    //JANG: deleteGamer 로직 수정할 것! (아래 주석 보면서)
    mySession.on("streamDestroyed", (event) => {
      // var subscribers = [...subscribers];
      
      // 1. subscribers 배열에서 해당 subscriber 제거
      const index = subscribers.indexOf(event.stream.streamManager);
      if (index > -1) {
        subscribers.splice(index, 1);
        setSubscribers(subscribers);
      }
      
      // 2. gamers 정보에서 해당 subscriber 제거
      // JANG: 아래 useStore 쓰는 것보다, zustand로 불러와서 쓰면 바로 렌더링 됨! (확인 필요)
      useStore.getState().deleteGamer(JSON.parse(event.stream.connection.data).clientData);
      
      // 3. 방에 남아 있는 플레이어 수 업데이트
      // JANG: setPlayerCount 갱신되기 전 삭제하는 시점의 플레이어 수로 갱신되는 문제 해결
      // JANG: 일단 이거 없애니까, 지금까지 1) gamer 배열 중복 등록 방지 2) 세션 나가면 gamer 배열 갱신 성공 + 비디오 비워지고 새 유저 그 자리에
      // useStore.getState().setPlayerCount(useStore.getState().gamers.filter((a) => event.stream.streamManager.clientData !== a.name).length);
      
      //JANG: 아래 로직으로 가는 게 더 좋을 것 같다! (앞서 useStore로 수정 진행하고 -> setSubscriber로 한 번에 렌더링)
      // const deleteSubscriber = (streamManager, subscribers) => {
        //   let index = subscribers.indexOf(streamManager, 0); 
        
        //   useStore.getState().deleteGamer(JSON.parse(event.stream.connection.data).clientData);
        //   useStore.getState().setPlayerCount(useStore.getState().gamers.length);
        
        //   if (index > -1) {
          //     subscribers.splice(index, 1);  // subscribers 배열에서 해당 streamManager 삭제
          //     return subscribers;
      //   }
      // };
      
      // setSubscribers(deleteSubscriber(event.stream.streamManager, subscribers));
    });

    mySession.on('exception', (exception) => {
      console.warn(exception);
    });
    
    try{
      const token = await getToken(); 
      await mySession.connect(token, { clientData: myUserName })
      .then(async () => {
        let publisher = await OV.initPublisherAsync(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: '640x480',
          frameRate: 30,
          insertMode: 'APPEND',
          mirror: false,
        });
        
        mySession.publish(publisher);
        
        setGamers({
          name: myUserName,
              streamManager: publisher,
              // MRSEO: gamer의 drawable, canSeeAns 상태 변수 추가
              // MRSEO: 08.04 상태를 true로 초기화
              drawable: true,
              canSeeAns: true,
            });
            setMyUserId(myUserName)
            
            // useStore.getState().setMyUserID(myUserName);
            setPublisher(publisher);
          })
        }
    catch (error) {
      console.log('There was an error connecting to the session:', error.code, error.message);
    }
    
    setSession(mySession);
    
  };
  
  // JANG: 이부분 수정해야 될 수도!
  // 내가 나갈 때, 방에 남은 다른 유저들도 모두 게임에서 제거 되어 버림
  // 그냥 창을 끌 때와, 직접 exit 버튼 누르는 것에 차이가 있을까?
  const leaveSession = () => {
    const mySession = session;

    if (mySession) {
      mySession.disconnect();
    }
    
    useStore.getState().clearGamer();
    
    setSession(undefined);
    setSubscribers([]);
    setMySessionId('SessionA');
    setMyUserName('Participant' + Math.floor(Math.random() * 100));
    setPublisher(undefined);
  };
  
  const getToken = async () => {
    const sessionId = await createSession(mySessionId);
    console.log('getToken' + sessionId);
    return await createToken(sessionId);
  };
  
  const createSession = async (sessionId) => {
    console.log('create' + sessionId);
    const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', { customSessionId: sessionId }, {
      headers: { 'Content-Type': 'application/json', },
    });
    return response.data; // The sessionId (정확히는 session, sessionId)
  };
  
  const createToken = async (sessionId) => {
    console.log('createToken' + sessionId);
    const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections', {}, {
      headers: { 'Content-Type': 'application/json', },
    });
    return response.data; // The token (정확히는 connection.token)
  };
  
  //JUNHO: 시작


  //MRSEO: host 설정
  useEffect(() => {
    if (gamers.length === 0) return;
    console.log("host 설정")
    setHost(gamers[0].name);
  }, [gamers]);

  // MRSEO: 게임 시작 버튼을 누른 후, 플레이어 상태 초기화
  useEffect(() => {
    if (phase === 'Game1') {
      GameInitializer1();
    }
  }, [phase]);  // `phase`가 변경될 때 마다 이 useEffect는 실행됩니다.

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
    if (phase === 'Game2'){
      GameInitializer2();
    }
  }, [phase]);

  useEffect(() => {
    const teamSettingHandler = () => {
      console.log('teamSettingHandle_client@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      // gamers배열을 돌면서 myUserName과 같은 이름을 가진 gamer의 인덱스가 짝수면 setTeam('red'), 홀수면 setTeam('blue')
      console.log(gamers, myUserName)
      for (let i = 0; i < gamers.length; i++) {
        if ( gamers[i].name === myUserName ){
          if ( i % 2 === 0 ){
            console.log("red teamSetting"+i)
            setTeam('red');
          } else {
            console.log("blue teamSetting"+i)
            setTeam('blue');
          }
        }
      }
      if ( myUserName === useStore.getState().host ){
        setPhase('Game1');
        socket.emit('round1Start');
      }
    }

    socket.on('teamSetting', teamSettingHandler );

    return () => {
      socket.off('teamSetting', teamSettingHandler );
    }

  },[socket, gamers]);

  const handleGameStart = () => {
    // MRSEO: 게임 시작 버튼 누르면, 게임 시작, useStore.getState()지움
    console.log('startTeamSetting@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    socket.emit('startTeamSetting')
  };


// MRSEO: 게임 초기화
const GameInitializer1 = () => {
  console.log("GameInitializer 실행!!")
  if ( round === 1 ){
    console.log("GameInitializer111111111111111111111111");
      for (let i = 0; i < gamers.length; i++) {
          if ( i === 0 ){
              setCanSeeAns(true, gamers[i].name);
              setDrawable(true, gamers[i].name);
          } else if ( i === 1 || i === 3) {
              setCanSeeAns(true, gamers[i].name);
              setDrawable(false, gamers[i].name);
          } else {
              setCanSeeAns(false, gamers[i].name);
              setDrawable(false, gamers[i].name);
          }

          if ( gamers[i].name === myUserName ){
            setIAmPainter(gamers[i].drawable);
          }

          if ( gamers[0] ) {
            setIAmSolverRender(true);
            setIAmSolver(true);
          }
      }
      console.log("round1 초기화 실행 완료!!");
    }

  }

  // MRSEO: 게임 초기화
  const GameInitializer2 = () => {

    if ( round === 2 ){
      console.log("GameInitializer222222222222222222222222222222");
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

            if ( gamers[i].name === myUserName ){
              setIAmPainter(gamers[i].drawable);
            }

            if ( gamers[1] ) {
              setIAmSolverRender(true);
              setIAmSolver(true)
            }
        }
        console.log("round2 초기화 실행 완료!!");
    }
    // console.log(gamers);
  }

    // MRSEO: 정답 제출
    const submitAns = () => {
      if ( !useStore.getState().canSubmitAns ) return;
      if ( round === 1 ){
        if ( ans === '사과' ){
          
          setCanSeeAns(!gamers[0].canSeeAns, gamers[0].name);
          setDrawable(!gamers[0].drawable, gamers[0].name);
  
          setCanSeeAns(!gamers[2].canSeeAns, gamers[2].name);
          setDrawable(!gamers[2].drawable, gamers[2].name);
  
          if ( gamers[0].name === myUserName){
            setIAmPainter(gamers[0].drawable);
          } else if ( gamers[2].name === myUserName ){
            setIAmPainter(gamers[2].drawable);
          }
  
          if ( gamers[0] ) {
            setIAmSolver(!iAmSolver)
          } else if ( gamers[2] ) {
            setIAmSolver(!iAmSolver)
          }
  
          setRedScoreCnt(redScoreCnt + 1);
  
          socket.emit('sendScore', team);
  
        }
      }
      if ( round === 2 ){
        if ( ans === '배' ){
  
          setCanSeeAns(!gamers[1].canSeeAns, gamers[1].name);
          setDrawable(!gamers[1].drawable, gamers[1].name);
  
          setCanSeeAns(!gamers[3].canSeeAns, gamers[3].name);
          setDrawable(!gamers[3].drawable, gamers[3].name);
  
          if ( gamers[1].name === myUserName){ 
            setIAmPainter(gamers[1].drawable);
          } else if ( gamers[3].name === myUserName ){
            setIAmPainter(gamers[3].drawable);
          }
  
          if ( gamers[1] ) {
            setIAmSolver(!iAmSolver)
          } else if ( gamers[3] ) {
            setIAmSolver(!iAmSolver)
          }
  
          setBlueScoreCnt(blueScoreCnt + 1);
  
          socket.emit('sendScore', team);
  
        }
      }
        setAns('');
    };

  // JANG: 나중에 유저 입장이 안정적으로 처리되면 지울 것!
  const consoleCommand = () => {
    console.log("gamers : ", useStore.getState().gamers);
    console.log("host : ", host);
    console.log("gamers[0] : ", gamers[0].name);
    console.log("myUserName : ", myUserName)
    console.log("redScoreCnt : ", redScoreCnt);
    console.log("blueScoreCnt : ", blueScoreCnt);
    console.log("round : ", round);
    console.log("team : ", team);
//폼 미쳣다! 신경원 그는 서인가
    // setCanSeeAns(!gamers[0].canSeeAns, gamers[0].name);
    // setDrawable(!gamers[0].drawable, gamers[0].name);
  }

  //JANG: CHAKRA UI 제공 함수function
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (

    <div className="Wrapper">

        {session === undefined ? (

        <div className="BeforeGame">

          <Center h="100vh">

            <Button colorScheme='teal' size='md' 
                    height='150px' width='300px'  
                    border='3px' borderColor='green.500'
                    fontSize='4xl'
                    onClick={onOpen}
                    >
              JOIN GAME
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay /> 
              <ModalContent className="JoinForm"> 
                <ModalHeader><h2 style={{textAlign: 'center'}}>게임 참가</h2></ModalHeader>
                <ModalCloseButton />
                  <form onSubmit={joinSession}>


                  <div style={{width: '80%', margin: '0 auto'}}>
                    <FormLabel>닉네임</FormLabel>
                    <Input
                        type="text"
                        id="userName"
                        value={myUserName}
                        onChange={handleChangeUserName}
                        required
                        style={{marginBottom: "10px"}}
                    />
                    <FormLabel>ROOM 넘버</FormLabel>
                    <Input 
                        type="text"
                        id="sessionId"
                        value={mySessionId}
                        onChange={handleChangeSessionId}
                        required 
                    />
                    </div>

                    <ModalFooter>
                      <Button onClick={onClose} colorScheme='teal' size='md' type="submit">
                        입장하기
                      </Button>
                    </ModalFooter>

                  </form>
              </ModalContent>
            </Modal>

          </Center>

        </div>


        ) : null}

      {session !== undefined ? (
            <>
            {/* MRSEO: useStore.getState()지움 */}
            {phase === 'Ready' || phase === 'Game1' || phase === 'Game2'? (
              // JANG: 게임 대기방으로 만들기!
              <div className="GameForm">
              
              <Flex flexDirection="column" height="100vh">
                <Flex flex="8">
                  {/* JANG: 게임 대기방 */}
                  <SessionContext.Provider value={{ mySessionId, myUserName }}>
                    <BasicUI />
                  </SessionContext.Provider>
                </Flex>

                <Flex flex="1.7" minWidth='max-content' alignItems='center' justifyContent='center' gap='2'>
                  
                  {/* SANGYOON: PASS 버튼 기능 */}
                  <Button
                    colorScheme='blue'
                    size='lg'
                    onClick={handlePass}
                  >
                    PASS
                  </Button>


                  {/* MRSEO: 참가자 수 출력 테스트 */}
                  {/* JANG: 나중에 확인하고 버릴 거! */}
                  <Button onClick={consoleCommand}>test</Button>

                  {phase === 'Game1' || phase === 'Game2' ? (
                        <>
                        {/* MRSEO: 조건 수정 */}
                        { (team === 'red' && iAmSolverRender === true) || ( team === 'blue' && iAmSolverRender === true ) ?
                         (
                          // JANG: TODO - 정답 입력창 css 수정
                          <div>
                        <Input placeholder='정답을 입력하시오' value={ans} onChange={(e) => setAns(e.target.value)}/>
                        <Button colorScheme='blue' onClick={submitAns}>제출</Button>
                      </div> 
                        ):null}
                    </>
                  ):null}
                </Flex>

                <Flex flex="0.3" minWidth='max-content' alignItems='center' gap='2'>
                  <Box p='2'>
                    <Heading size='md' color='white'>CopyRight@RED_TEAM_3</Heading>
                  </Box>
                  <Spacer />
                  <ButtonGroup gap='2' mb="2">
                    <Button
                      colorScheme='red'
                      size='lg'
                      onClick={leaveSession}
                    >
                      Exit
                    </Button>
                    {/* Start 버튼은 4명이 다 차면 뜨도록 변경! */}
                    {myUserName === host && gamers?.length === 4 ? (
                      <Button
                        colorScheme='Messenger'
                        size='lg'     
                        onClick={handleGameStart}
                        marginRight="10px"
                      >
                        Start
                      </Button>
                    ):null}
                    <Spacer />
                    <Spacer />
                  </ButtonGroup>
                </Flex>
              </Flex>

              </div>
              ) : null }

                  {useStore.getState().gameStart === true && useStore.getState().gameEnd === false ? (
                    
                    // JANG: 게임 시작 방으로 만들기!
                    <div className="GameForm_Body">
                        {/* useStore.getState().gameStart -> false이면, 캔버스 lock 걸고
                            useStore.getState().gameStart -> true이면, 캔버스 lokc 풀기 + 게임 시작
                        */}
                        <div className="GameForm_Content">
                          
                            
              
                        </div>
                    </div>
                ):null}
          </>
          ) : null}

                  
                {/* useStore.getState().gameEnd === false ? 
                useStore.getState().gameEnd === true ? ( */}
                    <>
                    {/* 게임 끝났을 때 */}
                    </>

    </div>

    )
}

export default Webcam;
