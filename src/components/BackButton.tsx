import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const [canGoBack, setCanGoBack] = useState(true);

  useEffect(() => {
    // Check if there's a history entry to go back to
    if (window.history.length <= 1) {
      setCanGoBack(false); // No history, can't go back
    }
  }, []);

  const handleClick = () => {
    if (canGoBack) {
      navigate(-1); // Go back if possible
    } else {
      navigate("/home"); // Go to home if can't go back
    }
  };

  return (
    <button onClick={handleClick} className="back-button">
      {canGoBack ? "Go Back" : "Go to Home"}
    </button>
  );
};

export default BackButton;
