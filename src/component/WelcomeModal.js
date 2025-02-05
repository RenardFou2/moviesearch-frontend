import React, { useState, useEffect } from "react";
import "./WelcomeModal.css";

const WelcomeModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenWelcomeModal");
    if (!hasSeenModal) {
      setIsVisible(true);
    }
  }, []);
  
  const handleClose = () => {
    //localStorage.setItem("hasSeenWelcomeModal", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome to MovieSearch!</h2>
        <p>✨ Select movies you like, and we’ll recommend similar ones.</p>
        <p>🔍 Click on a movie to learn more.</p>
        <p>❤️ Use the heart button to add movies to your list.</p>
        <button className="close-button" onClick={handleClose}>
          Got it!
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
