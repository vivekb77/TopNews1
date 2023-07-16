import React from "react";
import { useEffect } from 'react';


export default function AdminCard(props) {

    const [disable, setDisable] = React.useState(false);


    async function SelectDiv ( handle){

        setDisable(true);
        props.chooseHandle(handle); //pass handle back to parent component
        
    }

    return (

        <div id={props.admin} className={!disable ? 'admincard' : 'admincardselected'} onClick={() => {SelectDiv(props.admin)}} >
       
              {props.admin && props.handleortag == "handle" && <p className="card-text"><span style={{color: `#808080`}}>  </span>@{props.admin}</p>}
              {props.admin && props.handleortag == "tag" &&  <p className="card-text"><span style={{color: `#808080`}}>  </span>{props.admin}</p>}

        </div>
    );
}

