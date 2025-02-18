import React, { useState, useEffect } from 'react';

const CRRound = () => {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [questionText] = useState(
    "The quick brown fox jumps over the lazy dog."
  );
  const [recognition, setRecognition] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('ready');
  const [accuracy, setAccuracy] = useState(null);

  useEffect(() => {
    // Check if browser supports speech recognition
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

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setStatus('error');
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = () => {
    setStatus('recording');
    setIsListening(true);
    setSpokenText('');
    recognition.start();
    startProgress();
  };

  const stopListening = () => {
    setStatus('analyzing');
    setIsListening(false);
    recognition.stop();
    calculateAccuracy();
  };

  const startProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 100);
  };

  const calculateAccuracy = () => {
    // Simple word matching accuracy calculation
    const questionWords = questionText.toLowerCase().split(' ');
    const spokenWords = spokenText.toLowerCase().split(' ');

    let matchedWords = 0;
    questionWords.forEach(word => {
      if (spokenWords.includes(word)) matchedWords++;
    });

    const accuracyScore = Math.round((matchedWords / questionWords.length) * 100);
    setAccuracy(accuracyScore);
    setStatus('completed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Read and Speak Assessment</h1>
          <p className="mt-2 text-gray-600">Read the text below and click Start when you're ready</p>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Please read the following text:</h2>
          <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-lg text-gray-800 leading-relaxed">{questionText}</p>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`h-3 w-3 rounded-full ${status === 'recording' ? 'bg-red-500 animate-pulse' :
                status === 'analyzing' ? 'bg-yellow-500' :
                  status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              <span className="text-sm font-medium text-gray-700">
                {status === 'ready' && 'Ready to start'}
                {status === 'recording' && 'Recording...'}
                {status === 'analyzing' && 'Analyzing...'}
                {status === 'completed' && 'Completed'}
                {status === 'error' && 'Error occurred'}
              </span>
            </div>
            {status === 'recording' && (
              <div className="w-24 bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            {!isListening ? (
              <button
                onClick={startListening}
                disabled={status === 'analyzing'}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg
                         hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/50
                         transition-all duration-200 focus:outline-none disabled:opacity-50"
              >
                Start Speaking
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg
                         hover:bg-red-700 focus:ring-4 focus:ring-red-500/50
                         transition-all duration-200 focus:outline-none"
              >
                Stop Recording
              </button>
            )}
          </div>
        </div>

        {/* Results Panel */}
        {spokenText && (
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Results</h2>

              {accuracy !== null && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Accuracy Score:</span>
                  <span className={`text-lg font-bold ${accuracy >= 80 ? 'text-green-600' :
                    accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>{accuracy}%</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Your speech:</h3>
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                    <p className="text-gray-800">{spokenText || "No speech detected..."}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CRRound;