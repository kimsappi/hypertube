import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';

// components
import Trailer from "./utilities/Trailer";
import MovieItem from "./MovieItem";

const Home = () =>
{
	const [movies, setMovies] = useState([]);
	const [firstMovieId, setFirstMovieId] = useState(null);
	const [searchInput, setSearchInput] = useState("");
	// const [currentPage, setCurrentPage] = useState(0);
	const [loading, setLoading] = useState(true);
	const [hasMoreItems, setHasMoreItems] = useState(true);

	useEffect(() =>
	{
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();

		(async () =>
		{
			try
			{
				// fetch all movies
				const response = await axios.get("https://yts.mx/api/v2/list_movies.json?sort_by=year", { cancelToken: source.token });

				console.log("movies", response.data.data.movies);

				// setCurrentPage(currentPage + 1);

				setMovies(response.data.data);

				// pick a random video for trailer
				setFirstMovieId(response.data.data.movies[Math.floor(Math.random() * 20)].id)

				setLoading(false);
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
	// const handleLoadMore = () =>
	// {
	// 	let usersSortedCopy = clone(usersSorted).slice(0, (currentPage + 1) * 30);
	// 	setItems(usersSortedCopy);
	// 	currentPage + 1 < numberOfPages ? setHasMoreItems(true) : setHasMoreItems(false);
	// 	setCurrentPage(currentPage + 1)
	// };

	return (
		<Fragment>
			{loading && <div className="loading"></div>}
			{!loading && (
				<Fragment>
					{/* <InfiniteScroll
					dataLength={items.length}
					next={handleLoadMore}
					hasMore={hasMoreItems}
					loader={<Spinner />}
					> */}
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
							<Fragment key={movie.id}>
								<MovieItem movie={movie}/>
							</Fragment>
							)
						)}
						{movies.movie_count === 0 && <h2>Oh snap, no results.</h2>}
					</div>
					{/* </InfiniteScroll> */}
				</Fragment>
			)}
		</Fragment>
	)
}

export default Home;