import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
// import axios from "axios";

// import config from '../../config/config';
import image from "../../images/profile.jpg";

const CommentItem = ({ sender, message, created }) =>
{
	// const [senderName, setSender] = useState([]);
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
				setLoading(false);
			}
			catch (err)
			{
				console.error(err.message);
			}
		})()
	}, [sender]);

	return (
			<div className="comment-item">
				<div>
					<Link to={"/"}>
						<img className="comment-img" src={image} alt='Profile'/>
					</Link>
				</div>
				<table>
					<tbody>
						<tr>
							<td className="flex-left">
								<Link to={"/"}>
									<div className="comment-username mr-2">{sender}</div>
								</Link>
								<div className="comment-created">{created}</div>
							</td>
						</tr>
						<tr>
							<td>
								<div className="comment-message">{message}</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
	)
}

export default CommentItem;
