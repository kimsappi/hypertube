import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";

import config from '../../config/config';

const CommentItem = ({ sender, message, created }) =>
{
	const [senderName, setSender] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() =>
	{
		setLoading(true);

		(async () =>
		{
			try
			{
				// fetch profile image of user who posted the comment

				// Backissa ei ole viela routea talle..
				//let response = await axios.get(`${config.SERVER_URL}/api/users/${sender}`);

				//console.log("user.data", response.data);
				
				//setSender(response.data);
				//setLoading(false);
			}
			catch (err)
			{
				console.error(err.message);
			}
		})()
	}, [sender]);

	return (
		<div className="comment-container">
			<div className="comment-image">
				<img src={sender.profile_image} className='profile-image' alt='profile image'/>
			</div>
			<div className="comment-data">
				<div className="comment-username">
					{sender} {created}
				</div>
				<div className="comment-message">
					{message}
				</div>
			</div>
		</div>
	)
}

export default CommentItem;