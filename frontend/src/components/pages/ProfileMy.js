import React, { useContext, useState, useEffect, Fragment } from "react";
import axios from "axios";
import clone from "clone";

import config from '../../config/config';

import StateContext from "../../context/StateContext";

import ProfilePicture from "../ProfilePicture";

const ProfileMy = () =>
{
	const globalState = useContext(StateContext);

	const [errorCurrentPassword, setErrorCurrentPassword] = useState("");
	const [errorNewPassword1, setErrorNewPassword1] = useState("");

	const [userData, setUserData] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() =>
	{
		(async () =>
		{
			try
			{
				const response = await axios.get(config.SERVER_URL + "/api/users/me/", globalState.config);

				setUserData(response.data);
				console.log(response.data);
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
			const res = await axios.post(config.SERVER_URL + "/api/users/profilePic", formData, globalState.config
			// {
			// 	headers: {
			// 		Authorization: `Bearer ${localStorage.getItem('HiveflixToken')}`,
			// 		'Content-Type': 'multipart/form-data'
			// 	}
			// }
			);
			// globalDispatch({ type: "changeProfilePicture", value: globalState.id + ".jpeg" });
			console.log("res", res);
		} catch(err) {
			console.warn(err);
		}
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
		tmp.firstName = event.target.value.replace(/[^A-Za-z]/g, '');

		if (tmp.firstName.length < 20)
			setUserData(tmp);
	}

	const handleLastName = (event) =>
	{
		let tmp = clone(userData);
		tmp.lastName = event.target.value.replace(/[^A-Za-z]/g, '');

		if (tmp.lastName.length < 20)
			setUserData(tmp);
	}

	const handleSubmit = async (event) =>
	{
		event.preventDefault();

		if (userData.currentPassword !== "" && noErrors())
		{
			try
			{
				// missing endpoint
				await axios.put(config.SERVER_URL + "/api/users/" + globalState.id, userData, globalState.config);

			}
			catch (err)
			{
				console.error(err.message);
			}
		}
	}

	const noErrors = () =>
	{
		if (errorCurrentPassword === "" && errorNewPassword1 === "")
			return true;
		return false;
	}

	return (
		<Fragment>
			{loading && <div className="loading"></div>}
			{!loading && (
			<Fragment>
				<div className="profile-container">
					<div>
						<ProfilePicture url={globalState.profilePicture} className='profile-image-large'/>
					</div>
					<input type='file' onChange={handlePicUpload}
					/>
				</div>

				<form onSubmit={handleSubmit}>
					<table className="profile-table m-a mb-4">
						<tbody>
							<tr>
								<td className="right bold nowrap">
									Email:
								</td>
								<td>
									<input type="email" value={userData.email} onChange={handleEmail}/>
								</td>															
							</tr>
							<tr>
								<td className="right bold nowrap">
									First Name:
								</td>
								<td>
									<input type="text" value={userData.firstName} onChange={handleFirstName}/>
								</td>															
							</tr>
							<tr>
								<td className="right bold nowrap">
									Last Name:
								</td>
								<td>
									<input type="text" value={userData.lastName} onChange={handleLastName}/>
								</td>															
							</tr>
							<tr>
								<td className="right bold nowrap">  
									New Password:
								</td>
								<td>
									<input
										type="password"
										value={userData.newPassword1}
										placeholder="Enter new password"
										autoComplete="new-password"
										onChange={handleNewPassword1}
									/>
									{errorNewPassword1 && <div className="small alert alert-error">{errorNewPassword1}</div>}
								</td>
							</tr>
							<tr>
								<td className="right bold nowrap">
									Confirm New Password:
								</td>
								<td>
									<input
										type="password"
										value={userData.newPassword2}
										placeholder="Confirm new password"
										autoComplete="new-password"
										onChange={handleNewPassword2}
									/>
								</td>															
							</tr>
							<tr>
								<td className="right bold nowrap">
									Current Password:
								</td>
								<td>
									<input
										type="password"
										value={userData.currentPassword}
										placeholder="Enter current password"
										autoComplete="current-password"
										onChange={handleCurrentPassword}
									/>
									{errorCurrentPassword && <div className="small alert alert-error">{errorCurrentPassword}</div>} 
								</td>
							</tr>
							<tr>
								<td></td>
								<td className="center">
									<button className="m-1">Update User Data</button>
								</td>															
							</tr>
						</tbody>
					</table>
				</form>
			</Fragment>
			)}
		</Fragment>
	)
}
export default ProfileMy;
