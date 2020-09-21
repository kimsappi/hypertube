import React from "react";
import { Link } from 'react-router-dom';

import image from "../../images/profile.jpg";
import ProfilePicture from "../ProfilePicture";

const CommentItem = ({ sender, id, message, created }) =>
{
	console.log(sender);
	return (
			<div className="comment-item">
				<div>
					<Link to={"/"}>
						{/* needs a fix */}
						<ProfilePicture url={sender + ".jpeg"} className='comment-img' />
					</Link>
				</div>
				<table>
					<tbody>
						<tr>
							<td className="flex-left">
								<Link to={"/profile/" + id}>
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
