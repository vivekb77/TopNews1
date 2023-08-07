import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import NZNews from './pages/NZNews'
import AUNews from './pages/AUNews'
import WorldNews from './pages/WorldNews'

const App = () => {
	return (
		<div className='maindiv'>
			<BrowserRouter>
				<Route path="/" exact component={NZNews} />
				<Route path="/newzealand-news" exact component={NZNews} />
				<Route path="/australia-uk-news" exact component={AUNews} />
				<Route path="/world-news" exact component={WorldNews} />
			</BrowserRouter>
		</div>
	)
}

export default App