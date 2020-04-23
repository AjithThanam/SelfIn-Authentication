import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from "lodash";

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

//Reference: https://hassantariqblog.wordpress.com/2016/12/04/angular2-web-speech-api-speech-recognition-in-angular2/

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  speechRecognition: any;
  langSpeaking = 'en-US';

  constructor(private zone: NgZone) { }

  //pass the language the speaker is talking in. 
  listen(langSpeaking): Observable<string> {

    return Observable.create(observer => {
      const { webkitSpeechRecognition }: any = window;
      this.speechRecognition = new webkitSpeechRecognition();
      //this.speechRecognition = SpeechRecognition;
      this.speechRecognition.continuous = true;
      //this.speechRecognition.interimResults = true;
      this.speechRecognition.lang = langSpeaking;
      this.speechRecognition.maxAlternatives = 1;

      this.speechRecognition.onresult = speech => {
        let term: string = "";
        if (speech.results) {
          var result = speech.results[speech.resultIndex];
          var transcript = result[0].transcript;
          if (result.isFinal) {
            if (result[0].confidence < 0.3) {
              console.log("Unrecognized result - Please try again");
            }
            else {
              term = _.trim(transcript);
              console.log("You said: -> " + term);
            }
          }

        }

        this.zone.run(() => {
          this.DestroySpeechObject();
          observer.next(term);
        });
      };

      this.speechRecognition.onerror = error => {
        observer.error(error);
      };

      this.speechRecognition.onend = () => {
        observer.complete();
      };

      this.speechRecognition.start();
      console.log("Say something - We are listening !!!");
    });
  }

  DestroySpeechObject() {
    if (this.speechRecognition)
      this.speechRecognition.stop();
  }
}

