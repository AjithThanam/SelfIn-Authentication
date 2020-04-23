import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CameraComponent } from './camera/camera.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpHandleService} from '../services/http/http-handle.service'

@NgModule({
  declarations: [
    AppComponent,
    CameraComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [HttpHandleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
