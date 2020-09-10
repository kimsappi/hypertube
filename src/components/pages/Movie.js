import React, { useState, useEffect, Fragment } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";

import ReactPlayer from "react-player";

const Movie = () =>
{
	const [movie, setMovie] = useState("");
	const [loading, setLoading] = useState(true);
	const { id } = useParams();

	useEffect(() =>
	{
		(async () =>
		{
			try
			{
				// fetch all movies
				const response = await axios.get("https://yts.mx/api/v2/movie_details.json?movie_id=" + id);

				console.log(response.data);
				
				setMovie(response.data.data.movie);
				setLoading(false);
			}
			catch (err)
			{
				console.error(err.message);
			}
		})();
	}, []);

	return (
		<Fragment>
			{loading && <div className="loading"></div>}
			{!loading && (
					<div className="movie-box">
					<div>
						<img className="movie-image-large p-4 bg-black100" src={movie.large_cover_image} alt='Profile'/>
					</div>
					<div>
						<div className="movie-details">
							<h1 className="color-white">{movie.title}</h1>
							{movie.description_full}
						</div>
						<div>
							<ReactPlayer url={"https://www.youtube.com/watch?v=" + movie.yt_trailer_code} />
						</div>
					</div>
				</div>
			)}
		</Fragment>
	)
}

export default Movie;