import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";

import config from '../../config/config';

import CommentItem from './CommentItem';

const Comments = ({ movieId }) =>
{
	const [comments, setComments] = useState([]);
	const [commentInput, setCommentInput] = useState("");
	const [errorCommentInput, setErrorCommentInput] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() =>
	{
		setLoading(true);

		(async () =>
		{
			try
			{
				// // fetch all comments of given movie
				// let response = await axios.get(`${config.SERVER_URL}/api/comments/${movieId}`);

				// console.log("comments.data", response.data);
				
				// setComments(response.data);
				setLoading(false);
			}
			catch (err)
			{
				console.error(err.message);
			}
		})()
	}, [movieId]);

	const changeCommentInput = (event) =>
	{
		if (event.target.value.length > 300)
			setErrorCommentInput("a single comment cannot exceed 300 characters");
		else
		{
			setErrorCommentInput("");
			setCommentInput(event.target.value)
		}
	}

	// post comment
	const handleSubmit = async (event) =>
	{
		event.preventDefault();

		if (commentInput !== "")
		{
			try
			{
				// await axios.post(`${config.SERVER_URL}/api/comments/`, { message: commentInput });

				console.log("message sent");

				setCommentInput("");
			}
			catch (err)
			{
				console.error(err.message);
			}
		}
	}

	return (
		<Fragment>
			<h4 className="mb-2">Add a Comment</h4>
			<form onSubmit={handleSubmit}>
				<textarea
					rows="3"
					resize="none"
					placeholder="Type something"
					value={commentInput}
					onChange={changeCommentInput}
				/>
				{errorCommentInput && <div className="small alert alert-error">{errorCommentInput}</div>}
				<div className="flex-left my-2">
					<button type="submit">Comment</button>
					<button className="ml-3" type="clear">Reset</button>
				</div>
			</form>
			<hr className="my-2"></hr>
			<h4 className="mb-2">Comments</h4>
			{loading && <div className="loading"></div>}
			{!loading && comments.map (comment => (
				<CommentItem
					senderId={comment.sender}
					message={comment.message}
					created={comment.created}
					key={comment.id}
				/>
			))}
		</Fragment>
	)
}

export default Comments;