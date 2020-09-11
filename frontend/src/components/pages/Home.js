import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";

// components
import MovieItem from "./MovieItem";

const Home = () =>
{
	const [movies, setMovies] = useState("");
	const [sortBy, setSortBy] = useState("1");
	const [loading, setLoading] = useState(true);

	useEffect(() =>
	{
		(async () =>
		{
			try
			{
				// fetch all movies
				const response = await axios.get("https://yts.mx/api/v2/list_movies.json?sort_by=date_added&limit=50");

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

	const handleSort = (event) => setSortBy(event.target.value);

	return (
		<Fragment>
			{loading && <div className="loading"></div>}
			{!loading && (
				<Fragment>
					<div className="w-50 m-a">
						<label>Sort by:</label>
						<select name="sort" id="sort" defaultValue={sortBy} onChange={handleSort}>
							<option value="1">title (descending)</option>
							<option value="2">title (ascending)</option>
						</select>
					</div>
					<div className="flex-center m-5">
						{movies.map (movie => (
							<Fragment key={movie.id}>
								<MovieItem movie={movie}/>
							</Fragment>
							)
						)}
					</div>
				</Fragment>
			)}
		</Fragment>
	)
}

export default Home;