import React, { useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import axios from 'axios';

import config from '../../config/config';

const NewPassword = () =>
{
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const { id } = useParams();
	const params = new URLSearchParams(window.location.search);
	const code = params.get('code');
	if (!code)
		return (<Redirect to='/home' />);

	const changeInput = (e, setValue) => {
		setValue(e.target.value);
	};

	const submitResetPassword = async event => {
		event.preventDefault();
		setSuccess("");
		setError("");
		if (password !== confirmPassword) {
			setError("Passwords don't match.");
			return;
		}
		try {
			const res = await axios.patch(config.SERVER_URL + `/api/auth/forgotPassword/${id}?code=${code}`,
				{password, confirmPassword}
				);
			if (res) {
				setSuccess("Password changed successfully. You can now log in.");
			}
		} catch(err) {
			setError("Couldn't change password.");
		}
	};

	return (
		<div className="center">
			<h1 className="my-4">New Password</h1>
			{error && <div className="small alert alert-error">{error}</div>}
			{success && <div className="small alert alert-success">{success}</div>}
			<form onSubmit={submitResetPassword}>
				<label htmlFor="email">Enter your new password</label>
				<input
					className="mb-1"
					type="password"
					name="password"
					value={password}
					onChange={event => changeInput(event, setPassword)}
					required={true}
				/>
				<label htmlFor="email">Confirm password</label>
				<input
					className="mb-1"
					type="password"
					name="password"
					value={confirmPassword}
					onChange={event => changeInput(event, setConfirmPassword)}
					required={true}
				/>
				<button type="submit"><i className="fas color-black100"></i>Reset Password</button>
			</form>
		</div>
	)
}

export default NewPassword;
