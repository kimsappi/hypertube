import React, { useState, useContext, useEffect, useRef, Fragment } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from "react-player";

import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
// import DispatchContext from "../../context/DispatchContext";

import config from '../../config/config';

const CinemaAlt = () =>
{
	const playerRef = useRef(null);

	const globalState = useContext(StateContext);
	const globalDispatch = useContext(DispatchContext);
	// const globalDispatch = useContext(DispatchContext);

	const { magnet, id, imdb } = useParams();
	const connection = useRef();
	const status = useRef(0);

	const [subtitlesReady, setSubtitlesReady] = useState([]);

	const [subtitlesAvailable, setSubtitlesAvailable] = useState([]);
	const [subtitlesSize, setSubtitlesSize] = useState(0);
	const [subtitlesDownloaded, setSubtitlesDownloaded] = useState(0);

	const [movieName, setMovieName] = useState("");
	const [movieSize, setMovieSize] = useState(0);

	const [statusPlayer, setStatusPlayer] = useState("");
	const [secondsPlayed, setSecondsPlayed] = useState(0);
	const [secondsLoaded, setSecondsLoaded] = useState(0);
	const [totalSeconds, setTotalSeconds] = useState(0);

	const [timeLeft, setTimeLeft] = useState(30);

	const previouslyWatchedPercentage = globalState.watched[id] && globalState.watched[id] < 95 ?
		globalState.watched[id] : 0;
	
	const token = localStorage.getItem("HiveflixToken");
	const videoUrl = `${config.SERVER_URL}/api/cinema/${magnet}/${token}/${id}`;

	useEffect(() =>
	{
		(async () =>
		{
			try
			{
				// create new sse connection
				connection.current = new EventSource(`${config.SERVER_URL}/api/cinema/subtitles/${magnet}/${id}/${imdb}/${globalState.language}`, globalState.config);
	
				// activated every time backend sends a message
				connection.current.onmessage = (event) =>
				{
					// convert string sent by backend to a JSON object
					const data = JSON.parse(event.data);

					if (data.kind === "metadata") // metadata has been downloaded
					{
						status.current = 1;
					}
					else if (data.kind === "subtitles") // vtt-file on server
					{
						let tmp = subtitlesReady;
						tmp.push(data);
						setSubtitlesReady(tmp);

						console.log("subtitlesReady", tmp);
					}
					else if (data.kind === "available") // single srt-file name and size
					{
						status.current = 2;
						let tmp = subtitlesAvailable;
						tmp.push(data);
						setSubtitlesAvailable(tmp);
						setSubtitlesSize(subtitlesSize + data.size);
					}
					else if (data.kind === "downloaded") // piece of subtitles downloaded (size in bytes)
					{
						setSubtitlesDownloaded(data.size / 60);
					}
					else if (data.kind === "movie") // get movie data, start rendering player, close sse connection
					{
						status.current = 3;
						setMovieName(data.name);
						setMovieSize(data.size);
						connection.current.close();

						console.log("subtitlesReady", subtitlesReady);
					}
				};
			}
			catch (err)
			{
				console.error(err.message);
			}
		})()
	}, [globalState.config]);

	// Sending watched state to server
	useEffect(() => {
		return () => {
			// Player didn't load yet
			if (!document.querySelector('video'))
				return;

			const played = document.querySelector('video').currentTime;
			const runtime = document.querySelector('video').duration;

			const percent = (played / runtime) * 100;
			const finalPercent = percent > 90 ? 100 : percent;
			console.log(id)
			axios.post(config.SERVER_URL + '/api/users/watched',
			{
				imdb: id,
				percent: finalPercent
			}, globalState.config);
			//alert('secs: ' + secondsPlayed + 'total: ' + totalSeconds + 'percent: ' + percent + 'test: ' + test);
			const oldWatched = globalState.watched;
			const newWatched = {...oldWatched, [id]: finalPercent};
			globalDispatch({type: 'updateWatched', value: newWatched});
		}
	}, []);

	const onProgress = ({ playedSeconds, loadedSeconds }) =>
	{
		setSecondsPlayed(playedSeconds);
		setSecondsLoaded(loadedSeconds);
	}

	const onReady = () => status.current = 4;
	const onDuration = (duration) => {
		console.log(duration)
		setTotalSeconds(duration);
		if (duration < 99999) {
			playerRef.current.seekTo(previouslyWatchedPercentage * duration / 100);
		}
	};
	const onStart = () => setStatusPlayer("START");
	const onPlay = () => setStatusPlayer("PLAY");
	const onPause = () => setStatusPlayer("PAUSE");
	const onBuffer = () => setStatusPlayer("BUFFERING");
	const onError = () => setStatusPlayer("ERROR");
	const onEnded = () => setStatusPlayer("VIDEO END");

	let count = setTimeout(() =>
	{
		if (status.current === 4)
		{
			clearTimeout(count);
			setTimeLeft("Success!");
		}
		else if (timeLeft > 1)
			setTimeLeft(timeLeft - 1);
		else
		{
			clearTimeout(count);
			setTimeLeft("Oh snap, this is taking way too long")
		}
	}, 1000);

	let subtitleCount = 1;
	let subtitleCount2 = 1;

	// console.log("subtitlesDownloaded", subtitlesDownloaded)
	// console.log("subtitlesSize", subtitlesSize)

	return (
		<div className="cinema-container">
			<div className="cinema-info">
				<h3 className="center m-4"><i className="fas fa-download"></i> File Downloader</h3>
				<div className="center m-2">Status:
						{status.current === 0 && " downloading metadata"}
						{status.current === 1 && " preparing subtitles"}
						{status.current === 2 && " downloading subtitles"}
						{status.current === 3 && " preparing movie"}
						{status.current === 4 && " playing movie"}
				</div>

				{/* <hr className="my-2"></hr>
				<table className="cinema-info-table">
					<tbody>
						<tr>
							<td>Torrent details</td>
						</tr>
						<tr>
							<td>Type: {movie.data.torrents.type}</td>
							<td>Quality: {movie.data.torrents.quality}</td>
							<td>Peers: {movie.data.torrents.peers}</td>
							<td>Seeds: {movie.data.torrents.seeds}</td>
						</tr>
					</tbody>
				</table> */}

				<hr className="my-2"></hr>
				<table className="cinema-info-table">
					<tbody>
						<tr>
							<td>Torrent metadata {status.current > 0 ?
						<i className="far fa-check-square color-success ml-1"></i> :
						<i className="far fa-square color-black50 ml-1"></i>}</td>
						</tr>
					</tbody>
				</table>

				{status.current > 0 && (
					<Fragment>
						<hr className="my-2"></hr>
						<div className="m-2">Subtitles ready to be used</div>
						<table className="cinema-info-table">
							<tbody>
								{subtitlesReady.length ? subtitlesReady.map(subtitle =>
										<tr key={subtitleCount}>
											<td>{subtitleCount++}.</td>
											<td>{subtitle.name}</td>
											<td className="pl-1">{status.current > 2 ?
												<i className="far fa-check-square color-success"></i> :
												<i className="far fa-square color-black50"></i>}</td>
										</tr>
									) :
									<tr>
										<td className="small color-black50">None</td>
									</tr>
								}
							</tbody>
						</table>
					</Fragment>
				)}

				{status.current > 1 && (
					<Fragment>
						<hr className="my-2"></hr>
						<div className="m-2">Subtitles available for download</div>
						<table className="cinema-info-table">
							<tbody>
								{subtitlesAvailable && subtitlesAvailable.map(file =>
									<tr key={subtitleCount2}>
										<td>{subtitleCount2++}.</td>
										<td>{file.name}</td>
										<td>{Math.round(file.size / 1000)} KB</td>
										<td className="pl-1">{status.current > 2 ?
											<i className="far fa-check-square color-success"></i> :
											<i className="far fa-square color-black50"></i>}</td>
									</tr>
								)}
							</tbody>
						</table>
						{subtitlesAvailable.length ?
							<div className={status.current > 2 ? "center mb-2 color-success" : "center mb-2"}>
								Downloaded: {status.current > 2 ? 100 : Math.round((subtitlesDownloaded / subtitlesSize) * 100)} %
							</div> :
							<div className="small color-black50">None</div>
						}
					</Fragment>
				)}

				{status.current > 2 &&  (
					<Fragment>
						<hr className="my-2"></hr>
						<div className="m-2">Preparing Movie</div>
						<table className="cinema-info-table">
							<tbody>
								<tr>
									<td>1.</td>
									<td>{movieName}</td>
									<td>{Math.round(movieSize / 1000000)} MB</td>
									<td className="pl-1">{status.current > 3 ?
										<i className="far fa-check-square color-success"></i> :
										<i className="far fa-square color-black50"></i>}</td>
								</tr>
							</tbody>
						</table>
						<div className="center m-2">{timeLeft}</div>
						<hr className="my-2"></hr>
					</Fragment>
				)}
			</div>
		<div>
			{status.current > 2 && (
				<Fragment>
					<div className="flex-center p-4 bg-black100">
						<ReactPlayer
							ref={playerRef}
							width="100%"
							height="500px"
							playing={true}
							controls={true}
							pip={false}
							onReady={onReady}
							onStart={onStart}
							onPlay={onPlay}
							onProgress={onProgress}
							onDuration={onDuration}
							onPause={onPause}
							onBuffer={onBuffer}
							onBufferEnd={onPlay}
							onEnded={onEnded}
							onError={onError}
							url={videoUrl}
							config={
								{ file: {
									attributes: {
										crossOrigin: 'true'
									},
									tracks: subtitlesReady
									}
								}
							}
						/>
					</div>
					<div className="center color-black60 bg-black100 p-4">
						<div>{statusPlayer}</div>
						<div>played: {Math.round(secondsPlayed)} seconds</div>
						<div>loaded: {Math.round(secondsLoaded)} / {Math.round(totalSeconds)} seconds</div>
					</div>
				</Fragment>
			)}
			</div>
		</div>
	)
}

export default CinemaAlt;
