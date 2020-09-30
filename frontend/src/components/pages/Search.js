import React, { useState, useEffect, useRef, Fragment } from "react";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import clone from 'clone';

// components
import MovieItem from "./MovieItem";

const Search = () =>
{
	const [movieCount, setMovieCount] = useState(0);
	const [movies, setMovies] = useState([]);
	const [searchInput, setSearchInput] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMoreItems, setHasMoreItems] = useState(true);
	const [loading, setLoading] = useState(true);

	const [genre, setGenre] = useState("all");
	const [sortBy, setSortBy] = useState("download_count");
	const [minimumRating, setMinimumRating] = useState("5");

	const isInitialMount = useRef(true);

	// timer is activated each time the user types something in the search bar
	// if the user does not type anything for 0.7 seconds, search is performed
	// this prevents performing a new search each time the users inputs one characters
	useEffect(() =>
	{
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();
		
		setLoading(true);

		let timer = setTimeout(() =>
		{
			setMovies([]);
			(async () =>
			{
				try
				{
					// fetch all movies
					const response = await axios.get(
						`https://yts.mx/api/v2/list_movies.json?genre=${genre}&sort_by=${sortBy}&minimum_rating=${minimumRating}&query_term=${searchInput}`,
						{ cancelToken: source.token }
					);

					setMovieCount(response.data.data.movie_count);
					setMovies(response.data.data.movies);
					setCurrentPage(2);

					// check if has more items
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
		}, 500);
		return () =>
		{
			source.cancel();
			clearTimeout(timer);
		}
	}, [searchInput, genre, minimumRating, sortBy]);

	// update state when user inputs text in search bar
	const changeSearchInput = (event) => setSearchInput(event.target.value);

	// load more results for Infinite Scroller
	const handleLoadMore = async () =>
	{
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();
		try
		{
			let tmp = clone(movies);
			const response = await axios.get(
				`https://yts.mx/api/v2/list_movies.json?page=${currentPage}&genre=${genre}&sort_by=${sortBy}&minimum_rating=${minimumRating}&query_term=${searchInput}`,
				{ cancelToken: source.token }
			);
	
			setMovieCount(response.data.data.movie_count);

			for (let i = 0; response.data.data.movies[i]; i++)
				tmp.push(response.data.data.movies[i]);

			setMovies(tmp);
			setCurrentPage(currentPage + 1);
	
			// check if has more items
			if (tmp.length < response.data.data.movie_count)
				setHasMoreItems(true);
			else
				setHasMoreItems(false);
		}
		catch (err)
		{
			if (axios.isCancel(err))
				source.cancel();
			console.error(err.message);
		}
	};

	return (
		<Fragment>
			<h1 className="center mt-4"><i className="fas fa-search color-white"></i> Search</h1>
			<div className="search-form">
				<div className="m-2">
					<label className="small ml-2">Search Term</label>
					<input
						type="text"
						name="searchinput"
						placeholder="Enter Movie Title"
						autoComplete="off"
						value={searchInput}
						onChange={changeSearchInput}
					/>
				</div>
				<div className="m-2">
					<label className="small ml-2">Genre</label>
					<select
						name="genre"
						value={genre}
						onChange={(event) => setGenre(event.target.value)}
					>
						<option value="all">All</option>
						<option value="action">Action</option>
						<option value="animation">Animation</option>
						<option value="adventure">Adventure</option>
						<option value="biography">Biography</option>
						<option value="comedy">Comedy</option>
						<option value="crime">Crime</option>
						<option value="documentary">Documentary</option>
						<option value="drama">Drama</option>
						<option value="family">Family</option>
						<option value="fantasy">Fantasy</option>
						<option value="history">History</option>
						<option value="horror">Horror</option>
						<option value="music">Music</option>
						<option value="musical">Musical</option>
						<option value="mystery">Mystery</option>
						<option value="romance">Romance</option>
						<option value="sci-Fi">Sci-fi</option>
						<option value="sport">Sport</option>
						<option value="thriller">Thriller</option>
						<option value="war">War</option>
						<option value="western">Western</option>
					</select>
				</div>
				<div className="m-2">
					<label className="small ml-2">Rating</label>
					<select
						name="minimumRating"
						value={minimumRating}
						
						onChange={(event) => setMinimumRating(event.target.value)}
					>
						<option value="9">9+</option>
						<option value="8">8+</option>
						<option value="7">7+</option>
						<option value="6">6+</option>
						<option value="5">5+</option>
						<option value="4">4+</option>
						<option value="3">3+</option>
						<option value="2">2+</option>
						<option value="1">1+</option>
					</select>
				</div>
				<div className="m-2">
					<label className="small ml-2">Sort By</label>
					<select
						name="sortBy"
						value={sortBy}
						onChange={(event) => setSortBy(event.target.value)}
					>
						<option value="download_count">Downloads</option>
						<option value="rating">Rating</option>
						<option value="like_count">Likes</option>
						<option value="title">Title</option>
					</select>
				</div>
			</div>

			{loading && <div className="loading"></div>}
			{!loading && (
				<InfiniteScroll
					dataLength={typeof movies !== "undefined" ? movies.length : 0}
					next={handleLoadMore}
					hasMore={hasMoreItems}
					loader={<div className="loading"></div>}
				>
				{loading && <div className="loading"></div>}
				{!loading && (
					<Fragment>
						<h4 className="center my-4">{movieCount} {movieCount === 1 ? "result" : "results"}</h4>
						<div className="movie-items-container">
							{typeof movies !== "undefined" && movies.map(movie => (
								<Fragment key={movie.imdb_code}>
									<MovieItem movie={movie}/>
								</Fragment>
								)
							)}
						</div>
					</Fragment>
				)}
				</InfiniteScroll> 
			)}
		</Fragment>
	)
}

export default Search;