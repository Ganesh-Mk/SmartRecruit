import { useState } from "react";

export default function SpeechTextMatch() {
  const textToSpeak = "listen and type round";
  const [userInput, setUserInput] = useState("");
  const [similarity, setSimilarity] = useState(null);

  const speakText = () => {
    const speech = new SpeechSynthesisUtterance(textToSpeak);
    window.speechSynthesis.speak(speech);
  };

  const calculateSimilarity = () => {
    const text = textToSpeak.toLowerCase().trim();
    const input = userInput.toLowerCase().trim();
    const words = text.split(" ");
    const inputWords = input.split(" ");
    let matchCount = words.filter((word, i) => word === inputWords[i]).length;
    let percentage = (matchCount / words.length) * 100;
    setSimilarity(percentage.toFixed(2));
  };

  return (
    <div className="flex flex-col items-center p-4">
      <button
        onClick={speakText}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Speak Text
      </button>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="border p-2 rounded w-80 mb-4"
        placeholder="Type what you heard..."
      />
      <button
        onClick={calculateSimilarity}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Check Similarity
      </button>
      {similarity !== null && (
        <p className="mt-4 text-lg">Match: {similarity}%</p>
      )}
    </div>
  );
}