import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function HRRoundEntrance() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const submitHandler = () => {
    if (input) {
      navigate(`/hrRound/${input}`);
    }
  };
  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your email"
      />
      <button onClick={submitHandler}>Join</button>
    </div>
  );
}

export default HRRoundEntrance;
