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
			}
			catch (err)
			{
				if (axios.isCancel(err))
					source.cancel();
				else
					console.error(err.message);
			}
		})();
	}, []);

	return (
		<div className="hoverbox">
			{!loading && (
				<Fragment>
					<div className="left-box">
						<div className="flex-column">
							<div className="movie-title-huge">{movie.title_english}</div>
							<div>
								<button className="basic-button m-2"><i className="fas fa-play"></i> Play Movie</button>
								{/* <Link key={torrent.url} className="center" to={"/cinemaAlt/xt=urn:btih:" + torrent.hash + "&dn=" + movie.title.replace(/ /g, "+") + "&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fp4p.arenabg.ch%3A1337&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337/" + id + "/" + movie.imdb_code}>{torrent.quality} {torrent.type}</Link> */}
							</div>
						</div>
					</div>
					<div className="right-box">
						<div className="italic">{movieData.Plot}</div>
						<div className="flex small">
							<div className="color-black50 m-2">
								<i className="fas fa-globe-americas"></i> {movieData.Country}
							</div>
							<div className="color-black50 m-2">
								<i className="far fa-clock"></i> {movieData.Runtime}
							</div>
							{movieData.Awards !== "N/A" && (
								<div className="color-black50 m-2">
									<i className="fas fa-trophy"></i> {movieData.Awards}
								</div>
							)}
						</div>
						<div className="center">
							<button className="basic-button m-2"><i className="fas fa-info"></i> More Info</button>
						</div>
					</div>
				</Fragment>
			)}
		</div>
	)
}

export default Hoverbox;