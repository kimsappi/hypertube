import React, { useState, useEffect, Fragment } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import StateContext from "../../context/StateContext";

import Hoverbox from "./Hoverbox"

const HomeTrailer = ({ id }) =>
{
	const [movie, setMovie] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() =>
	{
		(async () =>
		{
			try
			{
				// fetch movie data
				const response = await axios.get("https://yts.mx/api/v2/movie_details.json?with_images=true&movie_id=" + id);

				console.log("trailer movie.data", response.data.data.movie);
				
				setMovie(response.data.data.movie);
				setIsLoading(false);
			}
			catch (err)
			{
				console.error(err.message);
			}
		})();
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
							/> :
						<p className="center color-black70">Oh snap, no trailer found.</p>}
					</div>
				</Fragment>
			)}
		</Fragment>
	)
}

export default HomeTrailer;