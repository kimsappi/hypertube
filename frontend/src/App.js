// React
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// Components
import HeaderLoggedOut from './components/pages/layout/HeaderLoggedOut';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Movie from './components/pages/Movie';
import Cinema from './components/pages/Cinema';

// CSS
import './css/main.css';

const App = () =>
{
	return (
		<BrowserRouter>
			<HeaderLoggedOut />
			<Switch>
				<Route exact path='/about' component={About} />
				<Route exact path='/login' component={Login} />
				<Route exact path='/register' component={Register} />
				<Route exact path='/movie/:id' component={Movie} />
				<Route exact path='/cinema/:magnet' component={Cinema} />
				<Route path='/' component={Home} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;