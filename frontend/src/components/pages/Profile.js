import React, { useContext } from "react";
import { useParams } from "react-router-dom";

import StateContext from "../../context/StateContext";

import ProfileMy from "./ProfileMy";
import ProfileOther from "./ProfileOther";

const Profile = () =>
{
	const globalState = useContext(StateContext);
	const { id } = useParams();

	if (id === globalState.id)
		return <ProfileMy />
	else
		return <ProfileOther id={id} />

}
export default Profile;