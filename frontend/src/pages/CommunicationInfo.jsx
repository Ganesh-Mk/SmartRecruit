import React, { useState } from 'react';
import { PlusCircle, Trash2, Check, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CommunicationInfo = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('readSpeak');
  const [manualQuestions, setManualQuestions] = useState({
    readSpeak: [],
    listenType: [],
    topicSpeech: []
  });
  const [currentInput, setCurrentInput] = useState('');
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [selectedGenerated, setSelectedGenerated] = useState({
    readSpeak: [],
    listenType: [],
    topicSpeech: []
  });
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [generatedQuestions, setGeneratedQuestions] = useState({
    readAndSpeak: [],
    listenAndSpeak: [],
    topicAndSpeech: []
  });
  const [loading, setLoading] = useState({
    readSpeak: false,
    listenType: false,
    topicSpeech: false
  });

  const sectionHasQuestions = (sectionName) => {
    return (manualQuestions[sectionName].length + selectedGenerated[sectionName].length) > 0;
  };

  const allSectionsComplete = () => {
    return (
      sectionHasQuestions('readSpeak') &&
      sectionHasQuestions('listenType') &&
      sectionHasQuestions('topicSpeech')
    );
  };

  const getIncompleteSections = () => {
    const sections = [];
    if (!sectionHasQuestions('readSpeak')) sections.push('Read and Speak');
    if (!sectionHasQuestions('listenType')) sections.push('Listen and Type');
    if (!sectionHasQuestions('topicSpeech')) sections.push('Topic and Speech');
    return sections;
  };

  const handleAddManual = () => {
    if (currentInput.trim()) {
      setManualQuestions({
        ...manualQuestions,
        [activeTab]: [...manualQuestions[activeTab], currentInput.trim()]
      });
      setCurrentInput('');
    }
  };



  const handleSelectGenerated = (question) => {
    if (selectedGenerated[activeTab].includes(question)) {
      setSelectedGenerated({
        ...selectedGenerated,
        [activeTab]: selectedGenerated[activeTab].filter(q => q !== question)
      });
    } else {
      setSelectedGenerated({
        ...selectedGenerated,
        [activeTab]: [...selectedGenerated[activeTab], question]
      });
    }
  };

  const removeManualQuestion = (index) => {
    setManualQuestions({
      ...manualQuestions,
      [activeTab]: manualQuestions[activeTab].filter((_, i) => i !== index)
    });
  };

  const removeSelectedQuestion = (question) => {
    setSelectedGenerated({
      ...selectedGenerated,
      [activeTab]: selectedGenerated[activeTab].filter(q => q !== question)
    });
  };

  const handleNext = async () => {
    if (!allSectionsComplete()) return;

    const allQuestions = {
      userId: localStorage.getItem('userId'),
      readAndSpeak: [...manualQuestions.readSpeak, ...selectedGenerated.readSpeak],
      listenAndSpeak: [...manualQuestions.listenType, ...selectedGenerated.listenType],
      topicAndSpeech: [...manualQuestions.topicSpeech, ...selectedGenerated.topicSpeech]
    };

    try {
      const response = await fetch(`${BACKEND_URL}/addCommunication`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allQuestions),
      });

      

      const data = await response.json();

      if (data.success) {
        navigate('/techInfo');
      } else {
        console.error('Error saving questions:', data.message);
      }
    } catch (error) {
      console.error('Error saving questions:', error);
    }
  };


  const getEndpointForTab = (tab) => {
    switch (tab) {
      case 'readSpeak':
        return '/generateReadAndSpeak';
      case 'listenType':
        return '/generateListenAndSpeak';
      case 'topicSpeech':
        return '/generateTopicAndSpeech';
      default:
        return '';
    }
  };

  const getGeneratedArrayKey = (tab) => {
    switch (tab) {
      case 'readSpeak':
        return 'readAndSpeak';
      case 'listenType':
        return 'listenAndSpeak';
      case 'topicSpeech':
        return 'topicAndSpeech';
      default:
        return '';
    }
  };

  const handleGenerate = async () => {
    if (!generationPrompt.trim()) return;

    const endpoint = getEndpointForTab(activeTab);
    const arrayKey = getGeneratedArrayKey(activeTab);

    setLoading(prev => ({ ...prev, [activeTab]: true }));

    try {
      const response = await axios.get(`${BACKEND_URL}${endpoint}`, {
        timeout: 30000,
        params: { prompt: generationPrompt }
      });

      setGeneratedQuestions(prev => ({
        ...prev,
        [arrayKey]: response.data
      }));
    } catch (error) {
      console.error(`Error generating ${activeTab} questions:`, error);
      // Reset only the relevant section
      setGeneratedQuestions(prev => ({
        ...prev,
        [arrayKey]: []
      }));
      // Optional: Add error notification here
    } finally {
      setLoading(prev => ({ ...prev, [activeTab]: false }));
    }
  };

  const getGeneratedQuestionsForActiveTab = () => {
    const arrayKey = getGeneratedArrayKey(activeTab);
    return generatedQuestions[arrayKey] || [];
  };


  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Navigation Tabs with Status Indicators */}
      <div className="flex flex-col mb-8">
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            className={`px-4 py-3 rounded-md font-medium transition-all ${activeTab === 'readSpeak'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
            onClick={() => setActiveTab('readSpeak')}
          >
            Read and Speak
          </button>
          <button
            className={`px-4 py-3 rounded-md font-medium transition-all ${activeTab === 'listenType'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
            onClick={() => setActiveTab('listenType')}
          >
            Listen and Type
          </button>
          <button
            className={`px-4 py-3 rounded-md font-medium transition-all ${activeTab === 'topicSpeech'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
            onClick={() => setActiveTab('topicSpeech')}
          >
            Topic and Speech
          </button>
        </div>

        {/* Section completion status */}
        <div className="grid grid-cols-3 gap-1 mt-2">
          {['readSpeak', 'listenType', 'topicSpeech'].map((section) => (
            <div
              key={section}
              className={`text-sm flex items-center justify-center ${sectionHasQuestions(section) ? 'text-green-600' : 'text-gray-400'
                }`}
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${sectionHasQuestions(section) ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              {sectionHasQuestions(section) ? 'Complete' : 'Incomplete'}
            </div>
          ))}
        </div>
      </div>

      {/* Manual Input Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Add Questions Manually</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Enter your question here..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            onClick={handleAddManual}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 flex items-center gap-2"
          >
            <PlusCircle size={20} />
            Add
          </button>
        </div>
      </div>

      {/* Generate Questions Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Generate Questions</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={generationPrompt}
            onChange={(e) => setGenerationPrompt(e.target.value)}
            placeholder="Enter prompt for generation..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            onClick={handleGenerate}
            disabled={loading[activeTab]}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 disabled:opacity-50"
          >
            {loading[activeTab] ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {/* Generated Questions */}
        <div className="grid grid-cols-2 gap-4">
          {getGeneratedQuestionsForActiveTab().map((question, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg cursor-pointer ${selectedGenerated[activeTab].includes(question)
                ? 'border-green-500 bg-green-50'
                : 'hover:border-blue-300'
                }`}
              onClick={() => handleSelectGenerated(question)}
            >
              <div className="flex justify-between items-center">
                <p>{question}</p>
                {selectedGenerated[activeTab].includes(question) && (
                  <Check className="text-green-500" size={20} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Selected Questions Display */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Selected Questions</h2>

        {/* Manually Added Questions */}
        {manualQuestions[activeTab].map((question, index) => (
          <div key={index} className="flex justify-between items-center p-3 mb-2 bg-gray-50 rounded-lg">
            <p>{question}</p>
            <button
              onClick={() => removeManualQuestion(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        {/* Selected Generated Questions */}
        {selectedGenerated[activeTab].map((question, index) => (
          <div key={index} className="flex justify-between items-center p-3 mb-2 bg-blue-50 rounded-lg">
            <p>{question}</p>
            <button
              onClick={() => removeSelectedQuestion(question)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Next Button Section */}
      <div className="mt-8 border-t pt-6">
        <div className="flex flex-col items-end gap-4">
          {/* Warning for incomplete sections */}
          {!allSectionsComplete() && (
            <div className="w-full flex items-start gap-2 text-amber-600 bg-amber-50 p-4 rounded-lg">
              <AlertCircle className="mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium">Please Complete All Sections</p>
                <p className="text-sm mt-1">
                  Add questions to:
                  {getIncompleteSections().map((section, index) => (
                    <span key={section} className="font-medium">
                      {index === 0 ? ' ' : ', '}
                      {section}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={!allSectionsComplete()}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${allSectionsComplete()
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            Next
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunicationInfo;
