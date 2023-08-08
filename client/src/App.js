import React from 'react'
import { BrowserRouter as Router ,Switch, Route} from 'react-router-dom'

import NZNews from './pages/NZNews'
import AUNews from './pages/AUNews'
import WorldNews from './pages/WorldNews'
import NotFoundPage from './pages/404'

const App = () => {
	return (
		<div className='maindiv'>
			<Router>
				<Switch>
					<Route path="/" exact component={NZNews} />
					<Route path="/newzealand-news" exact component={NZNews} />
					<Route path="/australia-uk-news" exact component={AUNews} />
					<Route path="/world-news" exact component={WorldNews} />
					<Route component={NotFoundPage} />
				</Switch>
			</Router>
		</div>
	)
}

export default App