import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// JANG: App 컴포넌트 변경
import Webcam from './Openvidu/Webcam';

ReactDOM.render(
    <Webcam />,
    document.getElementById('root'));
registerServiceWorker();
