import React, { useContext,useState } from "react";
import ReactHtmlParser from 'react-html-parser'; 
import ReadFast from "./ReadFast";


export default function Card(props) {
    const [isToggleOn, setIsToggleOn] = useState(true);
    
    const handleClick = () => {
        setIsToggleOn((prevToggle) => !prevToggle);
    };
    
    function boldWords(seperateDescriptionFieldWords) {
      const boldedArray = [];
      for (let i=0;i<seperateDescriptionFieldWords.length;i++) {
        switch(seperateDescriptionFieldWords[i].length){
            case 1:
                boldedArray[i] = `<b>${seperateDescriptionFieldWords[i].slice(0, 1)}</b>`;
                break;
            case 2:
                boldedArray[i] = `<b>${seperateDescriptionFieldWords[i].slice(0, 1)}</b>${seperateDescriptionFieldWords[i].slice(1, seperateDescriptionFieldWords[i].length)}`;
                break;
            case 3:
                boldedArray[i] = `<b>${seperateDescriptionFieldWords[i].slice(0, 2)}</b>${seperateDescriptionFieldWords[i].slice(2, seperateDescriptionFieldWords[i].length)}`;
                break;
            case 4:
                boldedArray[i] = `<b>${seperateDescriptionFieldWords[i].slice(0, 2)}</b>${seperateDescriptionFieldWords[i].slice(2, seperateDescriptionFieldWords[i].length)}`;
                break;
            case 5:
                boldedArray[i] = `<b>${seperateDescriptionFieldWords[i].slice(0, 3)}</b>${seperateDescriptionFieldWords[i].slice(3, seperateDescriptionFieldWords[i].length)}`;
                break;
            case 6:
                boldedArray[i] = `<b>${seperateDescriptionFieldWords[i].slice(0, 3)}</b>${seperateDescriptionFieldWords[i].slice(3, seperateDescriptionFieldWords[i].length)}`;
                break;
            case 7:
            case 8:
            case 9:
                boldedArray[i] = `<b>${seperateDescriptionFieldWords[i].slice(0, 4)}</b>${seperateDescriptionFieldWords[i].slice(4, seperateDescriptionFieldWords[i].length)}`;
                break;
            default:
                boldedArray[i] = `<b>${seperateDescriptionFieldWords[i].slice(0, 5)}</b>${seperateDescriptionFieldWords[i].slice(5, seperateDescriptionFieldWords[i].length)}`;
                break;
        }
      }
      return boldedArray.join(" ");
    }

    let readfast = boldWords(props.article.articleDescription.split(" "));

    return (
        
        <div className="card">
            <ReadFast readfastorslow ={handleClick}/>
            {props.article.articleTitle && (props.article.teaserImageUrl || props.article.stuffImageUrlForBigImage) &&
                <div className="card-image">
                    <img className="card-image" src={`${props.article.teaserImageUrl || props.article.stuffImageUrlForBigImage}`} alt={props.article.articleTitle} />      
                </div>
            }
            
            <div className="card-body">
                {props.article.articleTitle && <a href={`${props.article.articleUrl}`} target="_blank" rel="noreferrer">
                {props.article.articleTitle && <h5 className="card-title"><span style={{color: `#808080`}}></span>{props.article.articleTitle}</h5>}
                {isToggleOn ? <h5 className="card-text">{props.article.articleDescription}</h5> : <h5 className="card-text-readfast">{ReactHtmlParser (readfast)}</h5>}
                {/* {isToggleOn && props.article.articleTitle && props.article.articleDescription && <h5 className="card-text">{props.article.articleDescription}</h5>}
                {!isToggleOn && props.article.articleTitle && props.article.articleDescription && <h5 className="card-text-readfast">{ReactHtmlParser (readfast)}</h5>} */}
                {props.article.articleTitle && props.article.articleSource && <h5 className="articledateandsource"><span style={{color: `#808080`}}> </span>{`${props.article.articleSource}`}  ||   {`${props.article.articlePublicationDate}`}</h5>}         
                </a> }
            </div>
            
        </div>
    );
}