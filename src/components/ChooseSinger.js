import React, { useState } from 'react';

const ChooseSinger = ({ onSingerSelect }) => {
  const [selectedSinger, setSelectedSinger] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const handleSingerChange = (event) => {
    setSelectedSinger(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSingerSelect(selectedSinger, selectedLanguage);  // Pass singer and language to parent component
  };

  return (
    <div className="choose-singer">
      <h2>Select a Singer and Language</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={selectedSinger}
          onChange={handleSingerChange}
          placeholder="Enter singer name"
        />
        <input
          type="text"
          value={selectedLanguage}
          onChange={handleLanguageChange}
          placeholder="Enter language"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ChooseSinger;
