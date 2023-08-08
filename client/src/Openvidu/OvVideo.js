import React, { Component } from 'react';
// JANG: 08.06 - css 추가
import './OvVideo.css';

export default class OpenViduVideoComponent extends Component {

    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
    }

    componentDidUpdate(props) {
        if (props && !!this.videoRef) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    componentDidMount() {
        if (this.props && !!this.videoRef) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    render() {
        return <video autoPlay={true} ref={this.videoRef} />;
    }

}



//따봉 버튼 추가

// import React, { Component } from 'react';
// import * as handpose from '@tensorflow-models/handpose';
// import '@tensorflow/tfjs-backend-webgl';


// export default class OpenViduVideoComponent extends Component {

//     constructor(props) {
//         super(props);
//         this.videoRef = React.createRef();
//         this.state = {
//             model: null,
//             showNumber: false,
//         };
//         this.lastDetectionTime = Date.now();
//         this.detectionInterval = 500; // 500ms (2 FPS) - adjust as needed
//         this.timerId = null; // timer identifier
//     }

//     componentDidUpdate(props) {
//         if (props && !!this.videoRef) {
//             this.props.streamManager.addVideoElement(this.videoRef.current);
//         }
//     }

//     async componentDidMount() {
//         if (this.props && !!this.videoRef) {
//             this.props.streamManager.addVideoElement(this.videoRef.current);
//             try {
//                 const model = await handpose.load();
//                 this.setState({ model });
//                 this.detectHands();
//             } catch (error) {
//                 console.log('Failed to load the model:', error);
//             }
//         }
//     }

//     async detectHands() {
//         const { model } = this.state;
//         const video = this.videoRef.current;
//         const currentTime = Date.now();
    
//         if (!model || !video || video.readyState < 2) {
//             console.error('Model or Video is not loaded yet.');
//             return;
//         }
    
//         // Limit detection frequency
//         if (currentTime - this.lastDetectionTime > this.detectionInterval) {
//             const predictions = await model.estimateHands(video);
//             if (predictions.length > 0) {
//                 const thumbsUp = this.isThumbsUpGesture(predictions[0].annotations);
//                 if (thumbsUp && !this.state.showNumber) {
//                     this.setState({ showNumber: true });
//                     if (this.timerId) {
//                         clearTimeout(this.timerId);
//                     }
//                     this.timerId = setTimeout(() => {
//                         this.setState({ showNumber: false });
//                         this.timerId = null;
//                     }
//                     , 2000);
//                 }
//             }
//             this.lastDetectionTime = currentTime;
//         }
    
//         requestAnimationFrame(() => this.detectHands());
//     }

    
    
//     isThumbsUpGesture(annotations) {
//         // 엄지 손가락이 확장되어 있는지 확인
//         const thumbExtended = annotations.thumb[0][1] > annotations.thumb[3][1];
        
//         // 다른 모든 손가락이 접혀 있는지 확인
//         const indexFolded = annotations.indexFinger[0][1] < annotations.indexFinger[3][1];
//         const middleFolded = annotations.middleFinger[0][1] < annotations.middleFinger[3][1];
//         const ringFolded = annotations.ringFinger[0][1] < annotations.ringFinger[3][1];
//         const pinkyFolded = annotations.pinky[0][1] < annotations.pinky[3][1];
    
//         return thumbExtended && indexFolded && middleFolded && ringFolded && pinkyFolded;
//     }

//     render() {
//         return (
//             <div style={{ position: 'relative' }}>
//                 <video autoPlay={true} ref={this.videoRef} style={{ width: '100%', height: '100%', }} />
//                 {this.state.showNumber && (
//                     <div style={{
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transform: 'translate(0%, -100%)',
//                         color: 'Red',
//                         fontSize: '10em',
//                         backgroundColor: 'transparent',
//                         zIndex:999,
//                     }}>
//                         👍
//                     </div>
//                 )}
//             </div>
//         );
//     }

// }

