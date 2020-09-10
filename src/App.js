// React
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// Components
import HeaderLoggedOut from './components/pages/layout/HeaderLoggedOut';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Movie from './components/pages/Movie';

// CSS
import './css/main.css';

const App = () =>
{
	return (
		<BrowserRouter>
			<HeaderLoggedOut />
			<Switch>
				<Route exact path='/about' component={About} />
				<Route exact path='/movie/:id' component={Movie} />
				<Route path='/' component={Home} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;