import React from "react";
import { useEffect } from 'react';


export default function TopicCard(props) {

    const [disable1, setDisable1] = React.useState(false);


    async function SelectDiv1 ( topictopull){

        setDisable1(true);
        props.chooseTopic(topictopull); //pass handle back to parent component
        
    }

    return (

        <div className={!disable1 ? 'admincard' : 'admincardselected'} onClick={() => {SelectDiv1(props.topic)}} >
       
              {props.topic && <p className="card-text"><span style={{color: `#808080`}}>  </span>{props.topic}</p>}
        </div>
    );
}

