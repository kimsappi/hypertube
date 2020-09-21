import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import ReactPlayer from "react-player";

import imdbLogo from "../../images/imdb_logo.png"
// import metacriticLogo from "../../images/metacritic_logo.svg"

const MovieItem = ({ movie }) =>
{
	const [mouseHover, setMouseHover] = useState(false);
	const [movieData, setMovieData] = useState(null);
	const isInitialMount = useRef(true);

	useEffect(() =>
	{
		if (isInitialMount.current)
			isInitialMount.current = false;
		else
		{
			const CancelToken = axios.CancelToken;
			const source = CancelToken.source();

			(async () =>
			{
				if (mouseHover && movieData === null)
				{
					try
					{
						// fetch all movies
						const response = await axios.get(
							"http://www.omdbapi.com/?i=" + movie.imdb_code + "&apikey=cc729f53"
						);
						
						setMovieData(response.data);
					}
					catch (err)
					{
						if (axios.isCancel(err))
							source.cancel();
						console.error(err.message);
					}
				}
			})();
			return () =>
			{
				source.cancel();
			}
		}
	}, [mouseHover]);

	return (
		<Link to={"/movie/" + movie.id} style={{ textDecoration: 'none' }}>
		<div className="movie-item" style={{backgroundImage: `url(${movie.medium_cover_image})`}} onMouseEnter={() => setMouseHover(true)} onMouseLeave={() => setMouseHover(false)}>
			{mouseHover && (
				<Fragment>
					<div className="test">
						{movieData && (
							<Fragment>
								<div className="mt-1 center">{movie.title_long}</div>
								<div className="ratings">
									<div className="flex">
										<img className="imdb-logo" src={imdbLogo} alt="IMDb Logo" /> 
										<div className="big ml-2">{movieData.imdbRating}</div>
									</div>
									{/* <div>
										{metacriticLogo} {movieData.metacriticRating}
									</div> */}
								</div>
								<ReactPlayer
									width="100%"
									height="120px"
									playing={true}
									loop={true}
									// volume={0}
									controls={false}
									url={"https://www.youtube.com/watch?v=" + movie.yt_trailer_code + "&t=7"}
									config={{
										youtube: {
										  playerVars: { modestbranding: 1 }
										}
									  }}
								/>
							</Fragment>
						)}
					</div>
				</Fragment>
			)}
		</div>
		</Link>
	)
}

export default MovieItem;