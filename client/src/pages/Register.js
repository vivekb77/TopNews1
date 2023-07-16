import { useState } from 'react'
import { useHistory } from 'react-router-dom'
require('dotenv').config();


const baseURL = process.env.REACT_APP_BASE_URL

function App() {
	const history = useHistory()

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	//this funtion is communicating with backend
	async function registerUser(event) {
		event.preventDefault() // to prevent page refresh on submit as form is inside div

		//this funtion is communicating with backend
		//server folder , index.js file has this route /api/register
		const response = await fetch(`${baseURL}/api/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				email,
				password,
			}),
		})

		const data = await response.json() //response from server will be ok or error

		if (data.status === 'ok') {
			history.push('/login') // if response is ok then redirect to login page
		}
		else {
			alert('You are already registered! Login now')
		}
	}

	return (
		<div className='registerdiv'>
			<h1>GalaxzAI Register</h1>
			<form className='registerform' onSubmit={registerUser}>
				<input className='registerinput'
				required
					value={name}
					onChange={(e) => setName(e.target.value)}
					type="text"
					placeholder="Name"
				/>
				<br />
				<input className='registerinput'
				required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					type="email"
					placeholder="Email"
				/>
				<br />
				<input className='registerinput'
				required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					type="password"
					placeholder="Password"
				/>
				<br />
				<input className='button' type="submit" value="Register" />
				<br/>
				<a rel="noopener noreferrer" href="login">Already User! Login</a>
			</form>
		</div>
	)
}

export default App
