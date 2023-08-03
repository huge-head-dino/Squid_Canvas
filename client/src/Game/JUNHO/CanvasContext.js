// FIXME: 폐기처분 예정
import React, { useContext, useRef, useState, useEffect } from "react";
import io from 'socket.io-client';
import socket from '../../Openvidu/socket'

//JANG: 캔버스 크기 조정 때문에 추가
import { useCallback } from "react";


const CanvasContext = React.createContext();

export const CanvasProvider = ({ children }) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const socketRef = useRef(null);  

  const [lineWidth, setLineWidth] = useState(5);  
  const [strokeColor, setStrokeColor] = useState('black');  


  //서버 연결부분

  useEffect(() => {

    // NOTE: 배포 시, 주소 확인!
    // socketRef.current = io.connect('https://mysquidcanvas.shop');
    socketRef.current = io.connect('http://localhost:5050');

    socketRef.current.on('startDrawing', data => {  // Listen for 'startDrawing' events
      const { offsetX, offsetY, lineWidth, strokeColor } = data;
      contextRef.current.strokeStyle = strokeColor;  // Update stroke color
      contextRef.current.lineWidth = lineWidth;  // Update line width
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
    });
  
    socketRef.current.on('drawing', data => {
      const { offsetX, offsetY } = data;
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    });
  
    socketRef.current.on('endDrawing', () => {
      contextRef.current.closePath();
      setIsDrawing(false);
    });

    socketRef.current.on('clearCanvas', () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d")
      context.fillStyle = "white"
      context.fillRect(0, 0, canvas.width, canvas.height)
    });
  }, []);

  // 캔버스 준비
  // const prepareCanvas = () => {
  //   const canvas = canvasRef.current
  //   canvas.width = window.innerWidth * 2;
  //   canvas.height = window.innerHeight * 2;
  //   canvas.style.width = `${window.innerWidth*0.7}px`;
  //   canvas.style.height = `${window.innerHeight*0.7}px`;
  //   canvas.style.boxShadow = "10px 10px 5px grey"; // 그림자 추가

  //   const context = canvas.getContext("2d")
  //   context.scale(1.42, 1.42);
  //   context.lineCap = "round";
  //   context.strokeStyle = strokeColor;  
  //   context.lineWidth = lineWidth;  
  //   contextRef.current = context;
  // };

  // 캔버스 준비 -> 이거 원본은 위에 
  const prepareCanvas = useCallback(() => {
    // 4) prepareCanvas 함수를 useCallback 훅을 사용해, 함수의 참조가 변경되지 않도록 해야 함
    const canvas = canvasRef.current;
    // 1) 캔버스에서 부모 요소의 크기를 직접 읽어와 캔버스의 크기를 설정함
    const parent = canvas.parentElement;

    // 2) 캔버스의 크기를 부모 요소에 맞춰서 자동으로 조정 -> 3)으로 이동
    const width = parent.offsetWidth * 0.95;
    const height = parent.offsetHeight * 0.95;

    canvas.width = width * 2;
    canvas.height = height * 2;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.boxShadow = "10px 10px 5px grey";

    const context = canvas.getContext("2d");
    context.scale(1, 1);

    context.lineCap = "round";
    context.strokeStyle = strokeColor;
    context.lineWidth = lineWidth;
    contextRef.current = context;
  }, []); 
  // JANG: (08.03 11:54) 캔버스 굵기 증가, 감소 수정

  // 3) 앞선 2)는 부모의 크기가 변경될 때마다 캔버스 크기가 업데이트 되어야 하므로
  //   부모의 크기가 변경될 때마다 캔버스의 크기를 업데이트하는 함수를 작성함
  useEffect(() => {
    prepareCanvas();
  }, [prepareCanvas]);

  // 마우스 다운시 실행되는 함수
  const startDrawing = ({ nativeEvent }) => {
    const { clientX, clientY } = nativeEvent;
    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    const offsetX = (clientX - canvasRect.left) * 2;  
    const offsetY = (clientY - canvasRect.top) * 2;  
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY, lineWidth, strokeColor);
    setIsDrawing(true);
  
    
    if (socketRef.current) {
      socketRef.current.emit('startDrawing', { offsetX, offsetY, lineWidth, strokeColor });  // Emit 'startDrawing' event
    }
    
  };


  //마우스 업시 실행되는 함수
  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    
    if (socketRef.current) {
    socketRef.current.emit('endDrawing');
    }
  };

  // 마우스 드래그시 실행되는 함수
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
        return;
    }
    const { clientX, clientY } = nativeEvent;
    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    const offsetX = (clientX - canvasRect.left) * 2;  
    const offsetY = (clientY - canvasRect.top) * 2;  
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  
    if (socketRef.current) {
      socketRef.current.emit('drawing', { offsetX, offsetY });
    }
    
  };


  
  // 캔버스 초기화 버튼 관련 함수
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.fillStyle = "white"
    context.fillRect(0, 0, canvas.width, canvas.height)
  
    
    if (socketRef.current) {
      socketRef.current.emit('clearCanvas');
    }
  }

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        contextRef,
        socketRef,  // socketRef를 값에 추가
        lineWidth, 
        strokeColor,  
        // drawCircle, //JUNHO: 일단 도형 그리는 코드는 복잡성 증가때문에 보류
        // drawSquare,
        // drawTriangle,
        setStrokeColor,  
        setLineWidth,  
        prepareCanvas,
        startDrawing,
        finishDrawing,
        clearCanvas,
        draw,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);