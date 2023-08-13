import React from "react";

export default function NewsProvidersCard(props) {

    const [disable, setDisable] = React.useState(false);
  
    async function SelectedProvider(provider) {
        setDisable(true);
        props.chooseProvider(provider); //pass provider back to parent component
    }

    return (
        <div id={props.providers} className={!disable ? 'providerlistcard' : 'providerlistcardselected'} onClick={() => { SelectedProvider(props.providers) }} >
            {props.providers && <p className="card-text"><span style={{ color: `#808080` }}>  </span>{props.providers}</p>}
        </div>
    );
}