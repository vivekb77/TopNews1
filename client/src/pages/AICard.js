import React from "react";
import ReactHtmlParser from 'react-html-parser'; 

export default function Card(props) {

    const seperateDescriptionFieldWords = props.article.articleDescription.split(" ");
    const boldedArray = props.article.articleDescription.split(" ");

    for (let i=0;i<seperateDescriptionFieldWords.length;i++){ 

        // if (!seperateDescriptionFieldWords[i].match(/.*[^a-zA-Z].*/)) {} to filter words with only chars

        if(seperateDescriptionFieldWords[i].length<=1){
            boldedArray[i] = `<b>${seperateDescriptionFieldWords[i].slice(0, 1)}</b>`
        }
        if(seperateDescriptionFieldWords[i].length===2){
            boldedArray[i] = `<b>${seperateDescriptionFieldWords[i].slice(0, 1)}</b>${seperateDescriptionFieldWords[i].slice(1, seperateDescriptionFieldWords[i].length)}`
        }
        if(seperateDescriptionFieldWords[i].length===3){
            boldedArray[i] = `<b>${seperateDescriptionFieldWords[i].slice(0, 1)}</b>${seperateDescriptionFieldWords[i].slice(1, seperateDescriptionFieldWords[i].length)}`
        }
        if(seperateDescriptionFieldWords[i].length===4){
            boldedArray[i] = `<b>${seperateDescriptionFieldWords[i].slice(0, 2)}</b>${seperateDescriptionFieldWords[i].slice(2, seperateDescriptionFieldWords[i].length)}`
        }
        if(seperateDescriptionFieldWords[i].length===5){
            boldedArray[i] = `<b>${seperateDescriptionFieldWords[i].slice(0, 2)}</b>${seperateDescriptionFieldWords[i].slice(2, seperateDescriptionFieldWords[i].length)}`
        }
        if(seperateDescriptionFieldWords[i].length===6){
            boldedArray[i] = `<b>${seperateDescriptionFieldWords[i].slice(0, 3)}</b>${seperateDescriptionFieldWords[i].slice(3, seperateDescriptionFieldWords[i].length)}`
        }
        if(seperateDescriptionFieldWords[i].length===7 || seperateDescriptionFieldWords[i].length===8 || seperateDescriptionFieldWords[i].length===9){
            boldedArray[i] = `<b>${seperateDescriptionFieldWords[i].slice(0, 4)}</b>${seperateDescriptionFieldWords[i].slice(4, seperateDescriptionFieldWords[i].length)}`
        }
        if(seperateDescriptionFieldWords[i].length>9){
            boldedArray[i] = `<b>${seperateDescriptionFieldWords[i].slice(0, 5)}</b>${seperateDescriptionFieldWords[i].slice(5, seperateDescriptionFieldWords[i].length)}`
        }

    }
    let readfast = boldedArray.join(" ");

return (
    <div className="card">
        {props.article.articleTitle && props.article.teaserImageUrl &&
            <div className="card-image">
                <img className="card-image" src={`${props.article.teaserImageUrl}`} alt={props.article.articleTitle} />      
            </div>
        }
        {props.article.articleTitle && props.article.stuffImageUrlForBigImage &&
            <div className="card-image">
                <img className="card-image" src={`${props.article.stuffImageUrlForBigImage}`} alt={props.article.articleTitle} />      
            </div>
        }
        <div className="card-body">
            {props.article.articleTitle && <a href={`${props.article.articleUrl}`} target="_blank" rel="noreferrer">
            {props.article.articleTitle && <h5 className="card-title"><span style={{color: `#808080`}}></span>{props.article.articleTitle}</h5>}
            {props.article.articleTitle && props.article.articleDescription && <h5 className="card-text">{props.article.articleDescription}</h5>}
            {props.article.articleTitle && props.article.articleDescription && <h5 className="card-text-readfast">{ReactHtmlParser (readfast)}</h5>}
            {props.article.articleTitle && props.article.articleSource && <h5 className="articledateandsource"><span style={{color: `#808080`}}> </span>{`${props.article.articleSource}`}  ||   {`${props.article.articlePublicationDate}`}</h5>}         
            </a> }
           
        </div>
        {/* {<hr/>} */}
    </div>
    
);
}

