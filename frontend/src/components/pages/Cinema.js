import React, { useState, Fragment } from "react";
import { useParams } from 'react-router-dom';
import ReactPlayer from "react-player";

import config from '../../config/config';

const Cinema = () =>
{
	const { magnet, imdb_id, title_long } = useParams();
	const [status, setStatus] = useState("...");
	const [secondsPlayed, setSecondsPlayed] = useState(0);
	const [secondsLoaded, setSecondsLoaded] = useState(0);
	const [totalSeconds, setTotalSeconds] = useState(0);
	
	const [movieReady, setMovieReady] = useState(false);
	const [timeLeft, setTimeLeft] = useState(15);

	const token = localStorage.getItem("HiveflixToken");

	const onProgress = ({ playedSeconds, loadedSeconds }) =>
	{
		setSecondsPlayed(playedSeconds);
		setSecondsLoaded(loadedSeconds);
	}

	const onDuration = (duration) => setTotalSeconds(duration);

	const onStart = () => setStatus("START");
	const onPlay = () => setStatus("PLAY");
	const onPause = () => setStatus("PAUSE");
	const onBuffer = () => setStatus("BUFFERING");
	const onEnded = () => setStatus("VIDEO END");
	const onError = () => setStatus("ERROR");

	const language = "en";
	const resolution = "720p";
	const subtitleUrl = config.SERVER_URL + "/" + title_long + " [" + resolution + "] [WEBRip] [YTS.MX]/subs." + language + ".vtt";

	let count = setTimeout(() =>
	{
		if (movieReady === true)
		{
			clearTimeout(count);
			setTimeLeft("Success!");
		}
		else if (timeLeft > 1)
			setTimeLeft(timeLeft - 1);
		else
		{
			clearTimeout(count);
			setTimeLeft("Oh snap, downloading is taking longer than usual")
		}
	}, 1000);

	return (
		<Fragment>
			<div className="flex-center p-4 bg-black100">
				<ReactPlayer
					playing={true}
					controls={true}
					pip={false}
					onReady={() => setMovieReady(true)}
					onStart={onStart}
					onPlay={onPlay}
					onProgress={onProgress}
					onDuration={onDuration}
					onPause={onPause}
					onBuffer={onBuffer}
					onBufferEnd={onPlay}
					onEnded={onEnded}
					onError={onError}
					url={config.SERVER_URL + "/api/cinema/" + magnet + "/" + token}
					config={
						{ file: {
							attributes: {
								crossOrigin: 'true'
							},
							tracks: [
							{ kind: 'subtitles', src: subtitleUrl, srcLang: language, default: true } 
							]
							}
						}
					}
				/>
			</div>
			<div className="flex-column center">
				<div>
					Attempting to start video: {timeLeft}
					<hr></hr>
				</div>
				<div>{status}</div>
				<div>played: {Math.round(secondsPlayed)} seconds</div>
				<div>loaded: {Math.round(secondsLoaded)} / {Math.round(totalSeconds)} seconds</div>
			</div>
		</Fragment>
	)
}

export default Cinema;
