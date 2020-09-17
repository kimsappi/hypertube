import React, { useContext, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import config from '../../config/config';

import StateContext from "../../context/StateContext";

const ProfileOther = ({ id }) =>
{
	const globalState = useContext(StateContext);
	const [userData, setUserData] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() =>
	{
		setLoading(true);
		(async () =>
		{
			try
			{
				const response = await axios.get(config.SERVER_URL + "/api/users/" + id);

				console.log(response.data);

				setUserData(response.data);
				setLoading(false);
			}
			catch (err)
			{
				console.log(err.message)
			}
		})();
	}, [id]);

	return (
		<p>Other profile</p>
	)
}
export default ProfileOther;