import React, { useEffect, useState } from 'react'
// import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import Card from './Card'
import ReactGA from 'react-ga';
import NavBar from './Navbar';
import { Helmet } from 'react-helmet';


require('dotenv').config();


const baseURL = process.env.REACT_APP_BASE_URL


const Examples = () => {
	// const history = useHistory()
	const [tweets, setTweets] = useState([])
	// const [twitterUserID, settwitterUserID] = useState('')
	const [disable, setDisable] = React.useState(false);
	const [handle, setHandle] = React.useState("");
	const [userName, setUserName] = React.useState();
	const [errormessage, setErrormessage] = React.useState();
	const history = useHistory()

	// useEffect(() => {
	// 	// const token = localStorage.getItem('token')
		
	// 	GetTweets();
	// 	// if (token) {
	// 	// 	const user = jwt.decode(token)
	// 	// 	if (!user) {
	// 	// 		console.log('no user')
	// 	// 		localStorage.removeItem('token')
	// 	// 		history.replace('/login')
				
	// 	// 	} else {
	// 	// 		// populateQuote()do something
	// 	// 		// console.log('user is ', user)
	// 	// 	}
	// 	// }else{
	// 	// 	history.replace('/login')
	// 	// }

	// }), []

	//update the url after every new handle
	useEffect(() => {
		const params = new URLSearchParams()
		if (handle) {
		  params.append("h", handle)
		} else {
		  params.delete("h")
		}
		history.push({search: params.toString()})
	  }, [handle, history])


	async function GetTweets(event) {
		event.preventDefault()
		setDisable(true);
		setErrormessage(errormessage => "");
		
		const req = await fetch(`${baseURL}/api/examples`, {
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

				setTweets(tweets => []); //clear them first
				setUserName(userName => "");
				setHandle(handle => "");

			for (let i=0;i<data.tweets.AllAboutTweetsArray.length;i++){ 

				const obj = {
					tweetID: data.tweets.AllAboutTweetsArray[i].tweetID,
					tweet: data.tweets.AllAboutTweetsArray[i].tweet,
					tweetSentiment: data.tweets.AllAboutTweetsArray[i].tweetSentiment,
					impression_count: data.tweets.AllAboutTweetsArray[i].impression_count,
					like_count: data.tweets.AllAboutTweetsArray[i].like_count,
					reply_count: data.tweets.AllAboutTweetsArray[i].reply_count,
					quote_count: data.tweets.AllAboutTweetsArray[i].quote_count,
					retweet_count: data.tweets.AllAboutTweetsArray[i].retweet_count,
					newtweet: data.tweets.AllAboutTweetsArray[i].newtweet,
					TwitteruserFullName: data.tweets.AllAboutTweetsArray[i].TwitteruserFullName,
					TwitteruserName: data.tweets.TwitteruserName,
					
				}
				

				setTweets(prevArray => [...prevArray, obj])
				
            }
				setHandle(handle => data.tweets.TwitteruserName);
				
				
				setUserName(userName => data.tweets.AllAboutTweetsArray[0].TwitteruserFullName);
				setDisable(false);
				

			ReactGA.event({
				category: 'Examples',
				action: 'An Example Viewed'
			  });
		} 
		else if(data.status === 'error'){
			setDisable(false);
			setErrormessage(userName => data.error);
			ReactGA.exception({
				description: 'An error ocurred on examples page',
				fatal: true
			  });
			
		}
		
		

		  
	}

	

	return (
		
		<div className='tweetdiv'>
			{/* <NavBar sticky="top" /> */}
		<div className='header'>
			<br/>
			<h1 className='maintitle'>GALAXZ AI</h1>
			<h2 className='mainsubtitle'>Analyse user's last few Tweets, and write new Tweets in the same style</h2>
			 {errormessage && <h4 className="errormessage">{`${errormessage}`}</h4>}
			<form onSubmit={GetTweets}>
			
				
				<input type="submit" className='button' value={disable ? `      Analysing...      ` : `  Show  Examples   ` } disabled={disable}/>
				
			</form>
			{disable && <h6>Analysis and new Tweet genaration may take few seconds..Please wait..</h6>}
			{!disable && <h6>Click again to see another example</h6>}
			{/* {!handle && <h6>Please wait..</h6>} */}
			{/* <h4>Need a similar report (on 500 Tweets) for any Twitter account? <a href="mailto:learn@dictionaryv2.com">Email us at learn@dictionaryv2.com</a></h4> */}
			
			<h2 className='mainsubtitle'><a href="/tweets">Analyse other Twitter accounts here</a></h2>
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

export default Examples

