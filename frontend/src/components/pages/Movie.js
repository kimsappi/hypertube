import React, { useState, useEffect, useContext, Fragment } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from "axios";
import ReactPlayer from "react-player";

import StateContext from "../../context/StateContext";

import Comments from "./Comments";
import AddToMyList from './AddToMyList';

import image from "../../images/profile.jpg";

const Movie = () =>
{
	const CancelToken = axios.CancelToken;
	const source = CancelToken.source();
	
	const globalState = useContext(StateContext);
	const [movie, setMovie] = useState("");
	const [loading, setLoading] = useState(true);
	const { id } = useParams();

	useEffect(() =>
	{
		setLoading(true);

		(async () =>
		{
			try
			{
				// fetch all movies
				const response = await axios.get(
					"https://yts.mx/api/v2/movie_details.json?with_cast=true&movie_id=" + id,
					{ cancelToken: source.token });

				console.log("movie.data", response.data.data.movie);
				
				setMovie(response.data.data.movie);

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
	}, [id]);

	

	return (
		<Fragment>
			{loading && <div className="loading"></div>}
			{!loading && (
				<div className="ram-container">
					<div className="ram">
						<div className="movie-left-container">
							<img className="movie-image-large" src={movie.large_cover_image} alt='Profile'/>
						</div>
						<div className="movie-center-column">
							{movie.yt_trailer_code !== "" &&
							<ReactPlayer
								width="100%"
								playing={true}
								loop={true}
								muted={globalState.mute}
								controls={true}
								url={"https://www.youtube.com/watch?v=" + movie.yt_trailer_code + "&t=10"}
								config={{
									youtube: {
										playerVars: { 'origin': window.location.origin }
									}
								}}
							/>}
							<AddToMyList id={id} />
							<div className="p-5">
								<h1 className="color-white">{movie.title_long}</h1>
								<div className="small color-black70 my-2">{movie.genres.map(genre => genre.toUpperCase(genre) + " ")}</div>
								<p>{movie.description_intro}</p>
								{typeof movie.cast !== "undefined" && (
									<Fragment>
										<h3 className="color-white center">Starring</h3>
										<div className="cast-member-container">
											{movie.cast.map(cast_member =>
												<div className="cast-member-item" key={cast_member.name}>
													<a href={"https://www.imdb.com/name/nm" + cast_member.imdb_code} target="blank">
														<img
															className="cast-member-image"
															src={typeof cast_member.url_small_image !== "undefined" ? cast_member.url_small_image : image}
															alt={cast_member.name}
														/>
													</a>
													<div className="small center pt-2">{cast_member.name}</div>
												</div>
											)}
										</div>
									</Fragment>
								)}
							</div>
							<Link className="center" to={"/cinema/xt=urn:btih:" + movie.torrents[0].hash + "&dn=" + movie.title.replace(/ /g, "+") + "&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fp4p.arenabg.ch%3A1337&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337/" + id}>PLAY MOVIE</Link>
							
							{!loading && movie.torrents.map((torrent) =>
								<Link key={torrent.url} className="center" to={"/cinemaAlt/xt=urn:btih:" + torrent.hash + "&dn=" + movie.title.replace(/ /g, "+") + "&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fp4p.arenabg.ch%3A1337&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337/" + id + "/" + movie.imdb_code}>{torrent.quality} {torrent.type}</Link>
								)}
						</div>
						<div className="movie-right-column">
							<Comments movieId={id}/>
						</div>
					</div>
				</div>
			)}
		</Fragment>
	)
}

export default Movie;
