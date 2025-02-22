import React, { useState, useEffect } from 'react';

const TopicAndSpeakRound = ({ topics, onComplete }) => {
  const [currentTopic, setCurrentTopic] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [scores, setScores] = useState([]);
  const [timer, setTimer] = useState(120); // 2 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);

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

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      stopListening();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const startListening = () => {
    setIsListening(true);
    setIsTimerRunning(true);
    setSpokenText('');
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    setIsTimerRunning(false);
    recognition.stop();
    calculateScore();
  };

  const calculateScore = () => {
    // Score based on speech length and timer usage
    const wordCount = spokenText.split(' ').length;
    const timeUsed = 120 - timer;

    // Simple scoring algorithm
    let score = Math.min(100, (wordCount / 2) + (timeUsed / 2));
    score = Math.max(0, score);
    score = Math.round(score);

    setScores([...scores, score]);

    if (currentTopic < topics.length - 1) {
      setCurrentTopic(currentTopic + 1);
      setSpokenText('');
      setTimer(120); // Reset timer for next topic
    } else {
      const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      onComplete(averageScore);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Topic and Speak - Topic {currentTopic + 1}</h2>

      <div className="mb-8 p-6 bg-indigo-50 rounded-xl">
        <p className="text-lg text-gray-800">{topics[currentTopic]}</p>
        <p className="mt-4 text-sm text-gray-600">
          Speak for up to 2 minutes on this topic. Try to provide detailed explanations and examples.
        </p>
      </div>

      <div className="flex justify-center items-center mb-6">
        <div className={`text-2xl font-bold ${timer < 30 ? 'text-red-600' : 'text-indigo-600'}`}>
          {formatTime(timer)}
        </div>
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
        <div className="mt-8 space-y-4">
          <div className="p-6 bg-gray-50 rounded-xl">
            <h3 className="font-medium mb-2">Your speech:</h3>
            <p className="text-gray-700">{spokenText}</p>
          </div>

          <div className="p-4 bg-indigo-50 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Word count:</span>
              <span className="font-medium">{spokenText.split(' ').length} words</span>
            </div>
          </div>
        </div>
      )}

      {/* Speaking Tips */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
        <h3 className="font-medium text-yellow-800 mb-2">Speaking Tips:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Speak clearly and at a moderate pace</li>
          <li>• Use relevant examples to support your points</li>
          <li>• Structure your response with an introduction and conclusion</li>
          <li>• Stay focused on the given topic</li>
        </ul>
      </div>
    </div>
  );
};

export default TopicAndSpeakRound;