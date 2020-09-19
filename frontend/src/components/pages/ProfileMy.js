import React, { useContext, useState, useEffect, Fragment } from "react";
import axios from "axios";

import config from '../../config/config';

import StateContext from "../../context/StateContext";
import ProfilePicture from "../ProfilePicture";

const ProfileMy = () =>
{
	const globalState = useContext(StateContext);
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
			const res = await axios.post(config.SERVER_URL + "/api/users/profilePic", formData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('HiveflixToken')}`,
					'Content-Type': 'multipart/form-data'
				}
			});
			console.log(res);
		} catch(err) {
			console.warn(err);
		}
	};
	
	return (
		<Fragment>
		{loading && <div className="loading"></div>}
		{!loading && (
			<div className="profile-container">
				<div>
					<ProfilePicture url={globalState.profilePicture} className='profile-image-large'/>
				</div>
				<div>
					Data
				</div>
				<input type='file' onChange={handlePicUpload}
				/>
			</div>
		)}
		</Fragment>
	)
}
export default ProfileMy;
