import React, { useState, useEffect } from 'react';

const ReadAndSpeakRound = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [scores, setScores] = useState([]);

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
    // Simple word matching score calculation
    const questionWords = questions[currentQuestion].toLowerCase().split(' ') || [];
    const spokenWords = spokenText.toLowerCase().split(' ');

    let matchedWords = 0;
    questionWords.forEach(word => {
      if (spokenWords.includes(word)) matchedWords++;
    });

    const score = Math.round((matchedWords / questionWords.length) * 100);
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Read and Speak - Question {currentQuestion + 1}</h2>

      <div className="mb-8 p-6 bg-indigo-50 rounded-xl">
        <p className="text-lg text-gray-800">{questions[currentQuestion] || 'Que'}</p>
      </div>

      <div className="flex justify-center space-x-4">
        {!isListening ? (
          <button
            onClick={startListening}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
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

export default ReadAndSpeakRound