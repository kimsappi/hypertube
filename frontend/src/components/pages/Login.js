import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import DispatchContext from '../../context/DispatchContext';

import config from '../../config/config';

import image from '../../images/image_login.jpg';

// username vahintaan 4 merkkia ja salasana pienia JA isoja kirjaimia

const Login = () =>
{
	const globalDispatch = useContext(DispatchContext);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [errorUsername, setErrorUsername] = useState("");
	const [errorPassword, setErrorPassword] = useState("");

	const changeUsername = (event) =>
	{
		setErrorUsername("");
		setUsername(event.target.value)
	}

	const changePassword = (event) =>
	{
		setErrorPassword("");
		setPassword(event.target.value)
	}

	const handleSubmit = async (event) =>
	{
		event.preventDefault();

		if (formIsFilled())
		{
			try
			{
				// log in and get a token
				let response = await axios.post(
					config.SERVER_URL + '/api/auth/login/',
					{username: username, password: password}
				);
					console.log(response);

				if (response.data.message === "login success")
				{
					localStorage.setItem("HiveflixToken", response.data.token);
					localStorage.setItem("HiveflixUsername", response.data.username);
					localStorage.setItem("HiveflixProfilePicture", response.data.profilePicture);
					globalDispatch({ type: "login" });
				}
				else if (response.data.message === "email not verified")
					setErrorPassword("account not activated");
				else if (response.data.message === 'invalid username or password')
					setErrorPassword("invalid username / password combination");
				else
					setErrorPassword("This error should not be seen..");
			}
			catch (err)
			{
				console.error(err.message);
			}
		}
	}
	
	// return 1 if no empty fields
	const formIsFilled = () =>
	{
		let missingData = false;

		if (username === "")
		{
			setErrorUsername("Please enter username");
			missingData = true;
		}
		if (password === "")
		{
			setErrorPassword("Please enter password");
			missingData = true;
		}
		if (missingData)
			return 0;
		return 1;
	}

	return (
		<main>
			<div  className="register-container">
				<div>
					<h1 className="center"><i className="fas fa-key color-white my-4"></i> Log In</h1>
					<img src={image} width="300px" height="400px" className='rounded-image' alt='girl with popcorn'/>
				</div>
				<div className="basic-form p-5">
					<form onSubmit={handleSubmit}>
						<label className="ml-2 mb-1">Username</label>
						<input
							className="mb-1"
							type="text"
							name="username"
							placeholder="Enter username"
							autoComplete="on"
							value={username}
							onChange={changeUsername}
						/>
						{errorUsername && <div className="small alert alert-error">{errorUsername}</div>}
						<label className="mt-2 ml-2 mb-1">Password</label>
						<input
							className="mb-1"
							type="password"
							name="password"
							placeholder="Enter password"
							autoComplete="current-password"
							value={password}
							onChange={changePassword}
						/>
						{errorPassword && <div className="small alert alert-error">{errorPassword}</div>}
						<div className="mt-1 ml-2"><Link to="/forgotpassword">Forgot password?</Link></div>

						<hr className="color-black50 mt-4"></hr>

						<div className="center mt-4">
							<button type="submit"><i className="fas fa-key color-black100"></i> Log In</button>
						</div>
						<div className="center mt-4">Don't have an account? <Link to='/register'>Register</Link></div>
					</form>
					<h4>42 TESTING</h4>
					<a href="https://api.intra.42.fr/oauth/authorize?client_id=2d02a773dfbb227ded338c162245907ac4e2fa874a5e24a5e421aca1177cacab&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Flogin&response_type=code">login 42</a>
			
				</div>
			</div>
		</main>
	)
}

export default Login;
