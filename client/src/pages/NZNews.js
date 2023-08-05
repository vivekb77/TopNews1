import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import NewsCard from './NewsCard'
import LaptopPlaceholderCard from './LaptopPlaceholderCard'
import MobilePlaceholderCard from './MobilePlaceholderCard'
import GoToTop from './GoToTop'
import ReadFast from './ReadFast';
import GA4React from "ga-4-react";
import { Helmet } from 'react-helmet';
require('dotenv').config();

const ga4react = new GA4React("G-4YQR5FRQQL");
ga4react.initialize().then().catch()

const baseURL = process.env.REACT_APP_BASE_URL

const NZNews = () => {
	const history = useHistory()
	const [tweets, setTweets] = useState([])
	const [disable, setDisable] = React.useState(false);
	const [disablePlaceholder, setDisablePlaceholder] = React.useState(false);
	const [dateTimeOfLastPulltoshow, setDateTimeOfLastPulltoshow] = React.useState();
	const [errormessage, setErrormessage] = React.useState();
	const [infoMessage, setInfoMessage] = React.useState();
	const [isReadFastOn, setIsReadFastOn] = useState(false);
	const [newsCountry, setNewsCountry] = useState(false);

	
	useEffect(() => {
		GetNews();
		dateTimeOfLastPull();
		const params = new URLSearchParams()
		if (newsCountry) {
		  params.append("", newsCountry)
		} else {
		  params.delete("")
		}
		history.push({search: params.toString()})
	  }, [newsCountry, history])

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

	async function GetNews(event) {
		// event.preventDefault()
		setDisable(true);
		setInfoMessage(false);
		setErrormessage(errormessage => "");

		const req = await fetch(`${baseURL}/api/GetNewsForProvider`, {

			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				topictopuflltweets: newsCountry || "PullAllNews",
			}),

		}) 

		const data = await req.json()
		if (data.status === 'ok') {
			
			for (let i=0;i<data.tweets.length;i++){ 
				let stuffImageUrlForBigImage
				let teaserImageUrl
				//images in rss for stuff are not very good so this to modify the url to display high quality images
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
				setDisablePlaceholder(true);	
				setInfoMessage(true);
				
              }
		} 
		else if(data.status === 'error'){
			setDisablePlaceholder(false);
			setErrormessage(data.errormessage);
			
		}
	}
	
    const handleReadFastClick = () => {
        setIsReadFastOn((prevToggle) => !prevToggle);
    };
	const selectCountryNewsAU = () => {
		history.push('/AU');
	  };
	const selectCountryNewsWorld = () => {
	history.push('/World');
	};  
	
	return (
		<div className='tweetdiv'>
			<div className='header'>
				<div className='logoandtitle'>
				<div className="logoimage"></div>      
				<h1 className='maintitle'>NEWS EXPRESS</h1>
				</div>
				
				{dateTimeOfLastPulltoshow && !errormessage && <h5 className="articledateandsourcetop"><span style={{color: `#808080`}}>{`NEWS on the go. The fastest way to stay updated with current affairs. Updated on ${dateTimeOfLastPulltoshow}`}</span></h5>}
				{errormessage && <h4 className="errormessage">{`${errormessage}`}</h4>}
				{disable && <h6 class='articledateandsourcetop'>Curating NEWS just for you. Please wait..</h6>}
				
				<div className='countrynewscardholder'>
					<div  className={'countrynewscardselected'} >
					{  <p className="card-text">NZ<span style={{color: `#808080`}}></span></p>}
					</div>
					
					<div  className={'countrynewscard'} onClick={(selectCountryNewsAU)} >
					{  <p className="card-text">AU</p>}
					</div>
					<div  className={'countrynewscard'} onClick={(selectCountryNewsWorld)} >
					{  <p className="card-text">WORLD</p>}
					</div>
				</div>

				{infoMessage && <GoToTop />}
				{infoMessage && <ReadFast isReadFastOn ={handleReadFastClick}/>}
			</div>

			{tweets.map((article) => {
				return <NewsCard 
				article={article} isReadFastOn={isReadFastOn}  key={(Math.random() + 1).toString(36).substring(7)}
				onChange={setTweets}
				/>
			})}

			{!disablePlaceholder &&<div className='laptopplaceholderdiv'>
			<LaptopPlaceholderCard/>
			<LaptopPlaceholderCard/>
			<LaptopPlaceholderCard/>
			<LaptopPlaceholderCard/>
			</div>}
			
			{!disablePlaceholder && <div className='mobileplaceholderdiv'>
			<MobilePlaceholderCard/>
			<MobilePlaceholderCard/>
			<MobilePlaceholderCard/>
			<MobilePlaceholderCard/>
			</div>}

			{infoMessage &&  <h4 className='mainsubtitleads'>The fastest way for you to stay updated with current affairs</h4>}
			{infoMessage &&  <h4 className='mainsubtitleads'>Selected latest and best news from multiple national sources (STUFF, THE POST, THE PRESS, WAIKATO TIMES, RNZ, NZ HERALD)</h4>}
			{infoMessage &&  <h4 className='mainsubtitleads'><a href='mailto:dictionaryv2@gmail.com'>Contact</a></h4>}
			
			<Helmet>
			{/* {<title>NEWS EXPRESS || Latest NEWS on the go</title>}
			<meta charSet="utf-8" /> */}
			</Helmet>

		</div>
		
	)
}

export default NZNews

