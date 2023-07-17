import React from "react";


export default function Card(props) {

return (
    <div className="card">
        <div className="card-image">
        {props.article.teaserImageUrl && <img className="card-image" src={`${props.article.teaserImageUrl}?optimize=high&crop=16:9,smart&width=800&format=webp`} alt="teaserImage" />}
        </div>
        <div className="card-body">
        {props.article.articleTitle && <h5 className="card-title"><span style={{color: `#808080`}}></span>{props.article.articleTitle}</h5>}
        {props.article.articleTitle && <hr/>}
        {props.article.articleTitle && <h5 className="card-text"><span style={{color: `#808080`}}> </span>{props.article.articleDescription}</h5>}
        <br/>
        {props.article.articleTitle &&<a className="Tweetlink" href={`${props.article.articleUrl}`} target="_blank" rel="noreferrer">Read more on {`${props.article.articleSource}`}</a>} 
        {/* {props.article.articleTitle && <h5 className="card-text"><span style={{color: `#808080`}}>Published Date - {props.article.articleImportedToTopNewsDate}</span></h5>} */}
        {/* {props.article.teaserImageUrl && <h5 className="card-text"><span style={{color: `#808080`}}>Image url - {props.article.teaserImageUrl}</span></h5>} */}
        </div>
    </div>
);
}

