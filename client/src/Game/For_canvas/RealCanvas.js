import React,{ useRef, useEffect, useState, useMemo } from "react";
import socket from '../../Openvidu/socket';
import {ButtonGroup, Button} from 'react-bootstrap';
// YEONGWOO: 지금 안쓰지만 혹시 몰라서 남겨둔 import 
// JANG: 아래 주석 해제하면 Chakra 사용 불가능!
// import exp from "constants";
// import { emit } from "process";
// import io, { Socket } from 'socket.io-client';
// import { relative } from "path";
import useStore from "../../store";

const RealCanvas = ({mySessionId, myUserName}) => {

    const canvasRef = useRef(null);
    const socketRef = useRef(null);
    const { gamers } = useStore(
        state => ({
            gamers: state.gamers
        })
    );

    //MRSEO: drawable 여부 확인
    const drawableValue = useMemo(() => {
        const currentGamer = gamers.find(gamer => gamer.name === myUserName);
        return currentGamer ? currentGamer.drawable : false;
      }, [gamers, myUserName]);
    

    
    useEffect(() => {
        const canvas = canvasRef.current;
        //JUNHO: canvas 크기 조정
        const parent = canvas.parentElement;
        const width = parent.offsetWidth * 0.95;
        const height = parent.offsetHeight * 0.95;

        canvas.width = width * 2;
        canvas.height = height * 2;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.style.boxShadow = "10px 10px 5px grey";

        //JUNHO: canvas 크기 조정 끝

        const context = canvas.getContext("2d");       

        const current = {
            color: 'black',
            x: 0,
            y: 0,
        };

        const clearCanvas = () => {
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        }
        const clearBtn = document.getElementsByClassName('clearBtn')[0];
        clearBtn.addEventListener('click', clearCanvas, false);

        let drawing = false;

        //create the drawing

        const draw = (x0,y0,x1,y1,emit) => {
            context.beginPath();
            context.moveTo(x0,y0);
            context.lineTo(x1,y1);
            context.strokeStyle = 'black';
            context.lineWidth = 2;
            context.stroke();
            context.closePath();

            if(!emit) {return;}

            const w = canvas.width ;
            const h = canvas.height ;

            if(!socketRef.current) return;
            socketRef.current.emit('drawing', {
                //FIXME: (1) props 확인 필요
                mySessionId: mySessionId,
                x0: x0 / w,
                y0: y0 / h,
                x1: x1 / w,
                y1: y1 / h,
            });
        };

        //mouse movement

        const onMouseDown = (e) => {
            drawing = true;
            const rect = canvas.getBoundingClientRect(); // get the bounding rectangle
            current.x = e.clientX - rect.left
            current.y = e.clientY - rect.top
        };

        const onMouseMove = (e) => {
            if(!drawing){return;}
            const rect = canvas.getBoundingClientRect(); // get the bounding rectangle
            draw(
                current.x,
                current.y,
                e.clientX - rect.left, 
                e.clientY - rect.top,
                true);
            current.x = e.clientX - rect.left;
            current.y = e.clientY - rect.top;    
        };

        const onMouseUp = (e) => {
            if(!drawing){return;}
            drawing = false;
            const rect = canvas.getBoundingClientRect(); // get the bounding rectangle
            draw(
                current.x,
                current.y,
                e.clientX - rect.left,
                e.clientY - rect.top,
                true);
        };

        // FIXME: (2) 쓰로틀
        const throttle = (callback, delay) => {
            let previousCall = new Date().getTime();
            return function() {
                const time = new Date().getTime();

                if((time - previousCall) >= delay) {
                    previousCall = time;
                    callback.apply(null, arguments);
                }
            };
        };

        // add event listeners
        // MRSEO: drawable 여부에 따라 이벤트 리스너 추가
        if (drawableValue) {
            canvas.addEventListener('mousedown', onMouseDown, false);
            canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
            canvas.addEventListener('mouseup', onMouseUp, false);
        } else {
            canvas.removeEventListener('mousedown', onMouseDown, false);
            canvas.removeEventListener('mousemove', throttle(onMouseMove, 10), false);
            canvas.removeEventListener('mouseup', onMouseUp, false);
        }

        // FIXME: (3) make the canvas fill its parent component

        const onResize = () => {
        const parent = canvas.parentElement;
        const width = parent.offsetWidth * 0.95;
        const height = parent.offsetHeight * 0.95;

        canvas.width = width * 2;
        canvas.height = height * 2;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.scale(2, 2);
        }

        window.addEventListener('resize', onResize, false);
        onResize();

        // socket.io connection
        const onDrawingEvent = (data) => {
            const w = canvas.width;
            const h = canvas.height;
            draw(
                data.x0 * w, 
                data.y0 * h, 
                data.x1 * w, 
                data.y1 * h,
                false
                );
        };

        socketRef.current = socket;
        socketRef.current.emit('joinRoom', { mySessionId, myUserName });  // Emit 'joinRoom' event
        socketRef.current.on('drawing', onDrawingEvent);

         // Cleanup when the component is unmounted or drawable changes.
         // MRSEO: 
         return () => {
            socketRef.current.off('drawing', onDrawingEvent);
            canvas.removeEventListener('mousedown', onMouseDown, false);
            canvas.removeEventListener('mousemove', throttle(onMouseMove, 10), false);
            canvas.removeEventListener('mouseup', onMouseUp, false);
          };

    }, [drawableValue]);

    return (
        <div className="RealCanvas_1">

            <canvas ref={canvasRef} className="whiteboard"/>
            <Button variant="warning" className="clearBtn">Clear</Button>
            
        </div>
    );
}

export default RealCanvas;