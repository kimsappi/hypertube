import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";

import MovieItem from "./MovieItem";

const Home = () =>
{
	const [movies, setMovies] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() =>
	{
		(async () =>
		{
			try
			{
				// fetch all movies
				const response = await axios.get("https://yts.mx/api/v2/list_movies.json");

				// needs another source as well

				console.log("movies", response.data.data.movies);
				
				setMovies(response.data.data.movies);
				setLoading(false);
			}
			catch (err)
			{
				console.error(err.message);
			}
		})();
	}, []);

	return (
		<Fragment>
			{loading && <div className="loading"></div>}
			{!loading && (
				<div className="flex-center">
					{movies.map (movie => (
						<Fragment key={movie.id}>
							<MovieItem movie={movie}/>
						</Fragment>
						)
					)}
				</div>
			)}
		</Fragment>
	)
}

export default Home;