import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';


import { HttpHandleService} from '../../services/http/http-handle.service'


var componentContext = null;
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  videoWidth = 0;
  videoHeight = 0;
    constraints = {
        video: {
            facingMode: "environment",
            width: { ideal: 4096 },
            height: { ideal: 2160 }
        }
    };

    constructor(private renderer: Renderer2, private backendService: HttpHandleService) {
        componentContext = this;
    }

    ngOnInit() {
        this.startCamera();
    }

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
        this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
        this.retrieveImage()
    }

    /*
    retrieveImage() {
        let image = document.getElementById('picture');

        html2canvas(image).then(function(canvas){
            console.log(canvas.toDataURL("image/png",0.9));
            canvas.toBlob(function (blob) {
               //saveAs(blob, "assets/screenshot.png");
               
            });
        });
    }
    */

    async retrieveImage() {
        let image = document.getElementById('picture');
        let canvas = await html2canvas(image);
        
        canvas.toBlob(function (blob) {
            componentContext.sendImageToServer(blob);
        });
    }


    sendImageToServer(file){

        console.log("Sending message to server");
        debugger;

        this.backendService.uploadToServer(file, "let me in").subscribe(
            res => {
                debugger;
                console.log(res["response"])
                alert(res["response"])
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
