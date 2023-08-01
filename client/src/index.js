import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// JANG: (08.01) App 컴포넌트 변경
import Webcam from './Openvidu/Webcam';

// JANG: (09.01) canvas 컴폰넌트 추가
import GameCanvas from './Game/JUNHO/GameCanvas';
import { CanvasProvider } from "./Game/JUNHO/CanvasContext";

ReactDOM.render(
    <CanvasProvider>
      <GameCanvas />
    </CanvasProvider>,
    document.getElementById('root'));
registerServiceWorker();
