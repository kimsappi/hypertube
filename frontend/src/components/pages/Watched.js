import React, { useEffect, useState, useContext } from "react";
import axios from 'axios';

import MovieItem from "./MovieItem";

import StateContext from "../../context/StateContext";


const Watched = () =>
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
        const idList = Object.entries(globalState.watched);
        console.log(idList)

				for (let i = 0; i < idList.length; i++)
				{
          console.log(idList[i])
					const res = await axios.get("https://yts.mx/api/v2/movie_details.json?movie_id=" + idList[i][0]);
					list.push({
            movie: res.data.data.movie
          });
				}

				setMyList(list);
				setLoading(false);
			}
			catch(err)
			{

			}
		})()
	}, [render]);

	return (
		<>
			<h1 className="center m-4"><i className="fas fa-images color-white"></i> My List</h1>
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
