import React from 'react';

const ScrollToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling animation
    });
  };

  return (
    <button className="scroll-to-top-button" onClick={scrollToTop}>
      TOP
    </button>
  );
};

export default ScrollToTopButton;
