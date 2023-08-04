import React, { useContext } from "react";
import RealCanvas from './RealCanvas'
//JUNHO: 참고 import만 남김, 나중에 삭제 예정

import { ClearCanvasButton } from './painter_tool';
import { ColorPicker } from './painter_tool';
import { LineWidthButtons } from './painter_tool';

// YEONGWOO: context 추가
import SessionContext from '../../Openvidu/SessionContext'

import './GameCanvas.css'

import {Col} from 'react-bootstrap'


function GameCanvas() {
  const { mySessionId, myUserName } = useContext(SessionContext);
  console.log("##########################sessionId : ", mySessionId, myUserName);

  return (
    <>
      <Col>
      <div className="RealCanvas_3">
        <div className='RealCanvas_2' style={{ height: "100%"}}>
          <RealCanvas mySessionId = { mySessionId } myUserName = {myUserName}/>
        </div>
        <div className='ButtonZone'>
          <div style={{ position: "absolute", marginBottom: 'auto', color: "gray", fontSize: "24px", zIndex: 100 }}>
          <h1 style={{ fontWeight: "bold" }}>사과</h1>
          {/* MRSEO: 조건 추가 */}

          {/* <div>
              {round1Countdown === true ? (
                  <>
                  <h1 style={{ fontWeight: "bold" }}>레드팀 준비해주세요~!</h1>
                  < Countdown />
                  </>
              ): null}
              {round2Countdown === true ? (
                  <>
                  <h1 style={{ fontWeight: "bold" }}>블루팀 준비해주세요~!</h1>
                  < Countdown />
                  </>
              ): null}
               </div> */}

          </div>
        </div>
      </div>
      </Col>
    </>
  );
}

export default GameCanvas;
