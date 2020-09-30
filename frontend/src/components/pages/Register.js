import React, { useState, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

import config from '../../config/config';

import image from '../../images/image_register.jpg';

const Register = () =>
{
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password1, setPassword1] = useState("");
	const [password2, setPassword2] = useState("");

	const [errorUsername, setErrorUsername] = useState("");
	const [errorEmail, setErrorEmail] = useState("");
	const [errorFirstName, setErrorFirstName] = useState("");
	const [errorLastName, setErrorLastName] = useState("");
	const [errorPassword1, setErrorPassword1] = useState("");
	const [errorPassword2, setErrorPassword2] = useState("");

	const [formSent, setFormSent] = useState(false);

	const changeUsername = (event) =>
	{
		const pattern = /^[A-Za-z0-9]+$/;

		if (!pattern.test(event.target.value) && event.target.value.length > 0)
			setErrorUsername("Username can only contain letters (a-z, A-Z) and numbers (0-9)");
		else if (event.target.value.length < 3)
			setErrorUsername("Username must be at least 3 characters long");
		else if (event.target.value.length > 20)
			setErrorUsername("Username cannot be longer than 20 characters");
		else
			setErrorUsername("");

		setUsername(event.target.value);
	}

	const changeEmail = (event) =>
	{
		const pattern = /\S+@\S+\.\S+/;

		if (event.target.value.length > 40)
			setErrorEmail("Email cannot be longer than 40 characters");
		else if (!pattern.test(event.target.value) && event.target.value.length > 0)
			setErrorEmail("Invalid email format");
		else
			setErrorEmail("");

		setEmail(event.target.value)
	}

	const changeFirstName = (event) =>
	{
		setErrorFirstName("");
		setFirstName(event.target.value)
	}

	const changeLastName = (event) =>
	{
		setErrorLastName("");
		setLastName(event.target.value)
	}

	const changePassword1 = (event) =>
	{
		let foundLetter = false;
		let foundNumber = false;

		for (let i = 0; event.target.value[i]; i++)
		{
			if (Number.isInteger(Number(event.target.value[i])))
				foundNumber = true;
			else if (event.target.value[i] === event.target.value[i].toUpperCase())
				foundLetter = true;
		}
		if (event.target.value.length > 40)
			setErrorPassword1("Password cannot be longer than 40 characters");
		else if (event.target.value.length < 8)
			setErrorPassword1("Password must be at least 8 characters long");
		else if (!foundLetter)
			setErrorPassword1("Password must contain as least one capital letter [A-Z]");
		else if (!foundNumber)
			setErrorPassword1("Password must contain as least one number [0-9]");
		else
			setErrorPassword1("");

		setPassword1(event.target.value)
	}

	const changePassword2 = (event) =>
	{
		if (event.target.value !== password1)
			setErrorPassword2("Passwords do not match");
		else
			setErrorPassword2("");

		setPassword2(event.target.value)
	}

	const handleSubmit = async (event) =>
	{
		event.preventDefault();

		if (formIsFilled() && noErrors())
		{
			try
			{
				const response = await axios.post(config.SERVER_URL + '/api/auth/register', {
					username: username,
					email: email,
					firstName: firstName,
					lastName: lastName,
					password: password1
				});

				if (response.data.message === "username already exists")
					setErrorUsername("username already exists");
				else if (response.data.message === "email used by another account")
					setErrorEmail("email used by another account");
				else if (response.data.message === "invalid data")
					setErrorPassword2("invalid data");
				else
					setFormSent(true);
			}
			catch (err)
			{
				console.error(err.message);
			}
		}
	}

	const noErrors = () =>
	{
		if (errorUsername === "" && errorEmail === "" && errorFirstName === "" &&
			errorLastName === "" && errorPassword1 === "" && errorPassword2 === "")
			return true;
		return false;
	}

	const formIsFilled = () =>
	{
		let missingData = false;

		if (username === "")
		{
			setErrorUsername("Please enter username");
			missingData = true;
		}
		if (email === "")
		{
			setErrorEmail("Please enter email");
			missingData = true;
		}
		if (firstName === "")
		{
			setErrorFirstName("Please enter first name");
			missingData = true;
		}
		if (lastName === "")
		{
			setErrorLastName("Please enter last name");
			missingData = true;
		}
		if (password1 === "")
		{
			setErrorPassword1("Please enter password");
			missingData = true;
		}
		if (password2 === "")
		{
			setErrorPassword2("Please enter password confirmation");
			missingData = true;
		}
		if (missingData)
			return 0;
		return 1;
	}

	return (
		<Fragment>
			{formSent && <Redirect to="/activationsent" />}
			<main>
				<div  className="register-container">
					<div>
						<h1 className="center"><i className="fas fa-edit color-white my-4"></i> Register</h1>
						<img src={image} width="300px" height="400px" className='rounded-image' alt='girl with popcorn'/>
					</div>
					<div className="basic-form p-5">
						<form onSubmit={handleSubmit}>

							<label className=" ml-2 mb-1">Username</label>
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

							<label className="mt-2 ml-2 mb-1">Email</label>
							<input
								className="mb-1"
								type="email"
								name="email"
								placeholder="Enter email address"
								autoComplete="email"
								value={email}
								onChange={changeEmail}
							/>
							{errorEmail && <div className="small alert alert-error">{errorEmail}</div>}

							<label className="mt-2 ml-2 mb-1">First Name</label>
							<input
								className="mb-1"
								type="text"
								name="firstname"
								placeholder="Enter first name"
								autoComplete="on"
								value={firstName}
								onChange={changeFirstName}
							/>
							{errorFirstName && <div className="small alert alert-error">{errorFirstName}</div>}

							<label className="mt-2 ml-2 mb-1">Last Name</label>
							<input
								className="mb-1"
								type="text"
								name="lastname"
								placeholder="Enter last name"
								autoComplete="on"
								value={lastName}
								onChange={changeLastName}
							/>
							{errorLastName && <div className="small alert alert-error">{errorLastName}</div>}

							<hr className="mt-4"></hr>
							
							<label className="mt-2 ml-2 mb-1">Password</label>
							<input
								className="mb-1"
								type="password"
								name="password1"
								placeholder="Enter password"
								autoComplete="new-password"
								value={password1}
								onChange={changePassword1}
							/>
							{errorPassword1 && <div className="small alert alert-error">{errorPassword1}</div>}

							<label className="mt-2 ml-2 mb-1">Confirm Password</label>
							<input
								className="mb-1"
								type="password"
								name="password2"
								placeholder="Confirm password"
								autoComplete="new-password"
								value={password2}
								onChange={changePassword2}
							/>
							{errorPassword2 && <div className="small alert alert-error">{errorPassword2}</div>}

							<div className="small center">
								Password must be at least 8 characters in length,
								contain a minimum of one upper case letter [A-Z]
								and contain a minimum of one number [0-9]
							</div>

							<hr className="color-black50 mt-4"></hr>

							<div className="center mt-4">
								<button type="submit"><i className="fas fa-edit color-black"></i> Register</button>
							</div>
						</form>

						<h4>Register through an API</h4>
						<div>
							<a href='https://api.intra.42.fr/oauth/authorize?client_id=2d02a773dfbb227ded338c162245907ac4e2fa874a5e24a5e421aca1177cacab&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fregister&response_type=code'>Register via 42</a>
						</div>
						<div>
							<a href="https://github.com/login/oauth/authorize?client_id=06dd042c7ba940906e5d&redirect_uri=http://localhost:3000/github/register">Register via Github</a>
						</div>

						<div className="center mt-4">Already have an account? <Link to='/login'>Log In</Link></div>
					</div>
				</div>
			</main>
		</Fragment>
	)
}

export default Register;
