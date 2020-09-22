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

	useEffect(() =>
	{
		(async () =>
		{
			try
			{
				let list = [];

				for (let i = 0; i < globalState.myList.length; i++)
				{
					const res = await axios.get("https://yts.mx/api/v2/movie_details.json?movie_id=" + globalState.myList[i]);
					list.push(res.data.data.movie);
				}

				setMyList(list);
				setLoading(false);
			}
			catch(err)
			{

			}
		})()
	}, [render]);

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
				<div className="movie-items-container">
					{myList.length ? myList.map (movie => (
						<Fragment key={movie.imdb_code}>
								<MovieItem movie={movie}/>
						</Fragment>
						)
					) :
					<div className="mt-4">Your list is empty</div>}
				</div>
			)}
		</Fragment>
	)
}

export default MyList;
