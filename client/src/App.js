import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
// import Login from './pages/Login'
// import Register from './pages/Register'
import Tweets from './pages/Tweets'
import AITweets from './pages/AITweets'
import Curate from './pages/Curate'
import Topic from './pages/Topic'
import Examples from './pages/Examples'
import Admin from './pages/Admin'

import GA4React from "ga-4-react";

// const ga4react = new GA4React("G-4YQR5FRQQL");
// ga4react.initialize().then().catch()


const App = () => {
	return (
		<div className='maindiv'>
			<BrowserRouter>
				{/* <Route path="/login" exact component={Login} /> */}
				{/* <Route path="/register" exact component={Register} /> */}
				{/* <Route path="/pulltweets" exact component={Tweets} />
				<Route path="/handle" exact component={AITweets} /> */}
				<Route path="/" exact component={Topic} />
				{/* <Route path="/curate" exact component={Curate} /> */}

				{/* <Route path="/admin" exact component={Admin} /> */}
				{/* <Route path="/examples" exact component={Examples} /> */}
			</BrowserRouter>
		</div>
	)
}

export default App