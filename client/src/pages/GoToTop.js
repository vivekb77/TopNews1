import React from 'react';

const ScrollToTopButton = () => {
  // const scrollToTop = () => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: 'smooth', // Smooth scrolling animation
  //   });
  // };

  let calcScrollValue = () => {
    let scrollProgress = document.getElementById("progress");
    let progressValue = document.getElementById("progress-value");
    let pos = document.documentElement.scrollTop;
    let calcHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    let scrollValue = Math.round((pos * 100) / calcHeight);
    if (pos > 0) {
      scrollProgress.style.display = "grid";
    } else {
      scrollProgress.style.display = "grid";
    }
    scrollProgress.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
    scrollProgress.style.background = `conic-gradient(#009dff ${scrollValue}%, #d7d7d7 ${scrollValue}%)`;
  };

  window.onscroll = calcScrollValue;
  window.onload = calcScrollValue;

  return (
    <div id="progress">
      <span id="progress-value"></span>
    </div>
    // <button className="scroll-to-top-button" onClick={scrollToTop}>
    // </button>
  );
};

export default ScrollToTopButton;
