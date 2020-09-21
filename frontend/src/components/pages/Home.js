import React, { useState, useEffect, useRef, Fragment } from "react";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import clone from 'clone';

// components
import HomeTrailer from "./HomeTrailer";
import MovieItem from "./MovieItem";

// to-do
// remove duplicates from search results

const Home = () =>
{
	const [movies, setMovies] = useState([]);

	const [moviesSearch, setMoviesSearch] = useState([]);

	const [moviesByGenre, setMoviesByGenre] = useState([]);

	const [trailerMovieId, setTrailerMovieId] = useState(null);
	const [searchInput, setSearchInput] = useState("");
	const [searchHasResults, setSearchHasResults] = useState(false);
	const [currentPage, setCurrentPage] = useState(2);
	const [currentPageGenre, setCurrentPageGenre] = useState(0);
	const [hasMoreItems, setHasMoreItems] = useState(true);
	const [hasMoreGenres, setHasMoreGenres] = useState(true);

	const [loadingPage, setLoadingPage] = useState(true);
	const [loadingMovies, setLoadingMovies] = useState(true);

	const isInitialMount = useRef(true);

	useEffect(() =>
	{
		console.log("useEffect 1");
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();

		(async () =>
		{
			try
			{
				// fetch 10 latest movies
				let response = await axios.get(
					"https://yts.mx/api/v2/list_movies.json?sort_by=year&minimum_rating=5&limit=10",
					{ cancelToken: source.token }
				);
				console.log("10 latest movies", response.data.data);

				setMovies(response.data.data);

				// pick a random video out of the 10 for trailer
				while (response.data.data.movies.length > 0)
				{
					let randomIndex = Math.round(Math.random() * 9);

					if (response.data.data.movies[randomIndex].yt_trailer_code !== "")
					{
						setTrailerMovieId(response.data.data.movies[randomIndex].id)
						break;
					}
					else
						response.data.data.movies.splice(randomIndex, 1);
				}

				setLoadingPage(false);
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
			setLoadingMovies(false);
		}
		else
		{
			setLoadingMovies(true);
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

						setMoviesSearch(response.data.data);

						if (response.data.data.movie_count > 20)
							setHasMoreItems(true);
						else
							setHasMoreItems(false);

						setLoadingMovies(false);
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
		let moviesCopy = clone(moviesSearch);
		const response = await axios.get(
			`https://yts.mx/api/v2/list_movies.json?page=${currentPage}&limit=20&sort_by=year&minimum_rating=5&query_term=${searchInput}`
		);

		for (let i = 0; response.data.data.movies[i]; i++)
			moviesCopy.movies.push(response.data.data.movies[i]);

		setMoviesSearch(moviesCopy);
		setCurrentPage(currentPage + 1);

		console.log("moviesSearch", moviesCopy);

		// check if has more items
		if (moviesCopy.movies.length < moviesCopy.movie_count)
			setHasMoreItems(true);
		else
			setHasMoreItems(false);
	};

	const getMoviesByGenre = async () =>
	{
		console.log("currentPageGenre", currentPageGenre);

		let genres = ["Action", "Animation", "Adventure", "Biography", "Comedy",
		"Crime", "Documentary", "Drama", "Family", "Fantasy",
		"History", "Horror", "Music", "Musical", "Mystery", "Romance",
		"Sci-Fi", "Sport", "Thriller",
		"War", "Western"];

		const response = await axios.get(
			"https://yts.mx/api/v2/list_movies.json?&sort_by=year&minimum_rating=5&limit=10&genre=" + genres[currentPageGenre]
		);
		let tmp = clone(moviesByGenre);
		tmp[currentPageGenre] = response.data.data.movies;
		tmp[currentPageGenre].genre = genres[currentPageGenre];
		console.log("tmp", tmp, "Get movies page: ", currentPageGenre);
		setCurrentPageGenre(currentPageGenre + 1);
		setMoviesByGenre(tmp);

		// check if has more items
		if (currentPageGenre < 20)
				setHasMoreGenres(true);
			else
				setHasMoreGenres(false);
	}

	return (
		<Fragment> 
			{loadingPage ? <div className="loading"></div> :
				<Fragment>
					<HomeTrailer id={trailerMovieId} />
					<input
						className="search-bar"
						type="text"
						name="searchinput"
						placeholder="Enter Movie Title"
						autoComplete="off"
						value={searchInput}
						onChange={changeSearchInput}
					/>
					{loadingMovies ? <div className="loading"></div> :
						<Fragment>
							{searchHasResults && searchInput !== "" ?
								<InfiniteScroll
									dataLength={typeof moviesSearch.movies !== "undefined" ? moviesSearch.movies.length : 0}
									next={handleLoadMore}
									hasMore={hasMoreItems}
									loader={<div className="loading"></div>}
								>
								{loadingMovies && <div className="loading"></div>}
								{!loadingMovies && (
									<Fragment>
										<h2 className="center bg-black100 py-4 mt-4">{moviesSearch.movie_count} Results</h2>
										<div className="movie-items-container">
											{searchHasResults && moviesSearch.movies.map (movie => (
												<Fragment key={movie.imdb_code}>
													<MovieItem movie={movie}/>
												</Fragment>
												)
											)}
											{moviesSearch.movie_count === 0 && <h4>Oh snap, no results.</h4>}
										</div>
									</Fragment>
								)}
								</InfiniteScroll> :
								<InfiniteScroll
									dataLength={currentPageGenre}
									next={getMoviesByGenre}
									hasMore={hasMoreGenres}
									loader={<div className="loading"></div>}
								>
									<h2 className="center bg-black100 py-4 mt-4">New Releases</h2>
									<div className="movie-items-container">
										{movies.movies && movies.movies.map (movie => (
												<Fragment key={movie.imdb_code}>
													<MovieItem movie={movie}/>
												</Fragment>
												)
											)}
									</div>
									{moviesByGenre && moviesByGenre.map (movieByGenre => (
										<Fragment>
											<h2 className="center bg-black100 py-4 mt-5">New in {movieByGenre.genre}</h2>
											<div className="movie-items-container">
												{movieByGenre && movieByGenre.map (movie => (
														<Fragment key={movie.imdb_code}>
															<MovieItem movie={movie}/>
														</Fragment>
														)
													)}
											</div>
										</Fragment>
									))}
								</InfiniteScroll>
							}
						</Fragment>
					}
				</Fragment>
			}
		</Fragment>
	)
}

export default Home;