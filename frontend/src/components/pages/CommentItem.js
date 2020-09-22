import React from "react";
import { Link } from 'react-router-dom';

import ProfilePicture from "../ProfilePicture";

const CommentItem = ({ sender, message, created, commentId, render, setRender }) =>
{
	const removeComment = () => {
		console.log("asd");//{sender._id}
		setRender(!render);

		// try
		// 	{
				// Remove comment
			// 	await axios.post(
			// 		config.SERVER_URL + '/api/comments/new/',
			// 		{
			// 			username: globalState.username,
			// 			id: globalState.id,
			// 			movie: movieId,
			// 			comment: commentInput
			// 		},
			// 		globalState.config
			// 	)
			// 	setRender(!render);
			// 	setCommentInput("");
			// }
			// catch (err)
			// {
			// 	console.error(err.message);
			// }
			
	}
	console.log(commentId);
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
									<a onClick={removeComment} style={{color: 'red', paddingLeft: '5px'}}>Remove{commentId}</a>
									
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
