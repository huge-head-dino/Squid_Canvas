import exp from "constants";
import { emit } from "process";
import React,{ useRef, useEffect, useState} from "react";
import io, { Socket } from 'socket.io-client';
import socket from '../../Openvidu/socket';

const RealCanvas = ({mySessionId, myUserName}) => {

    const canvasRef = useRef(null);
    const socketRef = useRef(null);
    

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.scale(100, 100);

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

            const w = canvas.width;
            const h = canvas.height;

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
            current.x = e.pageX
            current.y = e.pageY 
        };

        const onMouseMove = (e) => {
            if(!drawing){return;}
            draw(
                current.x,
                current.y,
                e.pageX, 
                e.pageY,
                true);
            current.x = e.pageX;
            current.y = e.pageY;    
        };

        const onMouseUp = (e) => {
            if(!drawing){return;}
            drawing = false;
            draw(
                current.x,
                current.y,
                e.pageX,
                e.pageY,
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
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
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
        <div>
            <canvas ref={canvasRef} className="whiteboard" />
            <button className="clearBtn">Clear</button>
        </div>
    );
}

export default RealCanvas;