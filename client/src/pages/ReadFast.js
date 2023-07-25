import React, {useState } from 'react';
import Card from './AICard'


const ReadFast = (props) => {
  const [isToggleOn, setIsToggleOn] = useState(false);

 
  const handleClick = () => {
    setIsToggleOn((prevToggle) => !prevToggle);

  };


  return (

    <div>
        <button className="read-fast-button" onClick={props.readfastorslow} >
        {isToggleOn ? 'Read slow' : 'Read fast'}
        </button>
       
     </div>

  );
};

export default ReadFast;

