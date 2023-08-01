import React, { useEffect } from "react";
import UserVideoComponent from "../Openvidu/UserVideoComponent";
import useStore from "../store";
import "./UserList.css";

// JANG: gamers가 늘어나도, 카메라가 그만큼 늘어나지 않는 문제 원인
// React의 Virtual DOM 업데이트 최적화 전략 때문에, 부모 컴포넌트가 렌더링 되더라도, 자식 컴포넌트의 props가 변경되지 않으면, 자식 컴포넌트는 렌더링 되지 않는다.
// 이를 해결하기 위해 1) 해당 컴포넌트의 고유한 key 할당 or 2) 새로운 props 전달 (ex. forceUpdate={Date.now()} )

function UserList() {
    const {
      gamers,
      playerCount,
      setPlayerCount,
      myUserID,
      setMyIndex,
      curSession,
    } = useStore();
  
    useEffect(() => {
      if (curSession !== undefined) {
        setPlayerCount(gamers.length);
      }
      // 재 렌더링 되는 건 맞지만, 자식 요소가 재 렌더링 되지는 않음
      
    }, [gamers]);
  
    return (
      
        <div className="GameCanvas_Left">
          <div className="VideoBox">
            <div id={0} className="VideoFrame_Out">
              {gamers[0] && (
                <div className="VideoFrame_In">
                  <UserVideoComponent
                    streamManager={gamers[0].streamManager}
                    my_name={gamers[0].name}
                    key={gamers[0].name}
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
                    streamManager={gamers[1].streamManager}
                    my_name={gamers[1].name}
                    key={gamers[1].name}
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
                    streamManager={gamers[2].streamManager}
                    my_name={gamers[2].name}
                    key={gamers[2].name}
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
                    streamManager={gamers[3].streamManager}
                    my_name={gamers[3].name}
                    key={gamers[3].name}
                  />
                </div>
              )}
            </div>
          </div>

        </div>

    );
  }
  export default UserList;