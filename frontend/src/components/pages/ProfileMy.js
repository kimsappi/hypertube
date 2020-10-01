// /* eslint-disable */

import React, { useContext, useState, useEffect, Fragment } from "react";
import axios from "axios";
import clone from "clone";

import config from '../../config/config';

import StateContext from "../../context/StateContext";
import DispatchContext from '../../context/DispatchContext';

import ProfilePicture from "../ProfilePicture";

const LanguageOption = ({lang}) => (
		<option value={lang.shorthand}>{lang.display}</option>
);

const ProfileMy = () =>
{
	const globalState = useContext(StateContext);
	const globalDispatch = useContext(DispatchContext);

	const [errorCurrentPassword, setErrorCurrentPassword] = useState("");
	const [errorNewPassword1, setErrorNewPassword1] = useState("");

	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const [userData, setUserData] = useState();
	const [loading, setLoading] = useState(true);
	const [originalUserData, setOriginalUserData] = useState();

	const getAndSetData = async () => {
		const response = await axios.get(config.SERVER_URL + "/api/users/me/", globalState.config);

		setUserData(response.data);
		setOriginalUserData(response.data);
		globalDispatch({ type: "changeLanguage", value: response.data.language });
	};

	useEffect(() =>
	{
		(async () =>
		{
			try
			{
				await getAndSetData();
				setLoading(false);
			}
			catch (err)
			{
				console.log(err.message)
			}
		})();
	}, []);

	const handlePicUpload = async event => {
		try {
			const formData = new FormData();
			formData.append('photo', event.target.files[0]);
			const res = await axios.post(config.SERVER_URL + "/api/users/profilePic", formData, globalState.config);
			globalDispatch({ type: "changeProfilePicture", value: res.data });
		} catch(err) {}
	};


	const handleCurrentPassword = (event) =>
	{
		let tmp = clone(userData);
		tmp.currentPassword = event.target.value;

		if (tmp.currentPassword.length > 40)
			setErrorCurrentPassword("Password cannot be longer than 40 characters");
		else
			setErrorCurrentPassword("");

		setUserData(tmp);
	}

	const handleNewPassword1 = (event) =>
	{
		let tmp = clone(userData);
		tmp.newPassword1 = event.target.value;

		let foundLetter = false;
		let foundNumber = false;
		for (let i = 0; tmp.newPassword1[i]; i++)
		{
			if (Number.isInteger(Number(tmp.newPassword1[i])))
				foundNumber = true;
			else if (tmp.newPassword1[i] === tmp.newPassword1[i].toUpperCase())
				foundLetter = true;
		}
		if (tmp.newPassword1.length > 40)
			setErrorNewPassword1("Password cannot be longer than 40 characters");
		else if (!tmp.newPassword1.length)
			setErrorNewPassword1("");
		else if (tmp.newPassword1.length < 3)
			setErrorNewPassword1("Password must be at least 3 characters long");
		else if (!foundLetter)
			setErrorNewPassword1("Password must contain as least one capital letter [A-Z]");
		else if (!foundNumber)
			setErrorNewPassword1("Password must contain as least one number [0-9]");
		else
			setErrorNewPassword1("");

		setUserData(tmp);
	}

	const handleNewPassword2 = (event) =>
	{
		let tmp = clone(userData);
		tmp.newPassword2 = event.target.value;

		if (tmp.newPassword2 !== tmp.newPassword1)
			setErrorNewPassword1("Passwords do not match");
		else
			setErrorNewPassword1("");

		setUserData(tmp);
	}

	const handleEmail = (event) =>
	{
		let tmp = clone(userData);
		tmp.email = event.target.value;

		if (tmp.email.length < 40)
			setUserData(tmp);
	}

	const handleFirstName = (event) =>
	{
		let tmp = clone(userData);
		tmp.firstName = event.target.value.replace(/[^a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\-]/g, '');

		if (tmp.firstName.length < 20)
			setUserData(tmp);
	}

	const handleLastName = (event) =>
	{
		let tmp = clone(userData);
		tmp.lastName = event.target.value.replace(/[^a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\-]/g, '');

		if (tmp.lastName.length < 20)
			setUserData(tmp);
	}

	const handleLanguage = event => {
		let tmp = clone(userData);
		tmp.language = event.target.value;

		setUserData(tmp);
	};

	const handleSubmit = async (event) =>
	{
		event.preventDefault();
		setError('');
		setSuccess('');

		if (userData.currentPassword && noErrors())
		{
			try
			{
				await axios.patch(config.SERVER_URL + "/api/users/" + globalState.id, userData, globalState.config);
				setSuccess("Profile updated successfully.");
				const {
					newPassword1,
					newPassword2,
					currentPassword,
					...userDataSansPasswords
				} = userData;
				setOriginalUserData(userDataSansPasswords);
				setUserData(userDataSansPasswords);
				await getAndSetData();
			}
			catch (err)
			{
				if (err.response && err.response.data && err.response.data.message) {
					switch (err.response.data.message) {
						case 'password':
							setError("Current password incorrect");
							break;
						case 'password mismatch':
							setError("New passwords don't match");
							break;
						case 'incorrect formatting':
							setError("Data is incorrectly formatted");
							break;
						case 'email conflict':
							setError("Email is already in use by another account");
							break;
						case 'username conflict':
							setError("Username is already in use by another account");
							break;
						default:
							setError("Something went wrong");
					}
				}
				setUserData(originalUserData);
			}
		}
		else if (!userData.currentPassword)
			setError("Please enter your current password.");
	}

	const noErrors = () =>
	{
		if (errorCurrentPassword === "" && errorNewPassword1 === "")
			return true;
		return false;
	}

	const handleMute = () =>
	{
		globalDispatch({ type: "toggleMute", value: !globalState.mute });
	}

	const checkboxStyle = {
		marginLeft: '10px',
		width: '15px',
		height: '15px'
	};

	return (
		<Fragment>
			{loading && <div className="loading"></div>}
			{!loading && (
			<Fragment>
				<div className="profile-container">
					<div className="center">
						<ProfilePicture url={globalState.profilePicture} className='profile-image-large'/>
					</div>
					<div className="m-a">
						<label htmlFor="file-upload" className="custom-file-upload"> 
							<i className="fa fa-cloud-upload"></i> Change Profile Picture
						</label>
						<input id="file-upload" type='file' onChange={handlePicUpload}/>
					</div>
					<div className="flex-center mb-2">
						<div>Mute trailer audio</div>
						<input type="checkbox" onChange={handleMute} checked={globalState.mute} style={checkboxStyle}/>
					</div>
					<div>
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
									<label className="mb-1 ml-2">Email</label>
									<input type="email" value={userData.email || ''} onChange={handleEmail} required={true}/>
							</div>

							<div className="mb-4">
								<label className="mb-1 ml-2">First Name</label>
								<input type="text" value={userData.firstName} onChange={handleFirstName} required={true}/>
							</div>

							<div className="mb-4">
								<label className="mb-1 ml-2">Last Name</label>
								<input type="text" value={userData.lastName} onChange={handleLastName} required={true}/>
							</div>

							<div className="mb-4">
								<label className="mb-1 ml-2">Language</label>
								<select name="language" id="language" value={userData.language} onChange={handleLanguage}>
										{config.languages.map(lang => <LanguageOption lang={lang} key={lang.shorthand} />)}
								</select>
							</div>

							<div className="mb-4">
								<label className="mb-1 ml-2">New Password</label>
								<input
									type="password"
									value={userData.newPassword1 || ''}
									placeholder="Enter new password"
									autoComplete="new-password"
									onChange={handleNewPassword1}
								/>
								{errorNewPassword1 && <div className="small alert alert-error mt-2">{errorNewPassword1}</div>}
							</div>

							<div className="mb-4">
								<label className="mb-1 ml-2">Confirm New Password</label>
								<input
									type="password"
									value={userData.newPassword2 || ''}
									placeholder="Confirm new password"
									autoComplete="new-password"
									onChange={handleNewPassword2}
								/>
							</div>

							<div className="mb-4">
								<label className="mb-1 ml-2">Current Password</label>
								<input
									type="password"
									value={userData.currentPassword || ''}
									placeholder="Enter current password"
									autoComplete="current-password"
									onChange={handleCurrentPassword}
								/>
								{errorCurrentPassword && <div className="small alert alert-error">{errorCurrentPassword}</div>}
							</div>
							{error && <div className='small alert alert-error'>{error}</div>}
							{success && <div className='small alert alert-success'>{success}</div>}

							<div className="center m-5">
								<button>Update User Data</button>
							</div>
						</form>
					</div>
				</div>
			</Fragment>
			)}
		</Fragment>
	)
}
export default ProfileMy;
