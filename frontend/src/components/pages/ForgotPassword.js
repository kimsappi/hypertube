import axios from "axios";
import React, { useState } from "react";

import config from '../../config/config'

const ForgotPassword = () =>
{
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const changeEmail = event => {
		setEmail(event.target.value);
	};

	const submitResetPassword = async event => {
		event.preventDefault();
		setSuccess("");
		setError("");
		if (!event.target.checkValidity())
			return;
		try {
			const res = await axios.post(config.SERVER_URL + '/api/auth/forgotPassword', {email});
			if (res) {
				setSuccess("Password reset email sent.");
			}
		} catch(err) {
			setError("Couldn't reset password.");
		}
	};

	return (
		<div className="center">
			<h1 className="my-4">Forgot Password</h1>
			{error && <div className="small alert alert-error">{error}</div>}
			{success && <div className="small alert alert-success">{success}</div>}
			<form onSubmit={submitResetPassword}>
				<label htmlFor="email">Enter your account's email</label>
				<input
					className="mb-1"
					type="email"
					name="email"
					placeholder="Account email"
					autoComplete="on"
					value={email}
					onChange={changeEmail}
					required={true}
				/>
				<button type="submit"><i className="fas color-black100"></i>Reset Password</button>
			</form>
		</div>
	)
}

export default ForgotPassword;
