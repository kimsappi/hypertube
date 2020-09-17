import React, { useContext, useState, useEffect } from "react";
import axios from "axios";

import config from '../../config/config';

import StateContext from "../../context/StateContext";

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

	return (
		<p>My profile</p>
	)
}
export default ProfileMy;