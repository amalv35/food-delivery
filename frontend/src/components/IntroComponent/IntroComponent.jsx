import { useState, useEffect } from 'react';
import './IntroComponent.css';

const IntroAnimation = ({ onComplete }) => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      if (onComplete) onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!showIntro) return null;

  return (
    <div className="intro-screen">
      <div className="intro-content">
        <h1 className="intro-title">AMALS</h1>
        <p className="intro-subtitle">Food Delivery</p>
      </div>
    </div>
  );
};

export default IntroAnimation;