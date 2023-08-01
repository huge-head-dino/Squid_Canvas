import React, { useEffect } from "react";
import UserVideoComponent from "../Openvidu/UserVideoComponent";
import useStore from "../store";
import "./GamePlay.css";

// import GamePlayContext from "../Context/GamePlayContext";

// 게임 컴포넌트
import WhiteCanvas from "./WhiteCanvas";
import UserList from "./UserList";

// 게임 훅
import useGamePlay from "../Hook/GamePlayHook";

function GamePlay() {

  const [
    gameState,
    gameStateDispatch,
    initialQuestionWordState,
  ] = useGamePlay();
  
    return (
      // <GamePlayContext.Provider value={{ gameState, gameStateDispatch }}>
        <>
          <div className="GameCanvas_Left">
            <UserList />
          </div>
          <div className="GameCanvas_Right">
            <WhiteCanvas />
          </div>
        </>
      // </GamePlayContext.Provider>
    );  
  }
  export default GamePlay;