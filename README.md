# SelfIn
The following project is a prototype of "Selfin" an AI based authorization module and our SOEN 357 final project submission. The following repository contains all code required to build and run "Selfin".

### Purpose 
The puropse of this prototype is to help measure the effectiveness of FVS(Face-Voice-Speech) credentials against traditional text based credentials.  
  
### System Overview

Selfin is composed of 2 independent applications: a frontend and backend. The frontend application is a simple Angular 9 webapp used to depict the integration of Selfin's functionality with any regular website. The backend application is web service built using python and is used to identify and validate user requests when signing in with "Selfin". The web service uses a third party service called "Google Vision API" to implement face recognition capabilities.

### Installation Instructions

#### Prereq: 
- Ensure port 5000 and 4200 is available
- Python 3.6+ 
- Angular CLI v8+

#### Settings up Backend Server

1. Install the Google Cloud SDK from the following link: https://cloud.google.com/storage/docs/gsutil_install?hl=ru#windows

Select "Download the Cloud SDK installer"

2. Setup the following environment variable

export GOOGLE_APPLICATION_CREDENTIALS="absolute-path-to-key-file/key/soen357-key.json" (file in the "key" directory)
export PROJECT_ID="soy-audio-259219"

3. Switch into the "Selfin-Backend" folder and run the python app by entering the following command "python app.py"

You should notice the python flask application running on port 5000. 

#### Running Frontend App

4. Once the backend is running switch into the "Selfin-Frontend/selfin-app" folder and run "ng serve" to run the frontend app.

5. Open your browser and visit http://localhost:4200

NOTE: Our recognition model has only been trained to recognize team members of the project, therefore outside will not be able to "login".


#### Authors
Ajith Thanam <br />
Renuchan Thambirajah <br />
Dimitri Spyropoulos <br />
Muneeb Nezameddin <br />

All snippets of code have been referenced. 

