import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import Card from './AICard'
import AdminCard from './AdminCard'
import ReactGA from 'react-ga';
import { Helmet } from 'react-helmet';
require('dotenv').config();


const baseURL = process.env.REACT_APP_BASE_URL

const Topic = () => {
	const history = useHistory()
	const [tweets, setTweets] = useState([])
	const [twitterUserID, settwitterUserID] = useState('')
	const [disable, setDisable] = React.useState(false);
	const [disable1, setDisable1] = React.useState(false);
	const [handle, setHandle] = React.useState();
	const [dateTimeOfLastPulltoshow, setDateTimeOfLastPulltoshow] = React.useState();
	const [errormessage, setErrormessage] = React.useState();
	const [userName, setUserName] = React.useState();

	const [admin, setAdmin] = useState([])

	
	useEffect(() => {
		GetTweets();
		dateTimeOfLastPull();
		
		const params = new URLSearchParams()
		if (handle) {
		  params.append("h", handle)
		} else {
		  params.delete("h")
		}
		history.push({search: params.toString()})
	  }, [handle, history])

//get date time when articles were updated from rss
	async function dateTimeOfLastPull(event) {
	const req = await fetch(`${baseURL}/api/dateTimeOfLastPull`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			//nothing
		}),
	})
	const dateTimeOfLastPull = await req.json();
	if (dateTimeOfLastPull.status === 'ok') {

		const inputDate = new Date(dateTimeOfLastPull.dateTimeOfLastPull);
				const options = { 
					day: '2-digit', 
					month: 'short',
					// year: '2-digit', 
					hour: '2-digit', 
					minute: '2-digit', 
					hour12: true 
				  };
				  setDateTimeOfLastPulltoshow(handle => inputDate.toLocaleDateString('en-US', options));
	}
	} 

	// async function Admin(event) {
		
	// 	// setAdmin(admin => []);
	// 	// setDisable1(false);

	// 	const req = await fetch(`${baseURL}/api/providers`, {
			
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			'x-access-token': localStorage.getItem('token'),
	// 		},
	// 		body: JSON.stringify({
	// 			// tweeterUserHadleToPullTweets: twitterUserID,
	// 		}),
		
	// 	})

	// 	const data = await req.json()
	// 	if (data.status === 'ok') {

	// 		setAdmin(admin => []); //clear them first

	// 	for (let i=0;i<data.TopicArray.length;i++){ 
		
	// 		setAdmin(prevArray => [...prevArray, data.TopicArray[i]])

	// 	}
	// 	setDisable1(true);
		
	// } }  

	async function GetTweets(event) {
		// event.preventDefault()
		setDisable(true);
		// setTweets(tweets => []);
		// setUserName(userName => "");
		// setHandle(handle => "");
		// setErrormessage(errormessage => "");
		// settwitterUserID(twitterUserID => "");
		

		const req = await fetch(`${baseURL}/api/GetNewsForProvider`, {

			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				topictopuflltweets: twitterUserID || "PullAllNews",
			}),

		}) 

		const data = await req.json()
		if (data.status === 'ok') {
			
			for (let i=0;i<data.tweets.length;i++){ 

				const inputDate = new Date(data.tweets[i].articlePublicationDate);
				const options = { 
					day: '2-digit', 
					month: 'short',
					// year: '2-digit', 
					hour: '2-digit', 
					minute: '2-digit', 
					hour12: true 
				  };
				const formattedDate = inputDate.toLocaleDateString('en-US', options);
				
				const obj = {
					dbid:data.tweets[i]._id,
					articleSource: data.tweets[i].articleSource,
					articleTitle: data.tweets[i].articleTitle,
					articleDescription: data.tweets[i].articleDescription,
					articleUrl: data.tweets[i].articleUrl,
					teaserImageUrl: data.tweets[i].teaserImageUrl,
					articleAuthor: data.tweets[i].articleAuthor,
					articleGuid: data.tweets[i].articleGuid,
					articlePublicationDate: formattedDate,
					articleImportedToTopNewsDate: data.tweets[i].articleImportedToTopNewsDate,
					
				}

				setTweets(prevArray => [...prevArray, obj])
				
				setHandle(handle => data.tweets[0].tag);
				setUserName(userName => data.tweets[0].tag);
				setDisable(false);	
				
              }
		} 
		else if(data.status === 'error'){
			setDisable(false);
			setErrormessage(userName => data.error);
			
			ReactGA.exception({
				description: 'An error ocurred on Topic page',
				fatal: true
			  });
		}
	}

	const chooseHandle = (twitterUserID) => {
		settwitterUserID(twitterUserID); // id passed back from chile component
	  };

	
	return (
		<div className='tweetdiv'>
		<div className='header'>
			<h1 className='maintitle'>TOP NEWS</h1>
			{/* <h2 className='mainsubtitle'>Find new Tweet inspiration by analysing user's last few Tweets, and write new Tweets with AI in the same style.</h2> */}
			<h3 className='mainsubtitle'>Just reading #Headlines can keep you up to date about the latest events</h3>
			{dateTimeOfLastPulltoshow && <h5 className="articledateandsource"><span style={{color: `#808080`}}>{`Top NEWS updated every hour. Last updated - ${dateTimeOfLastPulltoshow}`}</span></h5>}
			 {errormessage && <h4 className="errormessage">{`${errormessage}`}</h4>}

			 {/* <h2 className='mainsubtitle'><a className='mainsubtitlelink' href="/handle">Search Twitter Users here</a></h2> */}
			 {/* {!disable1 && <h6>Pulling NEWS...Please wait..</h6>} */}

			{/* <div className='admincardmain'>
			 {admin.map((admin,index,) => {
				return <AdminCard 
				admin={admin}  key={index} chooseHandle={chooseHandle} handleortag={"tag"}
				// onChange={setAdmin}
				/>
			})}
			</div> */}


			{/* <form onSubmit={GetTweets}> */}
				{/* <input
					type="text"
					className='userIdTextBox'
					maxLength={70}
					required
					placeholder="Twitter User handle without @"
					onChange={(e) => settwitterUserID(e.target.value)}
				/> */}

				{/* <input type="submit" className='button' value={disable ? `Searching...` : `Get News` } disabled={!twitterUserID}/>
				
			</form> */}
			{disable && <h6>Getting NEWS just for you. Please wait..</h6>}
			<br/>
			{/* {disable && <h5><a href="mailto:learn@dictionaryv2.com">Send us feedback at learn@dictionaryv2.com</a></h5>} */}
			{/* <br/> */}

			{handle && <h4 className="mainsubtitle">{`${handle}`}</h4>}
			
			</div>

			{tweets.map((tweet,index) => {
				return <Card 
				article={tweet}  key={index}
				onChange={setTweets}
				/>
			})}
			{/* {handle &&  <h4 className='mainsubtitleads'><a target="_blank" href="mailto:learn@dictionaryv2.com">We CREATE a custom AI model on your/any account's Tweets, to generate high quality Tweets like you/them. Click to send us email</a></h4>}
			{handle &&  <h2 className='mainsubtitleads'><a target="_blank" href="http://tweethunter.io/?via=vivek">To BUILD & MONETIZE YOUR TWITTER AUDIENCE... FAST. Click here.</a></h2>}
			{handle &&  <h2 className='mainsubtitleads'><a target="_blank" href="https://twitter.com/galaxz_AI">Follow us on Twitter</a></h2>} */}
		
		{/* <Helmet>
          {handle && <title>{`GALAXZAI @${handle}`}</title>}
		  <meta charSet="utf-8" />
		</Helmet> */}

		</div>
	)
}

export default Topic

