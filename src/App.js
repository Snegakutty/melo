import React, { useState } from 'react';
import ChooseSinger from './components/ChooseSinger';
import EmotionDetect from './components/EmotionDetect';
import './styles.css';

const App = () => {
  const [singer, setSinger] = useState('');
  const [language, setLanguage] = useState('');

  const handleSingerSelect = (selectedSinger, selectedLanguage) => {
    setSinger(selectedSinger);
    setLanguage(selectedLanguage);
  };

  return (
    <div className="app">
      <h1>Emotion-based Song Recommendation</h1>
      {!singer ? (
        <ChooseSinger onSingerSelect={handleSingerSelect} />
      ) : (
        <EmotionDetect singer={singer} language={language} />
      )}
    </div>
  );
};

export default App;
