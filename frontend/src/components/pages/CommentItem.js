import React from "react";
import { Link } from 'react-router-dom';

import ProfilePicture from "../ProfilePicture";

const CommentItem = ({ sender, id, message, created }) =>
{
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
