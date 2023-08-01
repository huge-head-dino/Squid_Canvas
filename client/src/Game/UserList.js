import React, { useEffect } from "react";
import UserVideoComponent from "../Openvidu/UserVideoComponent";
import useStore from "../store";
import "./UserList.css";


function UserList() {
    const {
      gamers,

      playerCount,
      setPlayerCount,

      myUserID,

      myIndex,
      setMyIndex,

      curSession,
      
      sortGamer,
    } = useStore();
  
    useEffect(() => {
      if (curSession !== undefined) {
        setPlayerCount(gamers.length);
      }
      sortGamer();
      
    }, [gamers]);
  
    useEffect(() => {
      if (curSession !== undefined) {
        for (var i = 0; i < playerCount; i++) {
          if (gamers[i]) {
            if (myUserID === { gamers }.gamers[i].name) {
              setMyIndex(i);
            }
          }
        }
      }
    }, [playerCount]);
  
    return (

      // JANG: gamers 인덱스 수정!
      
        <div className="GameCanvas_Left">
          <div className="VideoBox">
            <div id={0} className="VideoFrame_Out">
              {gamers[0] && (
                <div className="VideoFrame_In">
                  <UserVideoComponent
                    streamManager={{ gamers }.gamers[0].streamManager}
                    my_name={{ gamers }.gamers[0].name}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="VideoBox">
            <div id={1} className="VideoFrame_Out">
              {gamers[1] && (
                <div className="VideoFrame_In">
                  <UserVideoComponent
                    streamManager={{ gamers }.gamers[1].streamManager}
                    my_name={{ gamers }.gamers[1].name}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="VideoBox">
            <div id={2} className="VideoFrame_Out">
              {gamers[2] && (
                <div className="VideoFrame_In">
                  <UserVideoComponent
                    streamManager={{ gamers }.gamers[2].streamManager}
                    my_name={{ gamers }.gamers[2].name}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="VideoBox">
            <div id={3} className="VideoFrame_Out">
              {gamers[3] && (
                <div className="VideoFrame_In">
                  <UserVideoComponent
                    streamManager={{ gamers }.gamers[3].streamManager}
                    my_name={{ gamers }.gamers[3].name}
                  />
                </div>
              )}
            </div>
          </div>

        </div>

    );
  }
  export default UserList;