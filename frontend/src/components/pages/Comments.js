import React, { useState, useEffect, useContext, Fragment } from "react";
import axios from "axios";

import config from '../../config/config';

import timeSinceCreated from "../../utils/timeSinceCreated";
import StateContext from "../../context/StateContext";
import CommentItem from './CommentItem';

const Comments = ({ movieId }) =>
{
	const globalState = useContext(StateContext);
	const [comments, setComments] = useState([]);
	const [commentInput, setCommentInput] = useState("");
	const [errorCommentInput, setErrorCommentInput] = useState("");
	const [render, setRender] = useState(false);

	useEffect(() =>
	{
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();

		(async () =>
		{
			try
			{
				// fetch all comments of a movie
				var response = await axios.get(
					config.SERVER_URL + `/api/comments/getComments/${movieId}`,
					{ cancelToken: source.token }
				);

				setComments(response);
			}
			catch (err)
			{
				console.error(err.message);
			}
		})()
		return () => source.cancel();
	}, [movieId, render]);

	const changeCommentInput = (event) =>
	{
		if (event.target.value.length > 1000)
			setErrorCommentInput("comment cannot exceed 1000 characters");
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
				// Create new comment
				await axios.post(
					config.SERVER_URL + '/api/comments/new/',
					{
						username: globalState.username,
						id: globalState.id,
						movie: movieId,
						comment: commentInput
					},
					globalState.config
				)
				setRender(!render);
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
				</div>
			</form>
			<hr className="my-2"></hr>
			<h4 className="mb-2">Comments</h4>
			<div>
			{typeof comments.data !== "undefined" && comments.data.comments.map ((comment, index) => (
				<CommentItem
					sender={comment.user}
					message={comment.comment}
					created={timeSinceCreated(comment.time)}
					commentId={comment._id}
					key={index}
					render={render}
					setRenderTrick={setRender}
				/>
			))}
			</div>
		</Fragment>
	)
}

export default Comments;
