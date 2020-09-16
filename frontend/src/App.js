// React
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useImmerReducer } from "use-immer";

// Context
import StateContext from './context/StateContext';
import DispatchContext from './context/DispatchContext';

// Components
import HeaderLoggedOut from './components/pages/layout/HeaderLoggedOut';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Movie from './components/pages/Movie';
import Cinema from './components/pages/Cinema';
import Profile from './components/pages/Profile';
import ActivationSent from './components/pages/ActivationSent';
import NewPassword from './components/pages/NewPassword';
import ForgotPassword from './components/pages/ForgotPassword';
import Activation from './components/pages/Activation';

// CSS
import './css/main.css';

const App = () =>
{
	const initialState = {
		loggedIn: Boolean(localStorage.getItem('HiveflixToken')),
		token: localStorage.getItem("HiveflixToken"),
		username: localStorage.getItem("HiveflixUsername"),
		profileImage: localStorage.getItem("HiveflixProfileImage")
	};

	function ourReducer(draft, action)
	{
		switch (action.type)
		{
			case "login":
				draft.loggedIn = true;
				draft.token = localStorage.getItem("HiveflixToken");
				draft.username = localStorage.getItem("HiveflixUsername");
				draft.profileImage = localStorage.getItem("HiveflixProfileImage");
				return;
			case "logout":
				draft.loggedIn = false;
				localStorage.removeItem("HiveflixToken");
				localStorage.removeItem("HiveflixUsername");
				localStorage.removeItem("HiveflixProfileImage");
				return;
			case "changeProfileImage":
				draft.profileImage = action.value;
				localStorage.setItem("HiveflixProfileImage", action.value);
				return;
			default:
				// without this there's an error
		}
	}
	
	const [state, dispatch] = useImmerReducer(ourReducer, initialState);

	return (
		<StateContext.Provider value={state}>
			<DispatchContext.Provider value={dispatch}>
				<BrowserRouter>
					{initialState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
					<Switch>
						<Route exact path='/about' component={About} />
						<Route exact path='/movie/:id' component={initialState.loggedIn ? Movie : Login} />
						<Route exact path='/cinema/:magnet' component={initialState.loggedIn ? Cinema : Login} />
						<Route exact path='/profile' component={initialState.loggedIn ? Profile : Login} />
						<Route exact path='/login' component={initialState.loggedIn ? Home : Login} />
						<Route exact path='/register' component={initialState.loggedIn ? Home : Register} />
						<Route exact path='/activationsent' component={ActivationSent} />
						<Route exact path='/newpassword/:token' component={NewPassword}/>
						<Route exact path='/forgotpassword' component={ForgotPassword}/>
						<Route exact path='/activation/:key' component={Activation}/>
						<Route path='/' component={Home} />
					</Switch>
				</BrowserRouter>
			</DispatchContext.Provider>
		</StateContext.Provider>
	);
}

export default App;