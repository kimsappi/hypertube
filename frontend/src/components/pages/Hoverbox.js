import React, { useEffect, useState, Fragment } from 'react';
import axios from "axios";

const Hoverbox = ({ movie }) =>
{
	const [movieData, setMovieData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() =>
	{
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();
		(async () =>
		{
			try
			{
				// fetch all movies
				const response = await axios.get(
					"http://www.omdbapi.com/?i=" + movie.imdb_code + "&apikey=cc729f53"
				);
				setMovieData(response.data);
				setLoading(false);
				console.log(response.data);
			}
			catch (err)
			{
				if (axios.isCancel(err))
					source.cancel();
				console.error(err.message);
			}
		})();
	}, []);

	return (
		<div className="hoverbox">
			{/* {!loading && (
				movieData.Awards === "N/A" ? movieData.Rated : movieData.Awards
			)} */}
			{!loading && (
				<Fragment>
					<div className="left-box">
						<div className="flex-column">
							<div className="movie-title-huge">{movie.title_english}</div>
							<div>
								<button className="basic-button m-2"><i className="fas fa-play"></i> Play Movie</button>
								<button className="basic-button m-2"><i className="fas fa-info"></i> More Info</button>
							</div>
						</div>
					
					</div>
					<div className="right-box">
						<div>{movieData.Plot}</div>
						<div className="color-black50 center">{movieData.Country} | {movieData.Year} | {movieData.Runtime}</div>
					</div>
				</Fragment>
			)}
		</div>
	)
}

export default Hoverbox;