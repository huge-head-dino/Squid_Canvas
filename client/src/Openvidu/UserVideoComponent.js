import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';

export default class UserVideoComponent extends Component {

    getNicknameTag() {
        // Gets the nickName of the user
        return JSON.parse(this.props.streamManager.stream.connection.data).clientData;
    }

    render() {
        return (
            <div>
                {/* JANG: 08.06 - 비디오 크기 조정을 위해 클래스명 추가 */}
                <div className="videoContainer" p="5px">
                    {this.props.streamManager !== undefined ? (
                        <div className="streamcomponent">
                            <OpenViduVideoComponent streamManager={this.props.streamManager} />
                            {/* JANG: 색상 변경 나중에!!!!!!*/}
                            { (parseInt(this.props.key) % 2 === 0) ? (
                            <div style={{height: "30px", color: "red"}}><h3>{this.getNicknameTag()}</h3></div>
                            ):(
                                <div style={{height: "30px", color: "blue"}}><h3>{this.getNicknameTag()}</h3></div>
                            )
                            }    

                            </div>
                    ) : null}
                </div>
            </div>
        );
    }
}
