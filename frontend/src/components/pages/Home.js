// /* eslint-disable */

import React, { useState, useEffect, useContext, useRef, Fragment } from "react";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import clone from 'clone';

import genresInRandomOrder from '../../utils/genresInRandomOrder';

import StateContext from "../../context/StateContext";

// components
import HomeTrailer from "./HomeTrailer";
import MovieItem from "./MovieItem";

const Home = () =>
{
	const globalState = useContext(StateContext);
	const [moviesWatched, setMoviesWatched] = useState([]);
	const [movies, setMovies] = useState([]);
	const [moviesByGenre, setMoviesByGenre] = useState([]);
	const [trailerMovieId, setTrailerMovieId] = useState(null);
	const [currentPage, setCurrentPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(true);
	const genres = useRef(genresInRandomOrder());

	useEffect(() =>
	{
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();

		(async () =>
		{
			try
			{
				// fetch "Watched" movies 
				let list = [];
				const movieIds = Object.entries(globalState.watched);
				const movieIdsFiltered = movieIds.filter(movie => movie[1] < 100);

				for (let i = 0; i < movieIdsFiltered.length; i++)
				{
					const res = await axios.get("https://yts.mx/api/v2/movie_details.json?movie_id=" + movieIdsFiltered[i][0]);
					list.push(res.data.data.movie);
				}
				setMoviesWatched(list);

				// fetch 10 latest movies
				let response = await axios.get(
					"https://yts.mx/api/v2/list_movies.json?sort_by=year&minimum_rating=5&limit=10",
					{ cancelToken: source.token }
				);
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

				setLoading(false);
			}
			catch (err)
			{
				if (axios.isCancel(err))
					source.cancel();
				else
					console.error(err.message);
			}
		})()
		return () => source.cancel();
	}, [globalState.watched]);

	const handleLoadMore = async () =>
	{
		const response = await axios.get(
			"https://yts.mx/api/v2/list_movies.json?&sort_by=year&minimum_rating=5&limit=10&genre=" + genres.current[currentPage]
		);
		let tmp = clone(moviesByGenre);
		tmp[currentPage] = response.data.data.movies;
		tmp[currentPage].genre = genres.current[currentPage];
		setCurrentPage(currentPage + 1);
		setMoviesByGenre(tmp);

		if (currentPage < 20)
			setHasMore(true);
		else
			setHasMore(false);
	}

	return (
		<Fragment> 
			{loading ? <div className="loading"></div> :
				<Fragment>
					<HomeTrailer id={trailerMovieId} />
					<InfiniteScroll
						dataLength={currentPage}
						next={handleLoadMore}
						hasMore={hasMore}
						loader={<div className="loading"></div>}
					>
						{moviesWatched.length > 0 && (
							<Fragment>
								<h2 className="center bg-black100 py-2 mt-2">Continue Watching</h2>
								<div className="movie-items-container">
									{moviesWatched && moviesWatched.map (movie => (
											<Fragment key={movie.imdb_code}>
												<MovieItem movie={movie}/>
											</Fragment>
											)
										)}
								</div>
							</Fragment>
						)}

						<h2 className="center bg-black100 py-2 mt-2">New Releases</h2>
						<div className="movie-items-container">
							{movies.movies && movies.movies.map (movie => (
									<Fragment key={movie.imdb_code}>
										<MovieItem movie={movie}/>
									</Fragment>
									)
								)}
						</div>

						{moviesByGenre && moviesByGenre.map ((movieByGenre, index) => (
							<Fragment key={index}>
								<h2 className="center bg-black100 py-2">New in {movieByGenre.genre}</h2>
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
				</Fragment>
			}
		</Fragment>
	)
}

export default Home;
