import { Component, OnInit, ElementRef, Renderer2, ViewChild, NgZone } from '@angular/core';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { HttpHandleService } from '../../services/http/http-handle.service'
import { SpeechService } from '../../services/speech/speech.service'
import * as _ from "lodash";



var componentContext = null;
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  spokenText = "";
  authenticated = true

  videoWidth = 0;
  videoHeight = 0;
    constraints = {
        video: {
            facingMode: "environment",
            width: { ideal: 500 },
            height: { ideal: 720 }
        }
    };

    //REFERENCE: https://www.dev6.com/angular/capturing-camera-images-with-angular/

    constructor(private zone: NgZone, private renderer: Renderer2, private backendService: HttpHandleService, private service: SpeechService) {
        componentContext = this;
    }

    ngOnInit() {
        this.startCamera();
    }

    listen(){
        this.activateSpeech();
      }
    
    activateSpeech(): void {
        this.service.listen('en-US')
            .subscribe(
            //listener
            (value) => {
                this.spokenText = value;
                this.capture();
                let textBox = document.getElementById('textBox')
                console.log(value);
                //textBox.textContent ="You said: " + value +""
            },
            //errror
            (err) => {
                console.log(err);
                if (err.error == "no-speech") {
                    console.log("--restatring service--");
                    this.activateSpeech();
                }
            },
            //completion
            () => {
                console.log("--complete--");
            });
    }

    /*
    *Below thias point are all methods related to taking the screenshot
    */
    startCamera() {
        if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
        } else {
            alert('Sorry, camera not available.');
        }
    }

    attachVideo(stream) {
        this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
        this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
            this.videoHeight = this.videoElement.nativeElement.videoHeight;
            this.videoWidth = this.videoElement.nativeElement.videoWidth;
        });
    }

    capture() {
        this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
        this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
        console.log(this.videoWidth)
        console.log(this.videoHeight)
        this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0)
        this.retrieveImage()
        
    }

    
    retrieveImage(){
        let image = document.getElementById('picture') as HTMLCanvasElement
        let imgURL = image.toDataURL()
        let a = document.createElement("a")

        a.href = imgURL
        a.download = 'canvas-download.png'
        a.click()
    }


    // retrieveImage2() {
    //     let image = document.getElementById('picture') as HTMLCanvasElement
    //     html2canvas(image).then(function(canvas){

    //         canvas.toBlob(function (blob) {
    //            saveAs(blob, "assets/screenshot.jpeg");
    //         });
    //     });
    // }
    

    // async retrieveImage() {
    //     let image = document.getElementById('picture');
    //     let canvas = await html2canvas(image);
        
    //     canvas.toBlob(function (blob) {
    //         componentContext.sendImageToServer(blob);
    //         saveAs(blob, "assets/screenshot.png");
    //     });
    // }


    sendImageToServer(file){

        console.log("Sending message to server");
        console.log("(Request) " + this.spokenText);
        this.backendService.uploadToServer(file, this.spokenText).subscribe(
            res => {
                console.log(res["response"])
                console.log(res)
                this.authenticated = res["loggedin"]
                console.log(this.authenticated)
                //alert(res["response"])
            }
        );
        
/*
        this.backendService.testEndpoint().subscribe(data => {
            alert(data);
        });
        */
    }


    handleError(error) {
        console.log('Error: ', error);
    }
}
