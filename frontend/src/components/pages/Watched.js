/* eslint-disable */

import React, { useEffect, useState, useContext } from "react";
import axios from 'axios';

import MovieItem from "./MovieItem";

import StateContext from "../../context/StateContext";


const Watched = () =>
{
	const globalState = useContext(StateContext);

	const [myList, setMyList] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() =>
	{
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();

		(async () =>
		{
			try
			{
				let list = [];
				const idList = Object.entries(globalState.watched);
				const idListFiltered = idList.filter(movie => movie[1] < 100);

				for (let i = 0; i < idListFiltered.length; i++)
				{
					const res = await axios.get(
						"https://yts.mx/api/v2/movie_details.json?movie_id=" + idListFiltered[i][0],
						{ cancelToken: source.token }
					);

					list.push({
						movie: res.data.data.movie
					});
				}

				setMyList(list);
				setLoading(false);
			}
			catch(err)
			{
				if (axios.isCancel(err))
					source.cancel();
				else
					console.error(err.message);
			}
		})()
		return () => source.cancel()
	}, []);

	return (
		<>
			<h1 className="center m-4"><i className="far fa-eye color-white"></i> Watched</h1>
			{loading && <div className="loading"></div>}
			{!loading && (
				<div className="movie-items-container">
					{myList.length ? myList.map (movie => (
              <MovieItem movie={movie.movie} key={movie.movie.imdb_code}/>
						)
					) :
					<div className="mt-4">You haven't watched anything yet.</div>}
				</div>
			)}
		</>
	)
}

export default Watched;
