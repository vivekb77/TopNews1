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

const WorldNews = () => {
	const history = useHistory()
	const [tweets, setTweets] = useState([])
	const [disable, setDisable] = React.useState(false);
	const [disablePlaceholder, setDisablePlaceholder] = React.useState(false);
	const [dateTimeOfLastPulltoshow, setDateTimeOfLastPulltoshow] = React.useState();
	const [errormessage, setErrormessage] = React.useState();
	const [infoMessage, setInfoMessage] = React.useState();
	const [isReadFastOn, setIsReadFastOn] = useState(false);
	
	useEffect(() => {
		GetNews();
		dateTimeOfLastPull();
	  }, [])

//get date time when articles were updated from rss
	async function dateTimeOfLastPull(event) {
	const req = await fetch(`${baseURL}/api/dateTimeOfLastPullWorld`, {
		method: 'GET'
	})
	const dateTimeOfLastPull = await req.json();
	if (dateTimeOfLastPull.status === 'ok') {
		setDisable(false);
		//remove day and append "today"
		// let makedatereadable = dateTimeOfLastPull.dateTimeOfLastPull.slice(6,16);
		// setDateTimeOfLastPulltoshow(handle => "Today"+makedatereadable);
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

		const req = await fetch(`${baseURL}/api/GetNewsForWorld`, {
			method: 'GET'
		}) 

		const data = await req.json()
		if (data.status === 'ok') {
			
			for (let i=0;i<data.tweets.length;i++){ 
				
				const obj = {
					dbid:data.tweets[i]._id,
					articleSource: data.tweets[i].articleSource,
					articleTitle: data.tweets[i].articleTitle,
					articleDescription: data.tweets[i].articleDescription,
					articleUrl: data.tweets[i].articleUrl,
					teaserImageUrl: data.tweets[i].teaserImageUrl,
					// articleAuthor: data.tweets[i].articleAuthor,
					articleGuid: data.tweets[i].articleGuid,
					articlePublicationDate: data.tweets[i].articleAuthor, //author field has formatted date so using it
					articleImportedToTopNewsDate: data.tweets[i].articleImportedToTopNewsDate,
					whichcontinent : "WORLD"
					
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
	const selectCountryNewsNZ = () => {
		history.push('/newzealand-news');
	};
	const selectCountryNewsAU = () => {
		history.push('/australia-uk-news');
	};  
	
	return (
		<div className='tweetdiv'>
			<div className='header'>
				<div className='logoandtitle'>
				<div className="logoimage"></div>    
				<div className="logonameimage"></div>    
				{/* <h1 className='maintitle'>NEWS EXPRESS</h1> */}
				</div>
				
				{dateTimeOfLastPulltoshow && !errormessage && <h5 className="articledateandsourcetop"><span style={{color: `#808080`}}>{`Last updated ${dateTimeOfLastPulltoshow}`}</span></h5>}
				{errormessage && <h4 className="errormessage">{`${errormessage}`}</h4>}
				{disable && <div class="articledateandsourcetoploading-placeholder"></div>}
				
				<div className='countrynewscardholder'>
					<div  className={'countrynewscard'} onClick={(selectCountryNewsNZ)}>
					{  <p className="textofcountrybuttontext">NZ<span style={{color: `#808080`}}></span></p>}
					</div>
					
					<div  className={'countrynewscard'} onClick={(selectCountryNewsAU)}>
					{  <p className="textofcountrybuttontext">AU & UK</p>}
					</div>
					<div  className={'countrynewscardselected'} >
					{  <p className="textofcountrybuttontext">WORLD</p>}
					</div>
				</div>

				{infoMessage && <GoToTop />}
				{infoMessage && <ReadFast isReadFastOn ={handleReadFastClick}/>}
			</div>

			{tweets.map((article) => {
				return <NewsCard 
				article={article} 
				isReadFastOn={isReadFastOn}  
				key={(Math.random() + 1).toString(36).substring(7)}
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

			<div className='bottommenuholder'>
			{infoMessage &&  <h4 className='mainsubtitleads'><a href='https://twitter.com/NewsExpressNZ'>Twitter</a></h4>}
			{infoMessage &&  <h4 className='mainsubtitleads'><a href='mailto:newsexpressnz@gmail.com'>Contact</a></h4>}
			{infoMessage &&  <h4 className='mainsubtitleads'><a href='/terms'>Terms</a></h4>}
			</div>
			<Helmet>
			{<title>NEWS EXPRESS | NEWS on the go | The fastest way to stay updated with latest NZ NEWS | World News</title>}
			<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7452283240439769"
					crossorigin="anonymous"></script>
			</Helmet>

		</div>
		
	)
}

export default WorldNews

