import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import AdminCard from './AdminCard'
import ReactGA from 'react-ga';
require('dotenv').config();

const baseURL = process.env.REACT_APP_BASE_URL

const Admin = () => {
	const history = useHistory()
	const [admin, setAdmin] = useState([])
	const [twitterUserID, settwitterUserID] = useState('')
	const [disable, setDisable] = React.useState(false);
	const [handle, setHandle] = React.useState();
	const [length, setLength] = React.useState();
	const [errormessage, setErrormessage] = React.useState();

	


	// useEffect(() => {
	// 	const token = localStorage.getItem('token')
		
	// 	// https://mudit.hashnode.dev/5-things-you-should-know-about-useeffect
	// 	if (token) {
	// 		const user = jwt.decode(token)
	// 		if (!user) {
	// 			console.log('no user')
	// 			localStorage.removeItem('token')
	// 			history.replace('/login')
				
	// 		} else {
	// 			// populateQuote()do something //cleanup function
	// 			// console.log('user is ', user)
	// 		}
	// 	}else{
	// 		history.replace('/login')
	// 	}

	// },[])

	async function Admin(event) {
		event.preventDefault()
		setDisable(true);
		setAdmin(admin => []);
		setLength(length => "");
		setHandle(handle => "");
		setErrormessage(errormessage => "");

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
			setLength(length => "");
			setHandle(handle => "");

		for (let i=0;i<data.AdminArray.length;i++){ 
		
			setAdmin(prevArray => [...prevArray, data.AdminArray[i]])
			setDisable(false);
		}
		setLength(length => data.AdminArray.length);


		ReactGA.event({
			category: 'Admin',
			action: 'Admin Page Viewed'
		  });
	}  
		else if(data.status === 'error'){
			setDisable(false);
			setErrormessage(errormessage => data.error);
			ReactGA.exception({
				description: 'An error ocurred on Admin page',
				fatal: true
			  });
		}
	}

	const handleClick = event => {

		console.log('button disabled');
	  };

	return (
		<div className='tweetdiv'>
		<div className='header'>
			<h1 className='maintitle'>GALAXZ AI</h1>
			<h2 className='mainsubtitle'>Admin</h2>
			 {errormessage && <h4 className="errormessage">{`${errormessage}`}</h4>}

			<form onSubmit={Admin}>
				{/* <input
					type="text"
					className='userIdTextBox'
					maxLength={70}
					required
					placeholder="Twitter User handle without @"
					onChange={(e) => settwitterUserID(e.target.value)}
				/> */}
				
				<input type="submit" className='button' value={disable ? `Analysing...` : `Get Analysis` } disabled={disable}/>
				
			</form>
			{length && <h4 className="mainsubtitle">{`Total records - ${length}`}</h4>}
			<br/>
			<br/>
			{admin.map((admin,index) => {
				return <AdminCard 
				admin={admin}  key={index}
				onChange={setAdmin}
				/>
			})}

			</div>
		</div>
	)
}

export default Admin

