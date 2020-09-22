import React, { useEffect, useState, useContext, Fragment } from "react";
import axios from 'axios';

import config from '../../config/config';

import MovieItem from "./MovieItem";

import StateContext from "../../context/StateContext";


const MyList = () =>
{
	const globalState = useContext(StateContext);

	const [myList, setMyList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [render, setRender] = useState(false);

	useEffect(() => {
		fetchMyList();
	}, [render]);

	const fetchMyList = async () => {
		try {
			const response = await axios.get(config.SERVER_URL + '/api/myList', globalState.config);

			let list = [];

			for (let i = 0; i < response.data.length; i++)
			{
				const res = await axios.get("https://yts.mx/api/v2/movie_details.json?movie_id=" + response.data[i]);
				list.push(res.data.data.movie);
			}

			setMyList(list);
			setLoading(false);
		} catch(err) {}
	};

	const removeFromList = async (id) =>
	{
		try
		{
			//Remove a movie from My List
			await axios.delete(config.SERVER_URL + '/api/mylist/' + id, globalState.config);
			
			setRender(!render);
		}
		catch (err)
		{
			console.error(err.message);
		}
	}

	return (
		<Fragment>
			<h1 className="center m-4"><i className="fas fa-images color-white"></i> My List</h1>
			{loading && <div className="loading"></div>}
			{!loading && (
				<Fragment>
					<div className="movie-items-container">
						{myList.length ? myList.map (movie => (
							<Fragment key={movie.imdb_code}>
								<div className="flex-column">
									<MovieItem movie={movie}/>
									<button
										className="button-delete m-a mb-4 big"
										onClick={removeFromList(movie.id)}
										title="remove from list">
										<i className="fas fa-times"></i>
									</button>
								</div>
							</Fragment>
							)
						) :
						<div className="mt-4">Your list is empty</div>}
					</div>
				</Fragment>
			)}
		</Fragment>
	)
}

export default MyList;
