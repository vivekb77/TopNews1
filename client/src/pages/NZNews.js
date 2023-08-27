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
import RockPaper from './RockPaper'
require('dotenv').config();

const ga4react = new GA4React("G-4YQR5FRQQL");
ga4react.initialize().then().catch()

const baseURL = process.env.REACT_APP_BASE_URL

const NZNews = () => {
	const history = useHistory()
	const [news, setNews] = useState([])
	const [notNews, setNotNews] = useState([])
	const [disable, setDisable] = React.useState(false);
	const [disablePlaceholder, setDisablePlaceholder] = React.useState(false);
	const [dateTimeOfLastPulltoshow, setDateTimeOfLastPulltoshow] = React.useState();
	const [errormessage, setErrormessage] = React.useState();
	const [infoMessage, setInfoMessage] = React.useState();
	const [isReadFastOn, setIsReadFastOn] = useState(false);
	const [newsLoaded, setNewsLoaded] = useState(false);
	const [notNewsLoaded, setNotNewsLoaded] = useState(false);


	useEffect(() => {
		GetNews();
		dateTimeOfLastPull();
		GetNotNews();
	}, []);

	useEffect(() => {
		if (newsLoaded && notNewsLoaded) {
			MergeNewsAndNotNews();
			// console.log("merge news + notnews triggered")
		} else {
			// console.log("merge news + notnews NOT triggered")
		}
	}, [newsLoaded, notNewsLoaded]);

	//get date time when articles were updated from rss
	async function dateTimeOfLastPull(event) {
		const req = await fetch(`${baseURL}/api/dateTimeOfLastPullNZ`, {
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
			//remove day and append "Today"
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
		setNewsLoaded(false);

		const req = await fetch(`${baseURL}/api/GetNewsForNZ`, {

			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				topictopuflltweets: "PullAllNews",
			}),

		})
		const newsArray = [];
		const data = await req.json()
		if (data.status === 'ok') {

			for (let i = 0; i < data.tweets.length; i++) {
				let stuffImageUrlForBigImage
				let teaserImageUrl
				//images in rss for stuff are not very good so this to modify the url to display high quality images
				if (data.tweets[i].articleSource === "STUFF") {
					const teaserImageUrlSpliturlArray = data.tweets[i].teaserImageUrl.split(".");
					let teaserImageUrlSpliturlArraySliced = teaserImageUrlSpliturlArray.slice(0, 4);
					stuffImageUrlForBigImage = `${teaserImageUrlSpliturlArraySliced.join(".")}.related.StuffLandscapeSixteenByNine.1420x800.${teaserImageUrlSpliturlArray[7]}.${teaserImageUrlSpliturlArray[8]}.jpg?format=pjpg&optimize=medium`;
					teaserImageUrl = ""
				}
				else {
					teaserImageUrl = data.tweets[i].teaserImageUrl;
					stuffImageUrlForBigImage = "";
				}

				const obj = {
					dbid: data.tweets[i]._id,
					articleSource: data.tweets[i].articleSource,
					articleTitle: data.tweets[i].articleTitle,
					articleDescription: data.tweets[i].articleDescription,
					articleUrl: data.tweets[i].articleUrl,
					teaserImageUrl: teaserImageUrl,
					stuffImageUrlForBigImage: stuffImageUrlForBigImage,
					// articleAuthor: data.tweets[i].articleAuthor,
					articleGuid: data.tweets[i].articleGuid,
					articlePublicationDate: data.tweets[i].articleAuthor, //author field has formatted date so using it
					articleImportedToTopNewsDate: data.tweets[i].articleImportedToTopNewsDate,
					whichcontinent : "NZ"

				}
				newsArray.push(obj);
			}
			setNews(newsArray)
			setDisablePlaceholder(true);
			setInfoMessage(true);
			setNewsLoaded(true)

		}
		else if (data.status === 'error') {
			setDisablePlaceholder(false);
			setErrormessage(data.errormessage);
		}
	}

	async function GetNotNews(event) {
		setNotNewsLoaded(false)
		const req = await fetch(`${baseURL}/api/GetNotNews`, {

			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				topictopufllnews: "PullAllNews",
			}),

		})


		const data = await req.json()
		if (data.status === 'ok') {
			const notNewsArray = [];
			for (let i = 0; i < data.notnews.length; i++) {

				const obj = {
					dbid: data.notnews[i]._id,
					articleSource: data.notnews[i].articleSource,
					articleTitle: data.notnews[i].articleTitle,
					articleUrl: data.notnews[i].articleUrl,
					articleGuid: data.notnews[i].articleGuid,
					articlePublicationDate: data.notnews[i].articleAuthor, //author field has formatted date so using it
					articleImportedToTopNewsDate: data.notnews[i].articleImportedToTopNewsDate,
					whichcontinent : "NOTNEWS"
				}
				notNewsArray.push(obj);
			}
			setNotNews(notNewsArray)
			setNotNewsLoaded(true)
		}
		else if (data.status === 'error') {
			//if not news is not loaded who gives a fuck
		}
	}

	const MergeNewsAndNotNews = () => {
		let newsplusnotnewsarray = [...news];
		for (let i = 0; i < notNews.length; i++) {
			newsplusnotnewsarray.splice((i * 4), 0, notNews[i]);
		}
		setNews(newsplusnotnewsarray);
		// console.log(notNews)
	};


	const handleReadFastClick = () => {
		setIsReadFastOn((prevToggle) => !prevToggle);
	};

	const selectCountryNewsAU = () => {
		history.push('/australia-uk-news');
	};
	const selectCountryNewsWorld = () => {
		history.push('/world-news');
	};

	return (
		<div className='tweetdiv'>
			<div className='header'>
				<div className='logoandtitle'>
					<div className="logoimage"></div>
					<div className="logonameimage"></div>
					{/* <h1 className='maintitle'>NEWS EXPRESS</h1> */}
				</div>

				{errormessage && <h5 className="articledateandsourcetop"><span style={{ color: `#808080` }}>{`The fastest way to stay updated with current affairs.`}</span></h5>}
				{dateTimeOfLastPulltoshow && !errormessage && <h5 className="articledateandsourcetop"><span style={{ color: `#808080` }}>{`Last updated ${dateTimeOfLastPulltoshow}`}</span></h5>}
				{errormessage && <h4 className="errormessage">{`${errormessage}`}</h4>}
				{disable && <div class="articledateandsourcetoploading-placeholder"></div>}

				<div className='countrynewscardholder'>
					<div className={'countrynewscardselected'} >
						{<p className="textofcountrybuttontext">NZ<span style={{ color: `#808080` }}></span></p>}
					</div>

					<div className={'countrynewscard'} onClick={(selectCountryNewsAU)} >
						{<p className="textofcountrybuttontext">AU & UK</p>}
					</div>
					<div className={'countrynewscard'} onClick={(selectCountryNewsWorld)} >
						{<p className="textofcountrybuttontext">WORLD</p>}
					</div>
				</div>
				
				{infoMessage && <GoToTop />}
				{infoMessage && <ReadFast isReadFastOn={handleReadFastClick} />}
			</div>

			{news.map((article) => {
				return <NewsCard
					article={article} 
					isReadFastOn={isReadFastOn} 
					key={(Math.random() + 1).toString(36).substring(7)}
					onChange={setNews}
				/>
			})}

			{!disablePlaceholder && <div className='laptopplaceholderdiv'>
				<LaptopPlaceholderCard />
				<LaptopPlaceholderCard />
				<LaptopPlaceholderCard />
				<LaptopPlaceholderCard />
			</div>}

			{!disablePlaceholder && <div className='mobileplaceholderdiv'>
				<MobilePlaceholderCard />
				<MobilePlaceholderCard />
				<MobilePlaceholderCard />
				<MobilePlaceholderCard />
			</div>}
			{infoMessage && <RockPaper />}
			<div className='bottommenuholder'>
				{infoMessage && <h4 className='mainsubtitleads'><a href='https://twitter.com/NewsExpressNZ'>Twitter</a></h4>}
				{infoMessage && <h4 className='mainsubtitleads'><a href='mailto:newsexpressnz@gmail.com'>Contact</a></h4>}
				{infoMessage && <h4 className='mainsubtitleads'><a href='/terms'>Terms</a></h4>}
			</div>
			<Helmet>
				{<title>NEWS EXPRESS | NEWS on the go | The fastest way to stay updated with latest NZ NEWS | NZ News</title>}
			</Helmet>

		</div>

	)
}

export default NZNews

