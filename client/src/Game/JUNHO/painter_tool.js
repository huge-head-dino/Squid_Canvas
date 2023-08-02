import React from 'react';
import { useCanvas } from './CanvasContext';
import './painter_tool.css';

import {ButtonGroup, Button} from 'react-bootstrap';

export const LineWidthButtons = () => {
  const { lineWidth, setLineWidth } = useCanvas();

  return (
    <ButtonGroup aria-label="Basic example" className='LineWidthButtons'>
      <Button variant="secondary" onClick={() => setLineWidth(lineWidth + 3)}>펜 굵기 증가</Button>
      <Button variant="dark" onClick={() => setLineWidth(lineWidth - 3)}>펜 굵기 감소</Button>
    </ButtonGroup>
  );
};

export const ColorPicker = () => {
  const { strokeColor, setStrokeColor } = useCanvas();

  return (
    <input type="color" value={strokeColor} onChange={e => setStrokeColor(e.target.value)} />
  );
};

export const ClearCanvasButton = () => {
  const { clearCanvas } = useCanvas()

  return <Button variant="warning" onClick={clearCanvas}>캔버스 초기화</Button>
}