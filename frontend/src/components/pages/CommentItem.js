import React, { useContext } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import StateContext from "../../context/StateContext";
import config from '../../config/config';

import ProfilePicture from "../ProfilePicture";

const CommentItem = ({ sender, message, created, commentId, index, render, setRenderTrick }) =>
{
	const globalState = useContext(StateContext);

	const removeComment = async () => {

		try
		{
			//Remove comment
			let response = await axios.post(
				config.SERVER_URL + '/api/comments/remove/',
				{
					commentId,
					sender: sender._id
				},
				globalState.config
			)

			if (response.status === 200)
				setRenderTrick(!render);
		}
		catch (err)
		{
			console.error(err.message);
		}
			
	}
	return (
			<div className="comment-item">
				<div>
					<Link to={"/"}>
						<ProfilePicture url={sender.profilePicture} className='comment-image' />
					</Link>
				</div>
				<table>
					<tbody>
						<tr>
							<td className="flex-left">
								<Link to={"/profile/" + sender._id}>
									<div className="comment-username mr-2">{sender.username}</div>
								</Link>
								<div className="comment-created">{created}</div>
								{localStorage.getItem('HiveflixId') === sender._id ?
								<div>
									<a onClick={removeComment} style={{color: 'red', paddingLeft: '5px'}}>Remove</a>
									
								</div>
								: ''}
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
