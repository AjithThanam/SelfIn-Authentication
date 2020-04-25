# The following links were used to help built this app
# https://cloud.google.com/vision/automl/docs/predict#automl_vision_classification_predict-python
# https://thenewstack.io/get-started-with-google-cloud-automl-vision-for-image-classification/

from google.cloud import automl
from flask import Flask, jsonify, request
from flask_cors import CORS
import sys, os
import time


app = Flask(__name__)
CORS(app)

sent_file_name = 'face.jpg'
user_dir = 'images'
user_face_data = '\\images\\face.jpg'


#fake DB
db = {
    "Renuchan" : "let me in", 
    "Ajith": "open sesame"
}


def getResponse(name, score):
    response = {
        'prediction' : name,
        'confidence' : score,
        "loggedin" : "true"
    }
    return response


# --------------------- Work for google
project_id = 'soy-audio-259219'
model_id = 'ICN1415322153598844928'

pathname = os.path.dirname(sys.argv[0])      
file_path = os.path.abspath(pathname) + user_face_data
#file_path = 'C:\\Users\\Home\\Desktop\\winter2020\\soen357\\selfin-python\\SelfIn-Authentication\\SelfIn-Backend\\images\\face.jpg'

def get_Google_Prediction():
    prediction_client = automl.PredictionServiceClient()

    # Get the full path of the model.
    model_full_id = prediction_client.model_path(
        project_id, "us-central1", model_id
    )

    # Read the file.
    with open(file_path, "rb") as content_file:
        content = content_file.read()

    image = automl.types.Image(image_bytes=content)
    payload = automl.types.ExamplePayload(image=image)

    # params is additional domain-specific parameters.
    # score_threshold is used to filter the result
    # https://cloud.google.com/automl/docs/reference/rpc/google.cloud.automl.v1#predictrequest
    params = {"score_threshold": "0.1"}

    response = prediction_client.predict(model_full_id, payload, params)

    # no analyze the results
    google_result = response.payload
    
    #google_response = getResponse(google_result.display_name, google_result.classification.score)
    
    return google_result
    

# -------------------------------- Close method -------------------------------------------



def checkUser(google_result, passage):

    if google_result is None:
        return {"response" : "No User detected", "loggedin" : "false"}

    person_detect = google_result[0].display_name
    person_detect_confidence = google_result[0].classification.score

    print("INFO")
    print(person_detect)
    print(person_detect_confidence)

    if person_detect == 'Person':
        return {"response" : "User is not recognized", "loggedin" : "false", "alert":"Erorr!"}

    if person_detect_confidence > 0.5:
        passageExpected = db[person_detect]

        if checkPassages(passageExpected, passage):
            return {"response" : "User recognized, Welcome " + person_detect, "loggedin" : "true", "person":person_detect}
        else:
            return {"response" : "This is not your passage", "loggedin" : "false", "alert":"Incorrect!"}
    else:
        return {"response" : "User is not recognized", "loggedin" : "false", "alert":"Erorr!"}


def checkPassages(expected, obtained):
    return expected == obtained


def checkUser2(google_result, passage):

    person_detect = google_result
    person_detect_confidence = 0.6

    print("INFO")
    print(person_detect)
    print(person_detect_confidence)

    if person_detect == 'Person':
        return {"response" : "User is not recognized", "loggedin" : "false", "alert":"Erorr!"}

    if person_detect_confidence > 0.5:
        passageExpected = db[person_detect]

        if checkPassages(passageExpected, passage):
            return {"response" : "User recognized, Welcome " + person_detect, "loggedin" : "true", "person":person_detect}
        else:
            return {"response" : "This is not your passage", "loggedin" : "false", "alert":"Incorrect!"}
    else:
        return {"response" : "User is not recognized", "loggedin" : "false", "alert":"Erorr!"}




#----- Define flask endpoints
@app.route("/signin", methods=["GET", "POST"])
def signIn():
    response = None
    if request.method == "POST":
        if request.files:
            #"image" is the name given to the input field in the html
            image = request.files["image"]
            passage = request.form.get('passage')

            # save on file system
            image.save(os.path.join(user_dir, sent_file_name))

            # Pause to ensure async task are done
            time.sleep(1)

            # get google analysis for image
            google_result = get_Google_Prediction()

            response = checkUser(google_result, passage)
            #response = checkUser2('Ajith', passage)
			
        else:
            response = {"response" : "No image was sent", "loggedin" : "false"}
            
    else:
        response = {"response" : "Only POST is supported", "loggedin" : "false"}

    return jsonify(response)

# ------------------ Endpoints DONE



# --- Driver Code ----------
if __name__ == '__main__':
    app.run(debug=True)