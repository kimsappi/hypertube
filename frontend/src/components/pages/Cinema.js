import React, { useState, useEffect, useRef, Fragment } from "react";
import { useParams, Redirect } from 'react-router-dom';
import ReactPlayer from "react-player";

const Cinema = () =>
{
	const { magnet } = useParams();
	const [status, setStatus] = useState("...");
	const [secondsPlayed, setSecondsPlayed] = useState(0);
	const [secondsLoaded, setSecondsLoaded] = useState(0);
	const [totalSeconds, setTotalSeconds] = useState(0);
	
	const [movieReady, setMovieReady] = useState(false);
	const [timeLeft, setTimeLeft] = useState(10);

	const token = localStorage.getItem("HiveflixToken");

	const onProgress = ({ playedSeconds, loadedSeconds }) =>
	{
		setSecondsPlayed(playedSeconds);
		setSecondsLoaded(loadedSeconds);
	}

	const onDuration = (duration) => setTotalSeconds(duration);

	// const onReady = () => setStatus("READY");

	const onStart = () => setStatus("START");
	const onPlay = () => setStatus("PLAY");
	const onPause = () => setStatus("PAUSE");
	const onBuffer = () => setStatus("BUFFERING");
	// const onBufferEnd = () => setStatus("BUFFERING END");
	const onEnded = () => setStatus("VIDEO END");
	const onError = () => setStatus("ERROR");


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
			setTimeLeft("Fail!")
		}
	}, 1000);


	return (
		<Fragment>
			<div className="flex-center p-4 bg-black100">
				<ReactPlayer
					playing={true}
					controls={true}
					pip={false}
					// onReady={onReady}
					onReady={() => setMovieReady(true)}
					onStart={onStart}
					onPlay={onPlay}
					onProgress={onProgress}
					onDuration={onDuration}
					onPause={onPause}
					onBuffer={onBuffer}
					// onBufferEnd={onBufferEnd}
					onEnded={onEnded}
					onError={onError}
					url={"http://localhost:5000/api/cinema/" + magnet + '?token=' + token}
					config={
						{ file: {
							attributes: {
								crossOrigin: 'true'
							},
							tracks: [
							{ kind: 'subtitles', src: '../sample.vtt', srcLang: 'en', default: true }
							]
							}
						}
					}
				/>
				</div>
			<div className="flex-column center">
				<div>
					Attempting to start video {timeLeft}
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
