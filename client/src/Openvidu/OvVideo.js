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


// 손동작 인식버전
// import React, { Component } from 'react';
// import * as handpose from '@tensorflow-models/handpose';
// import * as tf from '@tensorflow/tfjs';


// export default class OpenViduVideoComponent extends Component {

//     constructor(props) {
//         super(props);
//         this.videoRef = React.createRef();
//         this.state = {
//             model: null,
//             showNumber: false,
//         };
//     }

//     componentDidUpdate(props) {
//         if (props && !!this.videoRef) {
//             this.props.streamManager.addVideoElement(this.videoRef.current);
//         }
//     }

//     async componentDidMount() {
//         if (this.props && !!this.videoRef) {
//             this.props.streamManager.addVideoElement(this.videoRef.current);

//         try {
//             // Handpose 모델 로드
//             const model = await handpose.load();
//             this.setState({ model });

//             // 손 감지 시작
//             this.detectHands();
//         } catch(error) {
//             console.log('@@@@@@Failed to load the model:@@@@@@', error);
//             }
//         }
//     }

//     handleVideoLoad = async () => {
//         try {
//             // Handpose 모델 로드
//             const model = await handpose.load();
//             this.setState({ model });

//             // 손 감지 시작
//             this.detectHands();
//         } catch(error) {
//             console.log('Failed to load the model:', error);
//         }
//     }
    

//     async detectHands() {
//         const { model } = this.state;
//         const video = this.videoRef.current;

//         // 모델이 유효한지 확인
//         if (!model || !video ||video.readyState < 2) {
//             console.error('Model or Video is not loaded yet.');
//             return;
//         }   

//         // 손 감지
//         const predictions = await model.estimateHands(video);
//         if (predictions.length > 0) {
//             // 검지 펼침 확인 (이 부분은 모델에 따라 조정이 필요할 수 있습니다)
//             const isIndexFingerExtended = this.checkIndexFinger(predictions[0].annotations);
//             this.setState({ showNumber: isIndexFingerExtended });
//         }

//         // 다음 프레임을 위한 재귀 호출
//         requestAnimationFrame(() => this.detectHands());
//     }

//     checkIndexFinger(annotations) {
//         // 검지 펼침 여부 확인 로직 (이 부분은 모델의 출력에 따라 조정이 필요합니다)
//         // 예시: annotations.indexFinger[3]가 끝점일 경우
//         const isIndexFingerExtended = annotations.indexFinger[0][1] > annotations.indexFinger[3][1];
//         return isIndexFingerExtended;// 로직에 따라 true 또는 false 반환
//     }

//     render() {
//         return (
//         <div style={{ position: 'relative' }}>
//             <video autoPlay={true} ref={this.videoRef} onLoadedMetadata={this.handleVideoLoad} style={{ width: '100%', height: '100%' }} />
//             {this.state.showNumber && (
//                 <div style={{
//                     position: 'absolute',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(330%, 0%)',
//                     color: 'Red',
//                     fontSize: '2em'
//                 }}>
//                     👍
//                 </div>
//             )}
//         </div>
//         );
//     }

// }
