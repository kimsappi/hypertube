import React, { useState, useEffect, Fragment } from "react";
import ReactPlayer from "react-player";
import axios from "axios";

const Trailer = ({ id }) =>
{
	const [movie, setMovie] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() =>
	{
		(async () =>
		{
			try
			{
				// fetch all movies
				const response = await axios.get("https://yts.mx/api/v2/movie_details.json?movie_id=" + id);

				console.log("movie.data", response.data.data.movie);
				
				setMovie(response.data.data.movie);
				setIsLoading(false);
			}
			catch (err)
			{
				console.error(err.message);
			}
		})();
	}, []);

	return (
		<Fragment>
			{isLoading && <div className="loading"></div>}
			{!isLoading && (
				<div className="flex-center p-4 bg-black100">
					<div className="movie-title-huge">{movie.title_english}</div>
					{movie.yt_trailer_code !== "" ?
					<ReactPlayer
						width="100%"
						playing={true}
						loop={true}
						volume={0}
						controls={false}
						url={"https://www.youtube.com/watch?v=" + movie.yt_trailer_code  + "&t=10&modestbranding=1"} /> :
						<p className="center color-black70">Oh snap, no trailer found.</p>}
				</div>
			)}
		</Fragment>
	)
}

export default Trailer;