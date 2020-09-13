import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import clone from 'clone';

// components
import Trailer from "./utilities/Trailer";
import MovieItem from "./MovieItem";

const Home = () =>
{
	const [movies, setMovies] = useState([]);
	const [firstMovieId, setFirstMovieId] = useState(null);
	const [searchInput, setSearchInput] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [hasMoreItems, setHasMoreItems] = useState(true);

	useEffect(() =>
	{
		console.log("useEffect 1");
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();

		(async () =>
		{
			try
			{
				// fetch all movies
				const response = await axios.get("https://yts.mx/api/v2/list_movies.json?page=0&limit=20&sort_by=year&minimum_rating=6", { cancelToken: source.token });

				console.log("movies", response.data.data);

				setCurrentPage(currentPage + 1);

				setMovies(response.data.data);

				// pick a random video for trailer
				setFirstMovieId(response.data.data.movies[Math.floor(Math.random() * 20)].id)

				setIsLoading(false);
			}
			catch (err)
			{
				if (axios.isCancel(err))
					source.cancel();
				console.error(err.message);
			}
			return () => source.cancel();
		})();
	}, []);

	// timer is activated each time the user types something in the search bar
	// if the user does not type anything for 0.7 seconds, search is performed
	// this prevents performing a new search each time the users inputs one characters
	useEffect(() =>
	{
		console.log("useEffect 2");
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();

		let timer = setTimeout(() =>
		{
			(async () =>
			{
				try
				{
					// fetch all movies
					const response = await axios.get("https://yts.mx/api/v2/list_movies.json?sort_by=year&minimum_rating=6&query_term=" + searchInput, { cancelToken: source.token });

					setMovies(response.data.data);
					setHasMoreItems(false); 
				}
				catch (err)
				{
					if (axios.isCancel(err))
						source.cancel();
					console.error(err.message);
				}
			})();
		}, 700);
		return () =>
		{
			clearTimeout(timer);
			source.cancel();
		}
	  }, [searchInput]);

	// update state when user inputs text in search bar
	const changeSearchInput = event => setSearchInput(event.target.value);

	// // load more results for Infinite Scroller
	const handleLoadMore = async () =>
	{
		let moviesCopy = clone(movies);
		const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?page=${currentPage}&limit=20&sort_by=year&minimum_rating=6`);

		// combine objects
		for (let i = 0; response.data.data.movies[i]; i++)
			moviesCopy.movies.push(response.data.data.movies[i]);

		setMovies(moviesCopy);
		setCurrentPage(currentPage + 1);

		// has more items
		if (moviesCopy.movies.length < moviesCopy.movie_count)
			setHasMoreItems(true);
		else
			setHasMoreItems(false);
	};

	return (
		<Fragment> 
			{isLoading && <div className="loading"></div>}
			{!isLoading && (
				<Fragment>
					<InfiniteScroll
						dataLength={movies.movies.length}
						next={handleLoadMore}
						// hasMore={true}
						hasMore={hasMoreItems}
						loader={<div className="loading"></div>}
					>
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
					<div className="flex-center mx-5 my-4">
						{movies.movie_count > 0 && movies.movies.map (movie => (
							<Fragment key={movie.imdb_code}>
								<MovieItem movie={movie}/>
							</Fragment>
							)
						)}
						{movies.movie_count === 0 && <h2>Oh snap, no results.</h2>}
					</div>
					</InfiniteScroll>
				</Fragment>
			)}
		</Fragment>
	)
}

export default Home;