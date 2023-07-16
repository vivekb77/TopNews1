import { useState } from 'react'
require('dotenv').config();


const baseURL = process.env.REACT_APP_BASE_URL

function App() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	

	async function loginUser(event) {
		event.preventDefault()

		const response = await fetch(`${baseURL}/api/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})

		const data = await response.json()

		if (data.user) {
			localStorage.setItem('token', data.user)
			// alert('Login successful')
			window.location.href = '/tweets'
		} else {
			alert('Please check your username and password')
		}
		
		
	
	}

	return (
		<div className='logindiv'>
			<h1>GalaxzAI Login</h1>
			<form onSubmit={loginUser} className="formlogin">
				<input 
				className='emaillogin'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					type="email"
					placeholder="Email"
					required
				/>
				<br />
				<input
				className='emaillogin'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					type="password"
					placeholder="Password"
					required
				/>
				<br />
				<input className='button' type="submit" value="Login" />
				<br/>
				<a rel="noopener noreferrer" href="register">New here! Register</a>
			</form>
		</div>
	)
}

export default App
