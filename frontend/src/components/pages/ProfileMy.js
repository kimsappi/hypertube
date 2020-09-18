import React, { useContext, useState, useEffect, useRef, Fragment, useCallback } from "react";
import axios from "axios";

import config from '../../config/config';

import StateContext from "../../context/StateContext";
import ProfilePicture from "../ProfilePicture";

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ProfileMy = () =>
{
	const globalState = useContext(StateContext);
	const [userData, setUserData] = useState();
	const [loading, setLoading] = useState(true);

	const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 16 / 9 });
	const [completedCrop, setCompletedCrop] = useState(null);
	const imgRef = useRef(null);

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
	
	const onLoad = useCallback(img => {
		imgRef.current = img;
	  }, []);
	
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
			</div>
		)}
		</Fragment>
	)
}
export default ProfileMy;