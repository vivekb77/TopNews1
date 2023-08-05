import React from "react";


export default function Card(props) {

    let date = new Date(props.tweet.CreatedDate).toLocaleDateString();

    const [isDeleted, setIsDeleted] = React.useState(false);
    const [isTagAdded, setIsTagAdded] = React.useState(false);
    const [errmessage, setErrmessage] = React.useState("");
    const [tag, setTag] = React.useState();


// if either likes or impressions are 0, then ratio is 0 otherwise ratio is likes/impressions
    let ratio = props.tweet.like_count>0 && props.tweet.impression_count>0 ? ((props.tweet.like_count/props.tweet.impression_count)*100).toFixed(2): 0 ;
    let ratio1 = props.tweet.reply_count>0 && props.tweet.impression_count>0 ? ((props.tweet.reply_count/props.tweet.impression_count)*100).toFixed(2): 0 ;
    let color = "#38761d";

    if(ratio>2){
        color = "#6aa84f";
    }
    if(ratio>=1 && ratio<2){
        color = "#cc6600";
    }
    if(ratio<1){
        color = "#ff0000";
    }

    const baseURL = process.env.REACT_APP_BASE_URL;
    async function deleteTweet(id) {
        
		const req = await fetch(`${baseURL}/api/deleteTweet`, {

			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// 'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				dbid: id,
			}),

		})
        const data = await req.json()
		if (data.status === 'ok') {
            setIsDeleted(!isDeleted);
            setErrmessage(errormessage => "Tweet Deleted");
            // console.log("isDeleted is okkkk", isDeleted, "data is ", data);

        } else {
            setIsDeleted(isDeleted);
            setErrmessage(errormessage => "Tweet not Deleted");
            // console.log("isDeleted is errrorrr", isDeleted);
        }
    }

    async function AddTag(id) {

		const req = await fetch(`${baseURL}/api/addtag`, {

			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// 'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				dbid: id,
                tag:tag
			}),

		})
        const data = await req.json()
		if (data.status === 'ok') {
            setIsTagAdded(!setIsTagAdded);
            setErrmessage(errormessage => "Tag Added");
            setTag(tag => "");

        } else {
            setIsTagAdded(setIsTagAdded);
            setErrmessage(errormessage => "Tag not added");
            setTag(tag => "");
        }
    }

    return (
        <div className="card">
          {!isDeleted &&  <div className="card-body">

              {props.tweet && <h5 className="card-text"><span style={{color: `#808080`}}>Created Date - </span>{date}</h5>}
              {props.tweet && <h5 className="card-title"><span style={{color: `#808080`}}>Tweet - </span>{props.tweet.tweet}</h5>}
              {props.tweet && <hr/>}
              {props.tweet && <h5 className="card-title"><span style={{color: `#808080`}}>Tweet - </span>{props.tweet.articleDescription}</h5>}
              {props.tweet && <p className="card-text"><span style={{color: `${color}`}}>{ `Likes/Views - ${ratio}% | Replies/Views - ${ratio1}% `}</span> { ` | Views - ${props.tweet.impression_count} | Likes - ${props.tweet.like_count} | Replies - ${props.tweet.reply_count} | Retweets - ${props.tweet.retweet_count} | Q Tweets - ${props.tweet.quote_count}`}</p>}
               {/* {props.tweet.tweetSentiment &&  <h6 className="card-text">{`New Tweet for you - ${props.tweet.tweetSentiment}`}</h6>} */}
               {/* {props.tweet.newtweet &&  <h6 className="card-text"><span style={{color: `#808080`}}>Tweet for you </span></h6>} */}
               {/* {props.tweet.newtweet &&  <h6 className="card-text"><span style={{color: `#808080`}}>Tweet by AI - </span>{`  ${props.tweet.newtweet}`}</h6>} */}
               {/* {props.tweet.newtweet && <button className="copybutton" onClick={() => {navigator.clipboard.writeText(props.tweet.newtweet);}}>Copy Tweet</button>} */}
               {props.tweet && <button className="copybutton" onClick={() => deleteTweet(props.tweet.dbid)}>Delete Tweet</button>}
               <br/>
               <br/>
               {errmessage && <h4 className="errormessagesmall">{`${errmessage}`}</h4>}
                <h4 className="">{`${props.tweet.tag}`}</h4>
                <input
					type="text"
					className='tagTextBox'
					maxLength={25}
					required
					placeholder="Add Tag"
					onChange={(e) => setTag(e.target.value)}
				/>
				<br/>
               {props.tweet && <button className="copybutton" onClick={() => AddTag(props.tweet.dbid)} disabled={!tag}>Add Tag</button>}
               <br/>
               <br/>
                <h4 className="">{`business networking startups success strategy tech marketing jobs sales innovation science history philosophy psychology software productivity life advertising tips content blog women work design`}</h4>
               <br/>
               <br/>
               {props.tweet &&<a className="Tweetlink" href={`${props.tweet.tweetID}`} target="_blank" rel="noreferrer">View this Tweet by {`${props.tweet.TwitteruserFullName} on Twitter`}</a>} 

            </div>}
            {/* {ratio>1 &&  <h2 className='card-title'><a target="_blank" href="http://tweethunter.io/?via=vivek">BUILD & MONETIZE YOUR TWITTER AUDIENCE. FAST. Click here</a></h2>} */}
        </div>
    );
}

