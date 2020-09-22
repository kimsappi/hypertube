import React, { useContext, useState, useEffect, Fragment } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

import config from '../../config/config';

import StateContext from "../../context/StateContext";
import DispatchContext from '../../context/DispatchContext';

import ProfilePicture from "../ProfilePicture";

const ProfileOther = () =>
{
	const globalState = useContext(StateContext);
	const globalDispatch = useContext(DispatchContext);

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

	return (
		<Fragment>
			{loading && <div className="loading"></div>}
			{!loading && (
			<Fragment>
				<div className="profile-container">
					<ProfilePicture url={userData.profilePicture} className='profile-image-large'/>
				</div>
				<div className="center">
					{userData.firstName} {userData.lastName}
				</div>
			</Fragment>
			)}
		</Fragment>
	)
}
export default ProfileOther;
