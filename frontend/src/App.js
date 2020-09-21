// React
import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { useImmerReducer } from "use-immer";

// Context
import StateContext from './context/StateContext';
import DispatchContext from './context/DispatchContext';

// Components
import HeaderLoggedIn from './components/layout/HeaderLoggedIn';
import HeaderLoggedOut from './components/layout/HeaderLoggedOut';
import Home from './components/pages/Home';
import MyList from './components/pages/MyList';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Movie from './components/pages/Movie';
import Cinema from './components/pages/Cinema';
import Profile from './components/pages/Profile';
import ActivationSent from './components/pages/ActivationSent';
import NewPassword from './components/pages/NewPassword';
import ForgotPassword from './components/pages/ForgotPassword';
import ConfirmEmail from './components/pages/ConfirmEmail';
import HiveLog from './components/pages/hiveLog';
import GithubLog from './components/pages/GithubLog';

// CSS
import './css/main.css';

const App = () =>
{
	const initialState = {
		loggedIn: Boolean(localStorage.getItem('HiveflixToken')),
		id: localStorage.getItem("HiveflixId"),
		token: localStorage.getItem("HiveflixToken"),
		username: localStorage.getItem("HiveflixUsername"),
		profilePicture: localStorage.getItem("HiveflixProfilePicture"),
		config: {
			headers: {
				'authorization': "Bearer " + localStorage.getItem("HiveflixToken"),
				"x-rapidapi-host": "imdb8.p.rapidapi.com",
				"x-rapidapi-key": "e1d70abcdfmsh47c075d344167e6p12a880jsn7dcdcaa36c45"
			},
		},
	};

	function ourReducer(draft, action)
	{
		switch (action.type)
		{
			case "login":
				draft.loggedIn = true;
				draft.id = localStorage.getItem("HiveflixId");
				draft.token = localStorage.getItem("HiveflixToken");
				draft.username = localStorage.getItem("HiveflixUsername");
				draft.profilePicture = localStorage.getItem("HiveflixProfilePicture");
				draft.config = {
					headers: {
						'authorization': "Bearer " + localStorage.getItem("HiveflixToken"),
						"x-rapidapi-host": "imdb8.p.rapidapi.com",
						"x-rapidapi-key": "e1d70abcdfmsh47c075d344167e6p12a880jsn7dcdcaa36c45"
					},
				};
				return;
			case "logout":
				draft.loggedIn = false;
				localStorage.removeItem("HiveflixId");
				localStorage.removeItem("HiveflixToken");
				localStorage.removeItem("HiveflixUsername");
				localStorage.removeItem("HiveflixProfilePicture");
				return;
			case "changeProfilePicture":
				draft.profilePicture = action.value;
				localStorage.setItem("HiveflixProfilePicture", action.value);

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
						<Route exact path='/api/:action' component={HiveLog} />
						<Route exact path='/github/:action' component={GithubLog} />

						<Route exact path='/movie/:id' component={initialState.loggedIn ? Movie : Login} />
						<Route exact path='/mylist' component={initialState.loggedIn ? MyList : Login} />
						<Route exact path='/cinema/:magnet' component={initialState.loggedIn ? Cinema : Login} />
						<Route exact path='/profile/:id' component={initialState.loggedIn ? Profile : Login} />
						<Route exact path='/login' component={initialState.loggedIn ? Home : Login} />
						<Route exact path='/register' component={initialState.loggedIn ? Home : Register} />
						<Route exact path='/activationsent' component={ActivationSent} />
						<Route exact path='/newpassword/:id' component={NewPassword}/>
						<Route exact path='/forgotpassword' component={ForgotPassword}/>
						<Route exact path='/confirmemail/:key' component={ConfirmEmail}/>
						<Route exact path='/home' component={initialState.loggedIn ? Home : Login} />
						<Redirect to='/home' />
					</Switch>
				</BrowserRouter>
			</DispatchContext.Provider>
		</StateContext.Provider>
	);
}

export default App;
