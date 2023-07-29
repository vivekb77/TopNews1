import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import Card from './AICard'
import AdminCard from './AdminCard'
import GoToTop from './GoToTop'
import ReadFast from './ReadFast';
import GA4React from "ga-4-react";
import { Helmet } from 'react-helmet';
require('dotenv').config();

const ga4react = new GA4React("G-4YQR5FRQQL");
ga4react.initialize().then().catch()

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
	const [infoMessage, setInfoMessage] = React.useState();
	const [isReadFastOn, setIsReadFastOn] = useState(false);

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
		setDisable(false);
		setDateTimeOfLastPulltoshow(handle => dateTimeOfLastPull.dateTimeOfLastPull);
	}
	else if (dateTimeOfLastPull.status === 'error') {
		setDisable(false);
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
		setInfoMessage(false);
		// setTweets(tweets => []);
		// setUserName(userName => "");
		// setHandle(handle => "");
		setErrormessage(errormessage => "");
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
				let stuffImageUrlForBigImage
				let teaserImageUrl
				//images in rss for stuff are not very good so this
				if(data.tweets[i].articleSource === "STUFF"){
					const teaserImageUrlSpliturlArray = data.tweets[i].teaserImageUrl.split(".");
					let teaserImageUrlSpliturlArraySliced = teaserImageUrlSpliturlArray.slice(0,4);
					stuffImageUrlForBigImage = `${teaserImageUrlSpliturlArraySliced.join(".")}.related.StuffLandscapeSixteenByNine.1420x800.${teaserImageUrlSpliturlArray[7]}.${teaserImageUrlSpliturlArray[8]}.jpg?format=pjpg&optimize=medium`;
					teaserImageUrl = ""
				}
				else{
					teaserImageUrl = data.tweets[i].teaserImageUrl;
					stuffImageUrlForBigImage = "";
				}

				const obj = {
					dbid:data.tweets[i]._id,
					articleSource: data.tweets[i].articleSource,
					articleTitle: data.tweets[i].articleTitle,
					articleDescription: data.tweets[i].articleDescription,
					articleUrl: data.tweets[i].articleUrl,
					teaserImageUrl: teaserImageUrl,
					stuffImageUrlForBigImage : stuffImageUrlForBigImage,
					// articleAuthor: data.tweets[i].articleAuthor,
					articleGuid: data.tweets[i].articleGuid,
					articlePublicationDate: data.tweets[i].articleAuthor, //author field has formatted date so using it
					articleImportedToTopNewsDate: data.tweets[i].articleImportedToTopNewsDate,
					
				}
				setTweets(prevArray => [...prevArray, obj])
				setDisable(false);	
				setInfoMessage(true);
				
              }
		} 
		else if(data.status === 'error'){
			setDisable(false);
			setErrormessage(data.errormessage);
			
		}
	}
	
    const handleReadFastClick = () => {
        setIsReadFastOn((prevToggle) => !prevToggle);
    };
	
	return (
		<div className='tweetdiv'>
		<div className='header'>
			<h1 className='maintitle'>NEWS EXPRESS</h1>
			{/* <h2 className='mainsubtitle'>Find new Tweet inspiration by analysing user's last few Tweets, and write new Tweets with AI in the same style.</h2> */}
			{/* <h5 className='articledateandsourcetop'><span style={{color: `#808080`}}>Just reading #Headlines can keep you up to date about the latest events</span></h5> */}
			{dateTimeOfLastPulltoshow && <h5 className="articledateandsourcetop"><span style={{color: `#808080`}}>{`NEWS on the go. Updated on ${dateTimeOfLastPulltoshow}`}</span></h5>}
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
			{disable && <h6 class='articledateandsourcetop'>Curating NEWS just for you. Please wait..</h6>}
			<br/>
			{/* {disable && <h5><a href="mailto:learn@dictionaryv2.com">Send us feedback at learn@dictionaryv2.com</a></h5>} */}
			{/* <br/> */}

			{/* {handle && <h4 className="mainsubtitle">{`${handle}`}</h4>} */}
			{infoMessage && <GoToTop />}
			{infoMessage && <ReadFast isReadFastOn ={handleReadFastClick}/>}
			</div>

			{tweets.map((article) => {
				return <Card 
				article={article} isReadFastOn={isReadFastOn}  key={(Math.random() + 1).toString(36).substring(7)}
				onChange={setTweets}
				/>
			})}
			 
			{infoMessage &&  <h4 className='mainsubtitleads'>Just reading #Headlines can keep you up to date about the latest events</h4>}
			{infoMessage &&  <h4 className='mainsubtitleads'><a target="_blank" href="newsexpress.co.nz">Curating NEWS from the best sources (STUFF, THE POST, THE PRESS, WAIKATO TIMES, RNZ, NZ HERALD) around NZ</a></h4>}
			{/* React Helmet is a library that helps you deal with search engines and social media crawlers by adding meta tags to your pages/components on React so your site gives more valuable information to the crawlers. */}
			<Helmet>
			{<title>NEWS EXPRESS || Latest NEWS on the go</title>}
			<meta charSet="utf-8" />
			<meta name="google-site-verification" content="cuv79ZIGYHy0-AqvX463h2RqWsQXkWdSM5V2UhEer0Y" />
			</Helmet>

		</div>
		
	)
}

export default Topic

