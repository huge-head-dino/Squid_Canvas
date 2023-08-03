import React, { useContext } from "react";
import RealCanvas from './RealCanvas'
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
      <div className='Canvas'>
        <RealCanvas mySessionId = { mySessionId } myUserName = {myUserName}/>
      </div>
      {/* <div className='ButtonZone'>
          <LineWidthButtons/>
          <ClearCanvasButton/>
          <ColorPicker/>
      </div> */}
      </Col>
    </>
  );
}

export default GameCanvas;
