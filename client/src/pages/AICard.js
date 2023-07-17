import React from "react";


export default function Card(props) {

return (
    <div className="card">
        <a className="articlelinkandtime" href={`${props.article.articleUrl}`} target="_blank" rel="noreferrer">

        <div className="card-image">
        {props.article.teaserImageUrl && <img className="card-image" src={`${props.article.teaserImageUrl}?optimize=high&crop=16:9,smart&width=800&format=webp`} alt="teaserImage" />}
        </div>
        <div className="card-body">
        {props.article.articleTitle && <h5 className="card-title"><span style={{color: `#808080`}}></span>{props.article.articleTitle}</h5>}
        {/* {props.article.articleTitle && <hr/>} */}
        {props.article.articleTitle && <h5 className="card-text"><span style={{color: `#808080`}}> </span>{props.article.articleDescription}</h5>}
        {props.article.articleTitle && <h5 className="articledateandsource"><span style={{color: `#808080`}}> </span>{`${props.article.articleSource}`}  ||   {`${props.article.articlePublicationDate}`}</h5>}         
        </div>
        </a> 
    </div>
);
}

