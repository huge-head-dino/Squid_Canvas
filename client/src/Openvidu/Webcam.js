import React, { useState, useEffect } from 'react';
import './Webcam.css';
import axios from 'axios';

// OpenVidu
import { OpenVidu } from 'openvidu-browser';
import UserVideoComponent from './UserVideoComponent';

// Zustand
import useStore from '../store';

// Bootstrap-react
import Button from 'react-bootstrap/Button';

// JANG: (08.01) Game1 추가
import GamePlay from '../Game/GamePlay';

// ★ TODO: 서버 url 변경 필요
const APPLICATION_SERVER_URL = "https://mysquidcanvas.shop/"
// const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'production' ? '' : 'https://demos.openvidu.io/';

const Webcam = () => {
  const [mySessionId, setMySessionId] = useState('SessionA');
  const [myUserName, setMyUserName] = useState('Participant' + Math.floor(Math.random() * 100));
  const [session, setSession] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    window.addEventListener('beforeunload', onBeforeUnload);

    // 현재 페이지의 url에서 sessionId(쿼리 파라미터)를 가져오고
    // 해당 값이 존재하면, 컴포넌트 상태 업데이트 후 joinSession() 호출
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get("sessionId");
    if (sessionId) {
      setMyUserName("Participant" + Math.floor(Math.random() * 100));
      setMySessionId(sessionId);
      joinSession();
    }

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (session !== undefined) {
      // JANG: (08.01) 맞춰서 상태 업데이트!

    }
  }, [session]);

  const onBeforeUnload = (event) => {
    leaveSession();
  };

  const handleChangeSessionId = (e) => {
    setMySessionId(e.target.value);
  };

  const handleChangeUserName = (e) => {
    setMyUserName(e.target.value);
  };

  const joinSession = async() => {

    const OV = new OpenVidu();
    const mySession = OV.initSession();
    // setSession(mySession);
    // setSession은 비동기로 처리하므로, 이벤트 핸들러 등록 전에 mySession 변수 올바르게 정의

    await setSession(mySession); // await을 통해 mySession 변수가 올바르게 정의될 때까지 기다림
    
    useStore.getState().setCurSession(mySession);

    mySession.on('streamCreated', (event) => {
      var subscriber = mySession.subscribe(event.stream, undefined);
      var subscribers = [...subscribers];

      const addSubscriber = (subscriber, subscribers) => {
        subscribers.push(subscriber);
        useStore.getState().setGamers({
          name: JSON.parse(event.stream.connection.data).clientData,
          streamManager: subscriber,
        });
        return subscribers;
      };
      setSubscribers(addSubscriber(subscriber, subscribers));
    });

    mySession.on("streamDestroyed", (event) => {
      var subscribers = [...subscribers];

      const deleteSubscriber = (streamManager, subscribers) => {
        let index = subscribers.indexOf(streamManager, 0);
        useStore.getState().deleteGamer(JSON.parse(event.stream.connection.data).clientData);
        useStore.getState().setPlayerCount(useStore.getState().gamers.length);
        if (index > -1) {
          subscribers.splice(index, 1);
          return subscribers;
        }
      };

      setSubscribers(deleteSubscriber(event.stream.streamManager, subscribers));
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
  
            // JANG: 원래 코드랑 비교하면서 수정하기!
            useStore.getState().setGamers({
              name: myUserName,
              streamManager: publisher,
            });
  
            useStore.getState().setMyUserID(myUserName);
            setPublisher(publisher);

          })
    }
    catch (error) {
      console.log('There was an error connecting to the session:', error.code, error.message);
    }
  };
  

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

    // location.replace("http://localhost:3000/");
  };

  const handleGameStart = () => {
    useStore.getState().setGameStart(true);
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
    return response.data; // The sessionId
  };

  const createToken = async (sessionId) => {
    console.log('createToken' + sessionId);
    const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections', {}, {
      headers: { 'Content-Type': 'application/json', },
    });
    return response.data; // The token
  };


  return (

    <div className="Wrapper">

      {session === undefined ? (
        
        <div className="JoinForm">

            {/* <div className="JoinForm_Header" id="img-div">
                <img src="resources/images/main-card.jpeg" alt="logo" />
            </div> */}

                <h1> 게임 참가 </h1>
                <form className="form-group" onSubmit={joinSession}>
                    <p>
                        <label>Participant: </label>
                        <input
                            className="form-control"
                            type="text"
                            id="userName"
                            value={myUserName}
                            onChange={handleChangeUserName}
                            required
                        />
                    </p>
                    <p>
                        <label> Session: </label>
                        <input
                            className="form-control"
                            type="text"
                            id="sessionId"
                            value={mySessionId}
                            onChange={handleChangeSessionId}
                            required
                        />
                    </p>
                    <div className="JoinForm_Button">
                        <input name="commit" type="submit" value="JOIN" />
                    </div>
                </form>
        </div>

        ) : null}

        {session !== undefined ? (
            <>
            {useStore.getState().gameEnd === false ? (

                <div className="GameForm">

                    <div className="GameForm_Header">

                        <div className="GameForm_Button">
                            <Button
                            className="exit_button"
                            onClick={leaveSession}
                            value="Exit"
                            >
                            Exit
                            </Button>

                            {/* Start 버튼은 4명이 다 차면 뜨도록 변경! */}
                            <Button
                            type="submit"
                            className="gameStart_button"
                            onClick={handleGameStart}
                            >
                            Start
                            </Button>
                        </div>
                    </div>

                    <div className="GameForm_Body">
                        {/* useStore.getState().gameStart -> false이면, 캔버스 lock 걸고
                            useStore.getState().gameStart -> true이면, 캔버스 lokc 풀기 + 게임 시작
                        */}
                        <div className="GameForm_Content">
                            {/* JANG: Canvas 게임 */}
                            <GamePlay />
                        </div>

                    </div>

                </div>

                ) : useStore.getState().gameEnd === true ? (
                    <>
                    {/* 게임 끝났을 때 */}
                    </>
                ) : null}
                </>

            //     {this.state.mainStreamManager !== undefined ? (
            //         <div id="main-video" className="col-md-6">
            //             <UserVideoComponent streamManager={this.state.mainStreamManager} />
            //         </div>
            //     ) : null}
            //     <div id="video-container" className="col-md-6">
            //         {this.state.publisher !== undefined ? (
            //             <div className="stream-container col-md-6 col-xs-6" onClick={() => this.handleMainVideoStream(this.state.publisher)}>
            //                 <UserVideoComponent
            //                     streamManager={this.state.publisher} />
            //             </div>
            //         ) : null}
            //         {this.state.subscribers.map((sub, i) => (
            //             <div key={sub.id} className="stream-container col-md-6 col-xs-6" onClick={() => this.handleMainVideoStream(sub)}>
            //                 <span>{sub.id}</span>
            //                 <UserVideoComponent streamManager={sub} />
            //             </div>
            //         ))}
            //     </div>
            // </div>

        ) : null}

    </div>

    )
}

export default Webcam;
