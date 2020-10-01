import React, { useState, useEffect, Fragment } from "react";
import ReactPlayer from "react-player";
import axios from "axios";

import Hoverbox from "./Hoverbox"

const HomeTrailer = ({ id }) =>
{
	const [movie, setMovie] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() =>
	{
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();
	
		(async () =>
		{
			try
			{
				// fetch movie data
				const response = await axios.get(
					"https://yts.mx/api/v2/movie_details.json?with_images=true&movie_id=" + id,
					{ cancelToken: source.token }
				);
	
				setMovie(response.data.data.movie);
				setIsLoading(false);
			}
			catch (err)
			{
				console.error(err.message);
			}
		})()
		return () => source.cancel();
	}, [id]);

	return (
		<Fragment>
			{isLoading && <div className="loading"></div>}
			{!isLoading && (
				<Fragment>
					<Hoverbox movie={movie} />
					<div className="flex-center bg-black100" style={{backgroundImage: "url('')"}}>
						{movie.yt_trailer_code !== "" ?
							<ReactPlayer
								width="100%"
								playing={true}
								loop={true}
								muted={true}
								controls={false}
								url={"https://www.youtube.com/watch?v=" + movie.yt_trailer_code + "&t=7"}
								// config={{
								// 	youtube: {
								// 		playerVars: { origin: "localhost:3000" }
								// 	}
								// }}
							/> :
						<p className="center color-black70">Oh snap, no trailer found.</p>}
					</div>
				</Fragment>
			)}
		</Fragment>
	)
}

export default HomeTrailer;