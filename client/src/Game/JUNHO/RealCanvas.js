import exp from "constants";
import { emit } from "process";
import React,{ useRef, useEffect, useState} from "react";
import io, { Socket } from 'socket.io-client';
import socket from '../../Openvidu/socket';
import { relative } from "path";

const RealCanvas = ({mySessionId, myUserName}) => {

    const canvasRef = useRef(null);
    const socketRef = useRef(null);
    

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
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
       

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
        canvas.addEventListener('mousedown', onMouseDown, false);
        canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
        canvas.addEventListener('mouseup', onMouseUp, false);

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
            console.log('$$$$$$$$$$$$$$$$$$$$$$$$',data);
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


    }, []);

    return (
        <div className="RealCanvas_1">

            <canvas ref={canvasRef} className="whiteboard"/>
            <button className="clearBtn">Clear</button>
            
            <div style={{ position: "absolute", marginBottom: 'auto', color: "gray", fontSize: "24px", zIndex: 100 }}>
        
                <h1 style={{ fontWeight: "bold" }}>사과</h1>
                {/* MRSEO: 조건 추가 */}

                <div>
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
                </div>
      
            </div>
        </div>
    );
}

export default RealCanvas;