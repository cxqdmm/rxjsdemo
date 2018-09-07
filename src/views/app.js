import {
    loadFaceRecognitionModel,
    computeFaceDescriptor,
    euclideanDistance,
    drawDetection,
    allFaces,
    loadFaceDetectionModel,
    loadFaceLandmarkModel,
    loadMtcnnModel,
    allFacesTinyYolov2,
    allFacesMtcnn,
    drawLandmarks,
    loadModels
} from 'face-api.js/dist/face-api'
import $ from 'jquery'
import React from 'react'
import axios from 'axios'
import '../less/app.less'
import { Upload, Icon, Message, Button } from 'antd';
// loadModels('../models')
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    // const isJPG = file.type === 'image/jpeg';
    // if (!isJPG) {
    //   message.error('You can only upload JPG file!');
    // }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isLt2M;
}

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            img1: {
                src: '',
                descriptor: null
            },
            img2: {
                src: '',
                descriptor: null
            },
            loading: false,
        };
    }
    async faceRecognize() {
        if (this.state.img1.descriptor && this.state.img2.descriptor) {

            const distance = euclideanDistance(this.state.img1.descriptor, this.state.img2.descriptor)
            Message.success(distance)
        }
    }
    async faceDetect(id) {
        await loadMtcnnModel('../models')
        await loadFaceRecognitionModel('../models')

        const forwardParams = {
            // number of scaled versions of the input image passed through the CNN
            // of the first stage, lower numbers will result in lower inference time,
            // but will also be less accurate
            maxNumScales: 10,
            // scale factor used to calculate the scale steps of the image
            // pyramid used in stage 1
            scaleFactor: 0.709,
            // the score threshold values used to filter the bounding
            // boxes of stage 1, 2 and 3
            scoreThresholds: [0.6, 0.7, 0.7],
            // mininum face size to expect, the higher the faster processing will be,
            // but smaller faces won't be detected
            minFaceSize: 40
          }
          const inputImgEl = $(`#${id}`).get(0)
          const { width, height } = inputImgEl
          const canvas = $(`#${id}canvas`).get(0)
          canvas.width = width
          canvas.height = height
          let cxt=canvas.getContext("2d")
          cxt.clearRect(0,0,width,height);
            const results  = (await allFacesMtcnn(id, forwardParams)).map(fd => fd.forSize(width, height))
            const minConfidence = 0.9
            if (results.length) {
                Message.success('找到人脸')
                results.forEach(({detection, landmarks, descriptor }) => {
              
                  // ignore results with low confidence score
                //   if (detection.score < minConfidence) {
                //     return
                //   }
                    this.state[id].descriptor = descriptor;
                  drawDetection(canvas, [detection], { withScore: true })
                  drawLandmarks(canvas, landmarks, { lineWidth: 4, color: 'red' })
                })
              } else {
                Message.error('没搜到人脸')
              }
    }
    handleChange(info, id) {
        //   if (info.file.status === 'uploading') {
        //     this.setState({ loading: true });
        //     return;
        //   }
        //   if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
            this.state[id].src = imageUrl;
            this.setState({
                loading: false,
            })
        });
        //   }
    }

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        return (
            <div style={{padding: '40px'}}>
                <div style={{ display: 'flex' }}>
                    <div>
                        <Button type="primary"  size="small" onClick={() => { this.faceDetect('img1'); }}>人脸检测</Button>
                        <Upload
                            name="avatar1"
                            listType="picture-card"
                            className="avatar-uploader margin-left-200"
                            showUploadList={false}
                            action="/yyu"
                            beforeUpload={beforeUpload}
                            onChange={(info) => { this.handleChange(info, 'img1') }}
                        >
                            {this.state.img1 ? <div className="image-box">
                            {this.state.img1.src ? <img id="img1" src={this.state.img1.src} style={{ width: '500px' }} alt="avatar" /> :null}
                                
                                <canvas className="overlay" id="img1canvas"></canvas>
                                </div> : uploadButton}
                        </Upload>
                    </div>
                    <div>
                        <Button type="primary" size="small" onClick={() => { this.faceDetect('img2'); }}>人脸检测</Button>

                        <Upload
                            name="avatar2"
                            listType="picture-card"
                            className="avatar-uploader margin-left-200"
                            showUploadList={false}
                            action="/yyu"
                            beforeUpload={beforeUpload}
                            onChange={(info) => { this.handleChange(info, 'img2') }}
                        >
                            {this.state.img2 ? <div className="image-box">
                            {this.state.img2.src ? <img id="img2" src={this.state.img2.src} style={{ width: '500px' }} alt="avatar" /> :null}
                                <canvas className="overlay" id="img2canvas"></canvas>
                                
                                </div> : uploadButton}

                        </Upload>
                    </div>
                    <Button type="primary" size="small" onClick={() => { this.faceRecognize(); }}>对比</Button>

                </div>
                <div>
                    
                </div>
            </div>

        );
    }
}



export default App;