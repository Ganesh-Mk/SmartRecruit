import React, { useState, useEffect } from 'react';

const ListenAndSpeakRound = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [scores, setScores] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [similarity, setSimilarity] = useState(null);

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
    const speech = new SpeechSynthesisUtterance(questions[currentQuestion]);
    speech.onend = () => {
      setIsPlaying(false);
    };
    window.speechSynthesis.speak(speech);
  };

  const startListening = () => {
    setIsListening(true);
    setSpokenText('');
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
    calculateSimilarity();
  };

  const calculateSimilarity = () => {
    const text = questions[currentQuestion].toLowerCase().trim();
    const input = spokenText.toLowerCase().trim();
    const words = text.split(" ");
    const inputWords = input.split(" ");
    let matchCount = words.filter((word, i) => word === inputWords[i]).length;
    let percentage = (matchCount / words.length) * 100;
    const score = Math.min(100, Math.max(0, percentage)); // Ensure score is between 0 and 100
    setSimilarity(score.toFixed(2));
    setScores([...scores, score]);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSpokenText('');
        setSimilarity(null);
        setUserInput('');
      }, 2000);
    } else {
      const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      onComplete(averageScore);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Listen and Speak - Question {currentQuestion + 1}</h2>

      <div className="mb-8 p-6 bg-indigo-50 rounded-xl">
        <p className="text-lg text-gray-800">{questions[currentQuestion]}</p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={playAudio}
          disabled={isPlaying}
          className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 w-48"
        >
          {isPlaying ? 'Playing...' : 'Play Audio'}
        </button>

        {!isListening ? (
          <button
            onClick={startListening}
            disabled={isPlaying}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 w-48"
          >
            Start Speaking
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 w-48"
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

      {similarity !== null && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">
            Match: <span className="text-indigo-600">{similarity}%</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ListenAndSpeakRound;