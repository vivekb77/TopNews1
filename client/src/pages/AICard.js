import React from "react";


export default function Card(props) {

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
            {props.article.articleTitle && props.article.articleDescription && <h5 className="card-text"><span style={{color: `#808080`}}> </span>{props.article.articleDescription}</h5>}
            {props.article.articleTitle && props.article.articleSource && <h5 className="articledateandsource"><span style={{color: `#808080`}}> </span>{`${props.article.articleSource}`}  ||   {`${props.article.articlePublicationDate}`}</h5>}         
            </a> }
           
        </div>
        {/* {<hr/>} */}
    </div>
    
);
}

