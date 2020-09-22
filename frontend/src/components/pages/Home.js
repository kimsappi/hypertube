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
	const [moviesByGenre, setMoviesByGenre] = useState([]);
	const [trailerMovieId, setTrailerMovieId] = useState(null);
	const [currentPage, setCurrentPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(true);

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

	const handleLoadMore = async () =>
	{
		console.log("currentPage", currentPage);

		let genres = ["Action", "Animation", "Adventure", "Biography", "Comedy",
		"Crime", "Documentary", "Drama", "Family", "Fantasy",
		"History", "Horror", "Music", "Musical", "Mystery", "Romance",
		"Sci-Fi", "Sport", "Thriller",
		"War", "Western"];

		const response = await axios.get(
			"https://yts.mx/api/v2/list_movies.json?&sort_by=year&minimum_rating=5&limit=10&genre=" + genres[currentPage]
		);
		let tmp = clone(moviesByGenre);
		tmp[currentPage] = response.data.data.movies;
		tmp[currentPage].genre = genres[currentPage];
		console.log("tmp", tmp, "Get movies page: ", currentPage);
		setCurrentPage(currentPage + 1);
		setMoviesByGenre(tmp);

		// check if has more items
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
						<h2 className="center bg-black100 py-2 mt-2">New Releases</h2>
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