import React, { useState, useEffect, Fragment } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from "axios";
import ReactPlayer from "react-player";

const Movie = () =>
{
	const [movie, setMovie] = useState("");
	const [loading, setLoading] = useState(true);
	const { id } = useParams();

	// const magnet = "xt=urn:btih:A7AF8A653A2624DEC763E8206C93884C4671B4DD&dn=South.Park.S23E07.HDTV.x264-SVA%5Bettv%5D&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2920%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.pirateparty.gr%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce";
	const magnet = "xt=urn:btih:664076B78DAF9233D85D12A398A44241CEAB7E7A&dn=A+Bug%27s+Life+%281998%29+%5B720p%5D+%5BYTS.MX%5D&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fp4p.arenabg.ch%3A1337&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337";

	useEffect(() =>
	{
		setLoading(true);

		(async () =>
		{
			try
			{
				// fetch all movies
				const response = await axios.get("https://yts.mx/api/v2/movie_details.json?movie_id=" + id);

				console.log("movie.data", response.data.data.movie);
				
				setMovie(response.data.data.movie);
				setLoading(false);
			}
			catch (err)
			{
				console.error(err.message);
			}
		})()
	}, [id]);



	return (
		<Fragment>
			{loading && <div className="loading"></div>}
			{!loading && (
				<div className="ram-container">
					<div className="ram">
						<div className="movie-left-column">
							<img className="movie-image-large p-4 bg-black100" src={movie.large_cover_image} alt='Profile'/>
						</div>
						<div className="movie-center-column">
							<h1 className="color-white">{movie.title_long}</h1>
							<div className="small color-black70 my-2">{movie.genres.map(genre => genre.toUpperCase(genre) + " ")}</div>
							<p>{movie.description_intro}</p>
							<Link className="center" to={"/cinema/" + magnet}>PLAY MOVIE</Link>
						</div>
						<div className="movie-right-column">
							<h3 className="color-white center">Trailer</h3>
							{movie.yt_trailer_code !== "" ? <ReactPlayer width="100%" url={"https://www.youtube.com/watch?v=" + movie.yt_trailer_code} /> : <p className="center color-black70">Oh snap, no trailer found.</p>}
						</div>
					</div>
				</div>
			)}
		</Fragment>
	)
}

export default Movie;