import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// JANG: (08.01) Webcam 컴포넌트 대신 App 컴포넌트 변경
import Webcam from './Openvidu/Webcam';

ReactDOM.render(<Webcam />, document.getElementById('root'));
registerServiceWorker();
