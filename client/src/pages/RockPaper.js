import React, { useState } from 'react';

const RockPaper = (props) => {

  let [computer_score, user_score] = [0, 0];
  let result_ref = document.getElementById("result");
  let choices_object = {
    'rock': {
      'rock': 'draw',
      'scissor': 'win',
      'paper': 'lose'
    },
    'scissor': {
      'rock': 'lose',
      'scissor': 'draw',
      'paper': 'win'
    },
    'paper': {
      'rock': 'win',
      'scissor': 'lose',
      'paper': 'draw'
    }

  }

  function checker(input) {
    var choices = ["rock", "paper", "scissor"];
    var num = Math.floor(Math.random() * 3);

    document.getElementById("comp_choice").innerHTML =
      ` We chose <span> ${choices[num].toUpperCase()} </span>`;

    document.getElementById("user_choice").innerHTML =
      ` You chose <span> ${input.toUpperCase()} </span>`;

    let computer_choice = choices[num];

    switch (choices_object[input][computer_choice]) {
      case 'win':
        result_ref.style.cssText = "background-color: #cefdce; color: #689f38";
        result_ref.innerHTML = "YOU WIN";
        user_score++;
        break;
      case 'lose':
        result_ref.style.cssText = "background-color: #ffdde0; color: #d32f2f";
        result_ref.innerHTML = "YOU LOSE";
        computer_score++;
        break;
      default:
        result_ref.style.cssText = "background-color: #e5e5e5; color: #808080";
        result_ref.innerHTML = "DRAW";
        break;
    }

    document.getElementById("computer_score").innerHTML = computer_score;
    document.getElementById("user_score").innerHTML = user_score;
  }
  const handleClick1 = () => {
    checker("rock")
  };
  const handleClick2 = () => {
    checker("paper")
  };
  const handleClick3 = () => {
    checker("scissor")
  };

  return (
    <div class="rockpapercontainer">
      <h5>You've reached the end. Come back in a few hours to see the latest news.</h5>
      <h5>Let's play Rock Paper Scissor a bit before you go.</h5>
      <div class="scores">
        <p>We :
          <span id="computer_score"> 0</span>
        </p>
        <p>
          You :
          <span id="user_score"> 0</span>
        </p>
      </div>
      <div class="weapons">
        <button onClick={handleClick1}>
          <i class="far fa-hand-rock"></i>
        </button>
        <button onClick={handleClick2}>
          <i class="far fa-hand-paper"></i>
        </button>
        <button onClick={handleClick3}>
          <i class="far fa-hand-scissors"></i>
        </button>
      </div>
      <div class="details">
        <p id="user_choice"></p>
        <p id="comp_choice"></p>
        <p id="result"></p>
      </div>
    </div>
  );
};
export default RockPaper;

