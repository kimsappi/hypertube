import React, { useContext, useState, useEffect, Fragment } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

import config from '../../config/config';

import StateContext from "../../context/StateContext";

import ProfilePicture from "../ProfilePicture";

const ProfileOther = () =>
{
	const globalState = useContext(StateContext);

	const { id } = useParams();

	const [userData, setUserData] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() =>
	{
		(async () =>
		{
			try
			{
				const response = await axios.get(config.SERVER_URL + "/api/users/" + id, globalState.config);

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

	const getLanguageDisplay = shorthand => {
		let display = 'N/A';
		config.languages.forEach(lang => {
			if (lang.shorthand === shorthand) {
				display = lang.display;
			}
		});
		return display;
	};

	return (
		<Fragment>
			{loading && <div className="loading"></div>}
			{!loading && (
			<Fragment>
				<div className="profile-container">
					<ProfilePicture url={userData.profilePicture} className='profile-image-large'/>
					<div>
						<h4 style={{padding: '5px'}}>{userData.username}</h4>
						<h5 style={{padding: '5px'}}>{userData.firstName} {userData.lastName}</h5>
						<p style={{padding: '5px'}}>Language: {getLanguageDisplay(userData.language)}</p>
					</div>
				</div>
			</Fragment>
			)}
		</Fragment>
	)
}
export default ProfileOther;
