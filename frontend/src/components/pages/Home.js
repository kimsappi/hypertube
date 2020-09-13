import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";

// components
import Trailer from "./Trailer";
import MovieItem from "./MovieItem";

const Home = () =>
{
	const [movies, setMovies] = useState([]);
	const [firstMovieId, setFirstMovieId] = useState(null);
	const [searchInput, setSearchInput] = useState("");
	// const [currentPage, setCurrentPage] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() =>
	{
		console.log("useEffect");

		(async () =>
		{
			try
			{
				// fetch all movies
				const response = await axios.get("https://yts.mx/api/v2/list_movies.json?sort_by=year&query_term=" + searchInput);

				console.log("movies", response.data.data.movies);

				// setCurrentPage(currentPage + 1);

				setMovies(response.data.data);

				// pick a random video for trailer
				setFirstMovieId(response.data.data.movies[Math.floor(Math.random() * 20)].id)

				setLoading(false);
			}
			catch (err)
			{
				console.error(err.message);
			}
		})();
	}, []);

	// timer is activated each time the user types something in the search bar
	// if the user does not type anything for 0.7 seconds, search is performed
	// this prevents performing a new search each time the users inputs one characters
	useEffect(() =>
	{
		let timer = setTimeout(() =>
		{
			(async () =>
			{
				try
				{
					// fetch all movies
					const response = await axios.get("https://yts.mx/api/v2/list_movies.json?sort_by=year&query_term=" + searchInput);
	
					setMovies(response.data.data);
				}
				catch (err)
				{
					console.error(err.message);
				}
			})();
		}, 700);

		return () => clearTimeout(timer);

	  }, [searchInput]);

	// update state when user inputs text in search bar
	const changeSearchInput = event => setSearchInput(event.target.value);

	return (
		<Fragment>
			{loading && <div className="loading"></div>}
			{!loading && (
				<Fragment>
					<Trailer id={firstMovieId} />
					<input
						className="search-bar"
						type="text"
						name="searchinput"
						placeholder="Enter Movie Title"
						autoComplete="off"
						value={searchInput}
						onChange={changeSearchInput}
					/>
					<div className="flex-center m-4">
						{movies.movie_count > 0 && movies.movies.map (movie => (
							<Fragment key={movie.id}>
								<MovieItem movie={movie}/>
							</Fragment>
							)
						)}
						{movies.movie_count === 0 && <h2>Oh snap, no results.</h2>}
					</div>
				</Fragment>
			)}
		</Fragment>
	)
}

export default Home;