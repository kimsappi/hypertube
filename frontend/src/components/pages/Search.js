import React, { useState, useEffect, useRef, Fragment } from "react";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import clone from 'clone';

// components
import MovieItem from "./MovieItem";

const Search = () =>
{
	const [movies, setMovies] = useState([]);
	const [searchInput, setSearchInput] = useState("");
	const [searchHasResults, setSearchHasResults] = useState(false);
	const [currentPage, setCurrentPage] = useState(2);
	const [hasMoreItems, setHasMoreItems] = useState(true);
	const isInitialMount = useRef(true);
	const [loading, setLoading] = useState(true);

	useEffect(() =>
	{
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();

		(async () =>
		{
			try
			{
				// fetch 10 latest movies
				let response = await axios.get(
					"https://yts.mx/api/v2/list_movies.json?sort_by=peers&minimum_rating=5&limit=10",
					{ cancelToken: source.token }
				);
				console.log("10 most popular movies", response.data.data);

				setMovies(response.data.data);
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
		if (isInitialMount.current)
		{
			isInitialMount.current = false;
			setLoading(false);
		}
		else
		{
			setLoading(true);
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
						const response = await axios.get(
							"https://yts.mx/api/v2/list_movies.json?sort_by=year&minimum_rating=5&limit=20&query_term=" + searchInput,
							{ cancelToken: source.token }
						);

						console.log("response.data.data.movie_count", response.data.data.movie_count);

						if (response.data.data.movie_count > 0)
							setSearchHasResults(true);
						else
							setSearchHasResults(false);

						setMovies(response.data.data);

						if (response.data.data.movie_count > 20)
							setHasMoreItems(true);
						else
							setHasMoreItems(false);

						setLoading(false);
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
				setCurrentPage(2);
				source.cancel();
			}
		}
	}, [searchInput]);

	// update state when user inputs text in search bar
	const changeSearchInput = event => setSearchInput(event.target.value);

	// load more results for Infinite Scroller
	const handleLoadMore = async () =>
	{
		let tmp = clone(movies);
		const response = await axios.get(
			`https://yts.mx/api/v2/list_movies.json?page=${currentPage}&limit=20&sort_by=year&minimum_rating=5&query_term=${searchInput}`
		);

		for (let i = 0; response.data.data.movies[i]; i++)
			tmp.movies.push(response.data.data.movies[i]);

		setMovies(tmp);
		setCurrentPage(currentPage + 1);

		console.log("moviesSearch", tmp);

		// check if has more items
		if (tmp.movies.length < tmp.movie_count)
			setHasMoreItems(true);
		else
			setHasMoreItems(false);
	};

	return (
		<Fragment>
			<input
				className="search-bar"
				type="text"
				name="searchinput"
				placeholder="Enter Movie Title"
				autoComplete="off"
				value={searchInput}
				onChange={changeSearchInput}
			/>
			{loading ? <div className="loading"></div> :
				<Fragment>
					{searchHasResults && searchInput !== "" ?
						<InfiniteScroll
							dataLength={typeof movies.movies !== "undefined" ? movies.movies.length : 0}
							next={handleLoadMore}
							hasMore={hasMoreItems}
							loader={<div className="loading"></div>}
						>
						{loading && <div className="loading"></div>}
						{!loading && (
							<Fragment>
								<div className="center py-4 mt-4">{movies.movie_count} results</div>
								<div className="movie-items-container">
									{searchHasResults && movies.movies.map (movie => (
										<Fragment key={movie.imdb_code}>
											<MovieItem movie={movie}/>
										</Fragment>
										)
									)}
									{movies.movie_count === 0 && <h4>Oh snap, no results.</h4>}
								</div>
							</Fragment>
						)}
						</InfiniteScroll> : ""
					}
				</Fragment>
			}
		</Fragment>
	)
}

export default Search;