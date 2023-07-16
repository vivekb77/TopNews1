import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import Card from './Card'
import ReactGA from 'react-ga';
import { Helmet } from 'react-helmet';
import AdminCard from './AdminCard'
import TopicCard from './TopicCard'
require('dotenv').config();

ReactGA.event({
	category: 'Curate',
	action: 'Curate page viewed'
  });

const baseURL = process.env.REACT_APP_BASE_URL

const Curate = () => {
	const history = useHistory()
	const [tweets, setTweets] = useState([])
	const [twitterUserID, settwitterUserID] = useState('')
	const [disable, setDisable] = React.useState(true);
	const [handle, setHandle] = React.useState();
	const [userName, setUserName] = React.useState();
	const [errormessage, setErrormessage] = React.useState();
	const [admin, setAdmin] = useState([]);
	const [topic, setTopic1] = useState([]);
	const [tagtopullTweets, setTagtopullTweets] = useState('')
	const [disable1, setDisable1] = React.useState(true);
	const [buttondisable, setButtondisable] = React.useState(false);
	const [buttondisable1, setButtondisable1] = React.useState(false);
	const [tokens, setTokens] = useState([])

	// },[])
	useEffect(() => {
		Admin();
		const params = new URLSearchParams()
		if (handle) {
		  params.append("h", handle)
		} else {
		  params.delete("h")
		}
		history.push({search: params.toString()})
	  }, [handle, history])

	async function Admin(event) {
		
		// setAdmin(admin => []);


		const req = await fetch(`${baseURL}/api/admin`, {

			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				// tweeterUserHadleToPullTweets: twitterUserID,
			}),

		})

		const data = await req.json()
		if (data.status === 'ok') {

			setAdmin(admin => []); //clear them first
			setTopic1(topic => []); //clear them first
			setTokens(tokens => data.tokensused);

		for (let i=0;i<data.AdminArray.length;i++){ 
		
			setAdmin(prevArray => [...prevArray, data.AdminArray[i]])
			
		}

		for (let z=0;z<data.TopicArray.length;z++){ 
		
			setTopic1(prevArray => [...prevArray, data.TopicArray[z]])
			
		}
		
		setDisable(true);
		setDisable1(true);
	} }   


	async function GetTweets(event) {
		event.preventDefault()
		setButtondisable(true);
		setTweets(tweets => []);
		setUserName(userName => "");
		setHandle(handle => "");
		setErrormessage(errormessage => "");

		const req = await fetch(`${baseURL}/api/curate`, {

			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				tweeterUserHadleToPullTweets: twitterUserID,
				topicToPullTweets:"null"
			}),

		})

		const data = await req.json()
		if (data.status === 'ok') {
			// console.log('data is ', data)
			for (let i=0;i<data.tweets.length;i++){ 

				const obj = {
					dbid:data.tweets[i]._id,
					tweetID: data.tweets[i].tweetID,
					tweet: data.tweets[i].tweet,
					TwitteruserFullName: data.tweets[i].TwitteruserFullName,
					TwitteruserName: data.tweets[i].TwitteruserName,
					impression_count: data.tweets[i].impression_count,
					like_count: data.tweets[i].like_count,
					reply_count: data.tweets[i].reply_count,
					quote_count: data.tweets[i].quote_count,
					retweet_count: data.tweets[i].retweet_count,
					tag: data.tweets[i].tag,
					CreatedDate: data.tweets[i].CreatedDate,

					
					
				}

				setTweets(prevArray => [...prevArray, obj])
				setButtondisable(false);
				setHandle(handle => data.tweets[0].TwitteruserName);
				setUserName(userName => data.tweets[0].TwitteruserFullName);

				
              }
			 
		} 
		else if(data.status === 'error'){
			setDisable(false);
			setErrormessage(userName => data.error);
			ReactGA.exception({
				description: 'An error ocurred on Curate page',
				fatal: true
			  });
		}
	}
	

	
	async function GetTopicTweets(event) {
	event.preventDefault()
	setButtondisable1(true);
	setTweets(tweets => []);
	setHandle(handle => "");
	setErrormessage(errormessage => "");

	const req = await fetch(`${baseURL}/api/curate`, {

		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': localStorage.getItem('token'),
		},
		body: JSON.stringify({
			tweeterUserHadleToPullTweets: "null",
			topicToPullTweets:tagtopullTweets
		}),

	})

	const data = await req.json()
	if (data.status === 'ok') {
		// console.log('data is ', data)
		for (let i=0;i<data.tweets.length;i++){ 

			const obj = {
				dbid:data.tweets[i]._id,
				tweetID: data.tweets[i].tweetID,
				tweet: data.tweets[i].tweet,
				TwitteruserFullName: data.tweets[i].TwitteruserFullName,
				TwitteruserName: data.tweets[i].TwitteruserName,
				impression_count: data.tweets[i].impression_count,
				like_count: data.tweets[i].like_count,
				reply_count: data.tweets[i].reply_count,
				quote_count: data.tweets[i].quote_count,
				retweet_count: data.tweets[i].retweet_count,
				tag: data.tweets[i].tag,
				CreatedDate: data.tweets[i].CreatedDate,

				
				
			}

			setTweets(prevArray => [...prevArray, obj])
			setButtondisable1(false);
			setHandle(handle => data.tweets[0].tag);
			setUserName(userName => data.tweets[0].tag);

			
			}
			ReactGA.event({
			category: 'Curate',
			action: 'Curate page used'
			});
	} 
	else if(data.status === 'error'){
		setDisable(false);
		setErrormessage(userName => data.error);
		ReactGA.exception({
			description: 'An error ocurred on Tweets page',
			fatal: true
			});
	}
	}

	const chooseTopic = (topictopull) => {
		setDisable1(false);
		setTagtopullTweets(topictopull); // id passed back from chile component
	};
	const chooseHandle = (twitterUserID) => {
		setDisable(false);
		settwitterUserID(twitterUserID); // id passed back from chile component
	};
	
	  return (
		<div className='tweetdiv'>
		<div className='header'>
			<h1 className='maintitle'>GALAXZ AI - ADMIN CURATE</h1>
			{/* <h2 className='mainsubtitle'>Analyse user's last few Tweets, and write new Tweets in the same style</h2> */}
			 {errormessage && <h4 className="errormessage">{`${errormessage}`}</h4>}

			 <h2 className='mainsubtitle'><a href="/pulltweets">Pull Tweets here</a></h2>
			 
			 {!disable1 && <h6>Pulling Twitter users...Please wait..</h6>}
			{tokens && <h6>Total Tokens used - {tokens}</h6>}

			 <div className='admincardmain'>
			 {admin.map((admin,index,) => {
				return <AdminCard 
				admin={admin}  key={index} chooseHandle={chooseHandle} handleortag={"handle"}
				// onChange={setAdmin}
				/>
			})}
			</div>


			

			
			<form onSubmit={GetTweets}>
				{/* <input
					type="text"
					className='userIdTextBox'
					maxLength={70}
					// required
					placeholder="Twitter User handle without @"
					onChange={(e) => settwitterUserID(e.target.value)}
				/> */}
				
				<input type="submit" className='button' value={buttondisable ? `Getting...` : `Get User Tweets` } disabled={disable}/>
				
			</form>
		<br/>
			<div className='admincardmain'>
			 {topic.map((topic,index,) => {
				return <TopicCard 
				topic={topic}  key={index} chooseTopic={chooseTopic}
				// onChange={setAdmin}
				/>
			})}
			</div>

			<form onSubmit={GetTopicTweets}>
				
				<input type="submit" className='button' value={buttondisable1 ? `Getting...` : `Get Topic Tweets` } disabled={disable1}/>
				
			</form>

			{/* {disable && <h6>Analysis and new Tweet genaration may take few seconds..Please wait..</h6>} */}
			<br/>
			{/* {disable && <h5><a href="mailto:learn@dictionaryv2.com">Send us feedback at learn@dictionaryv2.com</a></h5>} */}
			<br/>
				{/* <h4>Need a similar report (on 500 Tweets) for any Twitter account? <a href="mailto:learn@dictionaryv2.com">Email us at learn@dictionaryv2.com</a></h4> */}
			{/* {handle && <h6><a href="mailto:learn@dictionaryv2.com">Send us feedback at learn@dictionaryv2.com</a></h6>} */}
			{handle && <h4 className="mainsubtitle">{`@${handle} (${userName})`}</h4>}
			</div>
			{/* {handle && <h6>Sorted by Likes/Views%</h6>} */}

			{tweets.map((tweet,index) => {
				return <Card 
				tweet={tweet}  key={index}
				onChange={setTweets}
				/>
			})}
			{handle &&  <h4 className='mainsubtitleads'><a target="_blank" href="mailto:learn@dictionaryv2.com">We CREATE a custom AI model on your/any account's Tweets, to generate high quality Tweets like you/them. Click to send us email</a></h4>}
			{handle &&  <h2 className='mainsubtitleads'><a target="_blank" href="http://tweethunter.io/?via=vivek">To BUILD & MONETIZE YOUR TWITTER AUDIENCE... FAST. Click here.</a></h2>}
			{handle &&  <h2 className='mainsubtitleads'><a target="_blank" href="https://twitter.com/galaxz_AI">Follow us on Twitter</a></h2>}
		
		<Helmet>
          {handle && <title>{`GALAXZAI @${handle}`}</title>}
		  <meta charSet="utf-8" />
		</Helmet>

		</div>
	)
}

export default Curate

