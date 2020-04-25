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
  serverResponse = "";
  serverAlert = "";
  authenticated = null;
  listening = false;

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
        this.listening = true
        this.authenticated = null
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
                this.listening = false
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
        let blob = this.dataURLtoBlob(imgURL)

        // saveAs(blob, "blop-png.png")
        // saveAs(blob, "blop-jpeg.jpeg")
        componentContext.sendImageToServer(blob);
    }

    //REFERENCE:  https://stackoverflow.com/a/30407959/1154380
    dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new Blob([u8arr], {type:mime});
    }

    
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
        this.authenticated = null;
        this.backendService.uploadToServer(file, this.spokenText).subscribe(
            res => {
                this.serverResponse = res["response"]
                this.serverAlert = res["alert"]
                this.authenticated = (res["loggedin"] == 'true')
                console.log(res)
                console.log(res["alert"])
                console.log(this.authenticated)
                
                // if(this.authenticated)
                //     document.getElementById('correct').style.display = 'block' 
                //  else 
                //   document.getElementById('incorrect').style.display = 'block';
                
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
