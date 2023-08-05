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
// YEONGWOO: 색상 선택, 아이콘 추가
import { GithubPicker } from 'react-color';
import ColorLensIcon from '@mui/icons-material/ColorLens';

const RealCanvas = ({mySessionId, myUserName}) => {
    const current = useRef({
        color: 'black',
        // lineWidth: 2,
        x: 0,
        y: 0,
    });
    const [color, setColor] = useState('#000000');
    // Add state for the pen's thickness
    const [thickness, setThickness] = useState(2);

    const canvasRef = useRef(null);
    const socketRef = useRef(null);
    const { iAmPainter } = useStore(
        state => ({
            iAmPainter: state.iAmPainter
        })
    );

     // Add functions to increase and decrease the pen's thickness
    const increaseThickness = () => {
        setThickness(thickness + 1);
        current.lineWidth = thickness + 1;
    }
    const decreaseThickness = () => {
        if (thickness > 1) {
            setThickness(thickness - 1);
            current.lineWidth = thickness - 1;
        }
    }
    

    
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

        //YEONGWOO: 색상 선택
        const colors = document.getElementsByClassName('color');
        const onColorUpdate = (e) => {
            console.log(e);
            let arr = e.target.style.MozBoxShadow.split(' ');
            current.color = arr[arr.length - 1];
        };
        // loop through the color elements and add the click event listeners
        for (let i = 0; i < colors.length; i++) {
            colors[i].addEventListener('click', onColorUpdate, false);
        }

        const clearCanvas = () => {
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        }
        const clearBtn = document.getElementsByClassName('clearBtn')[0];
        clearBtn.addEventListener('click', clearCanvas, false);

        let drawing = false;

        //create the drawing

        const draw = (x0,y0,x1,y1,color,lineWidth,emit) => {
            context.beginPath();
            context.moveTo(x0,y0);
            context.lineTo(x1,y1);
            context.strokeStyle = color;
            context.lineWidth = lineWidth;
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
                color,
                lineWidth
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
                current.color,
                current.lineWidth,
                true
            );
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
                current.color,
                current.lineWidth,
                true
            );
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
        if (iAmPainter) {
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
                data.color,
                data.lineWidth,
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

    }, [iAmPainter, socketRef]);

    //YEONGWOO: 색상 선택 FIXME: toggle 수정 필요
    let [toggle, setToggle] = useState(false);
    const handleToggle = () => {
        setToggle(!toggle);
    };

    const colors = [
        '#F44336',
        '#E91E63',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#2196F3',
        '#03A9F4',
        '#00BCD4',
        '#009688',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFEB3B',
        '#FFC107',
        '#FF9800',
        '#FF5722',
        '#795548',
        '#607D8B',
        '#000000',
    ];

    return (
        <div className="RealCanvas_1">
            <canvas ref={canvasRef} className="whiteboard"/>
            <Button variant="warning" className="clearBtn">Clear</Button>
            <Button variant="primary" onClick={increaseThickness}>Increase Thickness</Button>
            <Button variant="primary" onClick={decreaseThickness}>Decrease Thickness</Button>
            <ColorLensIcon
                onClick={handleToggle}
                className="palleteBtn"
                sx={{ fontSize: 40 }}
            />
            <GithubPicker
                width="auto"
                colors={colors}
                className="color"
                onChangeComplete={(colors)=> {
                    setColor(colors.hex);
                    current.color = colors.hex;
                }}
            />
        </div>
    );
}

export default RealCanvas;