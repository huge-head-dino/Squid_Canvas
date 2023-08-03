import React, { useEffect, useState } from "react";
import { useCanvas } from "./CanvasContext";
// MRSEO:
import Countdown from "../Countdown";
import socket from '../../Openvidu/socket';
import useStore from "../../store";


export function Canvas() {
  const {
    canvasRef,
    prepareCanvas,
    startDrawing,
    finishDrawing,
    draw,
    socketRef,  // NOTE: socket.io code
    lineWidth,  
    setLineWidth,  
    strokeColor,  
    setStrokeColor,  
    // drawCircle,    //JUNHO: 일단 도형 그리는 코드는 복잡성 증가때문에 보류
    // drawSquare,
    // drawTriangle,
  } = useCanvas();

  const {
    gamers,
    redScoreCnt,
    blueScoreCnt,
  } = useStore()

  // MRSEO: 카운트 조건 초기화
  const [round1Countdown, setRound1Countdown] = useState(false);
  const [round2Countdown, setRound2Countdown] = useState(false);

  // 선굵기와 선색상을 캔버스에 적용하는 코드
  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeColor;
  }, [lineWidth, strokeColor]);

  // 소켓으로 데이터를 받아서 캔버스에 그리는 코드
  useEffect(() => {
    prepareCanvas();

    if (socketRef.current) {
      socketRef.current.on('drawing', (data) => {
          console.log(data);
      });
    }

    socket.on('round1Countdown', () => {
      console.log('round1Countdown_client@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      setRound1Countdown(true);
      setTimeout(() => {
        socket.emit('startTimer1');
      }, 5000)
    });
  
    socket.on('round2Countdown', () => {
      setRound1Countdown(false);
      console.log('round2Countdown_client@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      setRound2Countdown(true);
      setTimeout(() => {
        socket.emit('startTimer2');
      }, 5000)
    });

    socket.on('gameEnd', () => {
      setRound2Countdown(false);
      console.log('gameEnd_client@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      // TODO: 게임 종료 후 결과 페이지로 이동
      if (redScoreCnt > blueScoreCnt) {
        alert('레드팀 승리');
      } else if (redScoreCnt < blueScoreCnt) {
        alert('블루팀 승리');
      } else{
        alert('무승부');
      }
    });
  }, [socketRef]);  // NOTE: socketRef를 dependency로 추가

  // MRSEO: game loop 추가


  return (
    <div className="BigCanvas" style={{ height: "100%"}}>
    <canvas
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      ref={canvasRef}
    />
    <div style={{ position: "absolute", marginBottom: 'auto', color: "gray", fontSize: "24px", zIndex: 100 }}>
      <h1 style={{ fontWeight: "bold" }}>사과</h1>
      {/* MRSEO: 조건 추가 */}
      {round1Countdown === true ? (
        < Countdown />
      ): null}
      {round2Countdown === true ? (
        < Countdown />
      ): null}
    </div>

    </div>
  );
}