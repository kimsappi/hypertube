import React, { useState, useContext, useEffect, useRef, Fragment } from "react";
import { useParams } from 'react-router-dom';
import clone from "clone";

import ReactPlayer from "react-player";

import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";

import config from '../../config/config';

const CinemaAlt = () =>
{
	const globalState = useContext(StateContext);
	const globalDispatch = useContext(DispatchContext);

	const { magnet, id, imdb } = useParams();
	const connection = useRef();
	const status = useRef(0);

	const [subtitleData, setSubtitleData] = useState([]);
	const [subtitleSize, setSubtitleSize] = useState(0);
	const [subtitleDownloaded, setSubtitleDownloaded] = useState(0);
	const [subtitleDataConverted, setSubtitleDataConverted] = useState([]);

	const [movieName, setMovieName] = useState("");
	const [movieSize, setMovieSize] = useState(0);

	const [statusPlayer, setStatusPlayer] = useState("");
	const [secondsPlayed, setSecondsPlayed] = useState(0);
	const [secondsLoaded, setSecondsLoaded] = useState(0);
	const [totalSeconds, setTotalSeconds] = useState(0);

	const [timeLeft, setTimeLeft] = useState(30);
	
	// const language = "eng";
	// const subtitleUrl = `${config.SERVER_URL}/${id}/subs.${language}.vtt`;

	const token = localStorage.getItem("HiveflixToken");
	const videoUrl = `${config.SERVER_URL}/api/cinema/${magnet}/${token}/${id}`;

	useEffect(() =>
	{
		(async () =>
		{
			try
			{
				// create new sse connection
				connection.current = new EventSource(`${config.SERVER_URL}/api/cinema/secret/${magnet}/${id}/${imdb}`);
	
				// activated every time backend sends a message
				connection.current.onmessage = (event) =>
				{
					// convert string sent by backend to a JSON object
					const data = JSON.parse(event.data);

					if (data.kind === "metadata") // metadata has been downloaded
					{
						status.current = 1;
					}
					else if (data.kind === "subtitles") // single srt-file name and size
					{
						let tmp = subtitleData;
						tmp.push(data);
						setSubtitleData(tmp);
						setSubtitleSize(subtitleSize + data.size);
					}
					else if (data.kind === "downloaded") // piece of subtitles downloaded (size in bytes)
					{
						setSubtitleDownloaded(data.downloaded);
					}
					else if (data.kind === "converted") // single srt-file has been converted to vtt
					{
						status.current = 2;
						let tmp = subtitleDataConverted;
						tmp.push({
							kind: "subtitles",
							name: data.name,
							src: config.SERVER_URL + "/" + id + "/" + data.name,
							srcLang: data.language,
							default: Boolean(data.default)
						})
						setSubtitleDataConverted(tmp);
					}
					else if (data.kind === "movie")
					{
						let tmp = subtitleDataConverted;
						console.log("all subtitles", tmp);

						status.current = 3;
						setMovieName(data.name);
						setMovieSize(data.size);		
						connection.current.close();
					}
				};
			}
			catch (err)
			{
				console.error(err.message);
			}
		})()
	}, []);

	const onProgress = ({ playedSeconds, loadedSeconds }) =>
	{
		setSecondsPlayed(playedSeconds);
		setSecondsLoaded(loadedSeconds);
	}

	const onReady = () => status.current = 4;
	const onDuration = (duration) => setTotalSeconds(duration);
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

	return (
		<div className="cinema-container">
			<div className="cinema-info">
				<h3 className="center m-4"><i className="fas fa-download"></i> File Downloader</h3>
				<div className="center m-2">
						{status.current === 0 && "downloading metadata"}
						{status.current === 1 && "downloading subtitles"}
						{status.current === 2 && "converting subtitles"}
						{status.current === 3 && "preparing movie"}
						{status.current === 4 && "playing movie"}
				</div>

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
						<h5 className="m-2">Downloading Subtitles</h5>
						<table className="cinema-info-table">
							<tbody>
								{subtitleData && subtitleData.map(file =>
									<tr key={subtitleCount}>
										<td>{subtitleCount++}.</td>
										<td>{file.name}</td>
										<td>{Math.round(file.size / 1000)} KB</td>
										<td className="pl-1">{status.current > 1 ?
											<i className="far fa-check-square color-success"></i> :
											<i className="far fa-square color-black50"></i>}</td>
									</tr>
								)}
							</tbody>
						</table>
						<div className={status.current > 1 ? "center mb-2 color-success" : "center mb-2"}>
							Downloaded: {status.current > 1 ? 100 : Math.round((subtitleDownloaded / subtitleSize) * 100)} %
						</div>
					</Fragment>
				)}

				{status.current > 1 && (
					<Fragment>
						<hr className="my-2"></hr>
						<h5 className="m-2">Converting Subtitles</h5>
						<table className="cinema-info-table">
							<tbody>
								{subtitleDataConverted && subtitleDataConverted.map(file =>
									<tr key={subtitleCount2}>
										<td>{subtitleCount2++}.</td>
										<td>{file.name}</td>
										<td className="pl-1">{status.current > 2 ?
											<i className="far fa-check-square color-success"></i> :
											<i className="far fa-square color-black50"></i>}</td>
									</tr>
								)}
							</tbody>
						</table>
					</Fragment>
				)}

				{status.current > 2 &&  (
					<Fragment>
						<hr className="my-2"></hr>
						<h5 className="m-2">Preparing Movie</h5>
						<table className="cinema-info-table">
							<tbody>
									<tr>
										<td>1.</td>
										<td>{movieName}</td>
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
									tracks: subtitleDataConverted
									// tracks: [
									// 	{ kind: 'subtitles', src: subtitleUrl, srcLang: "eng", default: true } 
									// ]
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
