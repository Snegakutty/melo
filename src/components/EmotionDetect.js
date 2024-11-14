import React, { useState, useEffect, useRef } from 'react';

const EmotionDetect = ({ singer, language }) => {
  const [emotion, setEmotion] = useState('');
  const [spotifyLink, setSpotifyLink] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Get video stream from webcam
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Access the camera
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream; // Set the stream to video element
          }
        })
        .catch((error) => {
          console.error('Error accessing webcam:', error);
        });
    } else {
      alert('Webcam access not supported in this browser');
    }
  }, []);

  const handleEmotionDetect = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    const captureFrame = () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');
      
      // Send the frame to Flask server for emotion detection
      fetch('http://localhost:5000/emotion_detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          singer: singer,
          language: language,
          image: imageData,  // Send the captured frame as base64 image
        }),
      })
      .then(response => response.json())
      .then(data => {
        setEmotion(data.emotion);
        setSpotifyLink(data.link);
      })
      .catch(err => console.error('Error in detecting emotion:', err));

      requestAnimationFrame(captureFrame);
    };

    captureFrame(); // Start capturing frames
  };

  return (
    <div className="emotion-detect">
      <h2>Detecting Emotion for {singer}</h2>
      <video 
        ref={videoRef} 
        width="640" 
        height="480" 
        autoPlay
        onCanPlay={() => videoRef.current.play()}  // Make sure play is called after the video is ready
      />
      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
      <button onClick={handleEmotionDetect}>Start Emotion Detection</button>
      
      {emotion && (
        <div>
          <h3>Detected Emotion: {emotion}</h3>
          <a href={spotifyLink} target="_blank" rel="noopener noreferrer">
            Listen to a {emotion} song on Spotify
          </a>
        </div>
      )}
    </div>
  );
};

export default EmotionDetect;
