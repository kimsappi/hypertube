// /* eslint-disable */

import React, { useEffect, useState, useRef, useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import ReactPlayer from "react-player";

import StateContext from "../../context/StateContext";

import imdbLogo from "../../images/imdb_logo.png"
// import metacriticLogo from "../../images/metacritic_logo.svg"

const PercentageBar = ({ percentage }) => {
	const background = {
		position: 'absolute',
		bottom: '0',
		left: '0',
		height: '7px',
		backgroundColor: 'rgba(128, 128, 128, .5)',
		width: `100%`
	};

	const bar = {
		position: 'absolute',
		bottom: '0',
		left: '0',
		height: '7px',
		backgroundColor: 'red',
		width: `${percentage}%`
	};
	
	if (!percentage)
		return '';
	
	return (
		<div style={background}>
			<div style={bar}></div>
		</div>
	);
};

const MovieItem = ({ movie }) =>
{
	const globalState = useContext(StateContext);
	const [mouseHover, setMouseHover] = useState(false);
	const [movieData, setMovieData] = useState(null);
	const isInitialMount = useRef(true);
	const timer = useRef(0);

	const percentage = globalState.watched[movie.id] || 0;

	useEffect(() =>
	{
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();

		if (isInitialMount.current)
		{
			isInitialMount.current = false;
		}
		else
		{
			(async () =>
			{
				if (mouseHover && movieData === null)
				{
					try
					{
						// fetch all movies
						const response = await axios.get(
							"http://www.omdbapi.com/?i=" + movie.imdb_code + "&apikey=cc729f53",
							{ cancelToken: source.token }
						);

						setMovieData(response.data);
					}
					catch (err)
					{
						if (axios.isCancel(err))
							source.cancel();
						else
							console.error(err.message);
					}
				}
			})();
		}
		return () => source.cancel()
	}, [mouseHover, movie.imdb_code]);
	
	// clear timers on exit
	useEffect(() =>
	{
		return () => clearTimeout(timer.current)
	}, []);

	const handleMouseEnter = () =>
	{
		timer.current = setTimeout(() =>
		{
			setMouseHover(true);
		}, 400);
	}

	const handleMouseLeave = () =>
	{
		clearTimeout(timer.current);
		setMouseHover(false);
	}

	return (
		<Link to={"/movie/" + movie.id} style={{ textDecoration: 'none' }}>
		<div className="movie-item" style={{backgroundImage: `url(${movie.medium_cover_image})`, position: 'relative'}} onMouseEnter={() => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()}>
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
									muted={globalState.mute}
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
			<PercentageBar percentage={percentage} />
		</div>
		</Link>
	)
}

export default MovieItem;
