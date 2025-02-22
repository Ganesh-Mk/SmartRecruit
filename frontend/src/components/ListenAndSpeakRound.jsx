import React, { useState, useEffect } from 'react';

const ListenAndSpeakRound = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [scores, setScores] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setSpokenText(transcript);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const playAudio = () => {
    setIsPlaying(true);
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const startListening = () => {
    setIsListening(true);
    setSpokenText('');
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
    calculateScore();
  };

  const calculateScore = () => {
    // Simple simulation of scoring for listen and speak
    const score = Math.floor(Math.random() * 20) + 80; // Random score between 80-100
    setScores([...scores, score]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSpokenText('');
    } else {
      const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      onComplete(averageScore);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Listen and Speak - Question {currentQuestion + 1}</h2>

      <div className="mb-8 p-6 bg-indigo-50 rounded-xl">
        <p className="text-lg text-gray-800">{questions[currentQuestion] || 'Que'}</p>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={playAudio}
          disabled={isPlaying}
          className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {isPlaying ? 'Playing...' : 'Play Audio'}
        </button>
      </div>

      <div className="flex justify-center space-x-4">
        {!isListening ? (
          <button
            onClick={startListening}
            disabled={isPlaying}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Start Speaking
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
          >
            Stop Recording
          </button>
        )}
      </div>

      {spokenText && (
        <div className="mt-8 p-6 bg-gray-50 rounded-xl">
          <h3 className="font-medium mb-2">Your speech:</h3>
          <p className="text-gray-700">{spokenText}</p>
        </div>
      )}
    </div>
  );
};

export default ListenAndSpeakRound;