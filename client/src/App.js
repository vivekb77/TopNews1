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
				<Route path="/NZ" exact component={NZNews} />
				<Route path="/AU" exact component={AUNews} />
				<Route path="/WORLD" exact component={WorldNews} />
			</BrowserRouter>
		</div>
	)
}

export default App