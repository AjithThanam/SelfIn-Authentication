import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class HttpHandleService {

  private serverURL = "https://be1c234c.ngrok.io/signin";
  private postField_face = "image";
  private postField_passage = "passage";

  constructor(private http: HttpClient) { }
  
  uploadToServer(file: File, secretPassage: string){

    const info = new FormData();
    info.append(this.postField_face, file);
    info.append(this.postField_passage, secretPassage);

    return this.http.post(this.serverURL, info);
  }

  //this is renuchans childhood
  testEndpoint(){
    return this.http.get("https://www.dragonfable.com");
  }


  usingFetchAPI(file: File, secretPassage: string){
    const info = new FormData();
    info.append("image", file);
    info.append("passage", secretPassage);

    fetch('http://127.0.0.1:5000/signin', {
      method: 'POST',
      body: info
      }).then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data);
      });
  }




}
