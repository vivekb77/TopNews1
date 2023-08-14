import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import CurateCard from './CurateCard'
import { Helmet } from 'react-helmet';
import GA4React from "ga-4-react";
import NewsProvidersCard from './NewsProvidersCard'
import GoToTop from './GoToTop'
require('dotenv').config();

const ga4react = new GA4React("G-4YQR5FRQQL");
ga4react.initialize().then().catch()

const baseURL = process.env.REACT_APP_BASE_URL
 
const Curate = () => {
	const history = useHistory()
	const [news, setNews] = useState([])
	const [providerName, setProviderName] = useState('')
	const [disable, setDisable] = React.useState(true);
	const [selectedProvider, setSelectedProvider] = React.useState();
	const [errormessage, setErrormessage] = React.useState();
	const [providers, setProviders] = useState([]);
	const [buttondisable, setButtondisable] = React.useState(false);

	useEffect(() => {
		const token = localStorage.getItem('token')

		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				console.log('no user')
				localStorage.removeItem('token')
				history.replace('/login')
			} else {
				SetProviders();
			}
		}else{
			history.replace('/login')
		}

	},[])

	async function SetProviders(event) {
		setProviders(providers => []);
		setProviders(prevArray => [...prevArray, 'NZ', 'AU', 'WORLD'])
	}


	async function GetNews(event) {
		event.preventDefault()
		setButtondisable(true);
		setNews(news => []);
		setErrormessage(errormessage => "");
		setDisable(true);

		const req = await fetch(`${baseURL}/api/curateNews`, {

			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				providerToPullNews: providerName,
			}),

		})

		const data = await req.json()
		if (data.status === 'ok') {

			for (let i = 0; i < data.news.length; i++) {

				let stuffImageUrlForBigImage
				let teaserImageUrl
				//images in rss for stuff are not very good so this to modify the url to display high quality images
				if(data.news[i].articleSource === "STUFF"){
					const teaserImageUrlSpliturlArray = data.news[i].teaserImageUrl.split(".");
					let teaserImageUrlSpliturlArraySliced = teaserImageUrlSpliturlArray.slice(0,4);
					stuffImageUrlForBigImage = `${teaserImageUrlSpliturlArraySliced.join(".")}.related.StuffLandscapeSixteenByNine.1420x800.${teaserImageUrlSpliturlArray[7]}.${teaserImageUrlSpliturlArray[8]}.jpg?format=pjpg&optimize=medium`;
					teaserImageUrl = ""
				}
				else{
					teaserImageUrl = data.news[i].teaserImageUrl;
					stuffImageUrlForBigImage = "";
				}

				const obj = {
					dbid:data.news[i]._id,
					displayOnFE:data.news[i].displayOnFE,
					articleSource: data.news[i].articleSource,
					articleTitle: data.news[i].articleTitle,
					articleDescription: data.news[i].articleDescription,
					articleUrl: data.news[i].articleUrl,
					teaserImageUrl: teaserImageUrl,
					stuffImageUrlForBigImage : stuffImageUrlForBigImage,
					// articleAuthor: data.news[i].articleAuthor,
					articleGuid: data.news[i].articleGuid,
					articlePublicationDate: data.news[i].articleAuthor, //author field has formatted date so using it
					articleImportedToTopNewsDate: data.news[i].articleImportedToTopNewsDate,
					
				}
				setNews(prevArray => [...prevArray, obj])
				setButtondisable(false);
				setDisable(false);
				setSelectedProvider(selectedProvider =>providerName );
			}

		}
		else if (data.status === 'error') {
			setDisable(false);
			setButtondisable(false);
			setErrormessage(userName => data.error);
		}
	}

	const chooseProvider = (providerName) => {
		setDisable(false);
		setProviderName(providerName); // id passed back from chile component
	};

	return (
		<div className='tweetdiv'>
			<div className='header'>

				<div className='logoandtitle'>
					<div className="logoimage"></div>    
					<div className="logonameimage"></div>    
				</div>
				{/* <h1 className='mainsubtitle'>ADMIN</h1> */}
				{errormessage && <h4 className="errormessage">{`${errormessage}`}</h4>}
				{/* {selectedProvider && <h5 className="card-text">{`Curate NEWS for ${selectedProvider}`}</h5>} */}

				<div className='listnewsprovidercardholder'>
					{providers.map((providers, index,) => {
						return <NewsProvidersCard
							providers={providers} key={index} chooseProvider={chooseProvider}
						/>
					})}
				</div>

				<form onSubmit={GetNews}>
					<input type="submit" className='getnewstocuratebutton' value={buttondisable ? `Getting...` : `Get NEWS`} disabled={disable} />
				</form>
			</div>

			{buttondisable && <h6>Pulling Articles...Please wait..</h6>}
			
			{news.map((news) => {
				return <CurateCard 
				article={news} isReadFastOn={true} whichcontinent={selectedProvider}  key={(Math.random() + 1).toString(36).substring(7)}
				onChange={setNews}
				/>
			})}
			{!disable && <GoToTop />}	
			<Helmet>
			{<title>NEWS EXPRESS | NEWS on the go | The fastest way to stay updated with latest NZ NEWS | Curate</title>}
			</Helmet>

		</div>
	)

}

export default Curate
