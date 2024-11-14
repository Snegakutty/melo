from flask import Flask, request, jsonify
import numpy as np
import cv2
import base64
from io import BytesIO
from keras.models import load_model
from PIL import Image

app = Flask(__name__)

# Load the face and emotion detection model
haarcascade = "haarcascade_frontalface_default.xml"
label_map = ['Anger', 'Neutral', 'Fear', 'Happy', 'Sad', 'Surprise']
model = load_model('model.h5')
cascade = cv2.CascadeClassifier(haarcascade)

@app.route('/')
def index():
    return 'Emotion Detection API'

@app.route('/emotion_detect', methods=["POST"])
def emotion_detect():
    # Get the base64 image data from the request
    data = request.get_json()
    singer = data['singer']
    language = data['language']
    image_data = data['image'].split(",")[1]  # Extract base64 string (remove data:image part)

    # Decode the base64 image
    img_data = base64.b64decode(image_data)
    img = Image.open(BytesIO(img_data))
    img = np.array(img)

    # Convert RGB to BGR for OpenCV
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    # Detect faces
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = cascade.detectMultiScale(gray, 1.4, 1)

    found = False
    for (x, y, w, h) in faces:
        found = True
        roi = gray[y:y + h, x:x + w]
        roi = cv2.resize(roi, (48, 48))
        roi = roi / 255.0
        roi = np.reshape(roi, (1, 48, 48, 1))

    if found:
        # Predict emotion
        prediction = model.predict(roi)
        prediction = np.argmax(prediction)
        emotion = label_map[prediction]

        # Create Spotify link based on emotion
        link = f"https://open.spotify.com/search/{singer}%20{emotion}%20{language}%20song"
        
        return jsonify({'emotion': emotion, 'link': link})

    return jsonify({'emotion': 'No face detected', 'link': ''})

if __name__ == '__main__':
    app.run(debug=True)
