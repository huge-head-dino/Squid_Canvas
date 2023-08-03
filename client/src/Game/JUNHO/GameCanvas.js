import React from 'react'
import { Canvas } from './Canvas'
import { ClearCanvasButton } from './painter_tool';
import { ColorPicker } from './painter_tool';
import { LineWidthButtons } from './painter_tool';

import './GameCanvas.css'

import {Col} from 'react-bootstrap'


function GameCanvas() {
  return (
    <>
      <Col>
      <div className='Canvas'>
        <Canvas />
      </div>
      <div className='ButtonZone'>
          <LineWidthButtons/>
          <ClearCanvasButton/>
          <ColorPicker/>
      </div>
      </Col>
    </>
  );
}

export default GameCanvas;
