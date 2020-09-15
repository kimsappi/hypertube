import React, { useState, useEffect, Fragment } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import ReactPlayer from "react-player";

const Cinema = () =>
{
	const { magnet } = useParams();
	const [status, setStatus] = useState("...");
	const [secondsPlayed, setSecondsPlayed] = useState(0);
	const [secondsLoaded, setSecondsLoaded] = useState(0);
	const [totalDuration, setTotalDuration] = useState(0);

	const onProgress = ({playedSeconds, played, loadedSeconds, loaded}) =>
	{
		setSecondsPlayed(playedSeconds);
		setSecondsLoaded(loadedSeconds);
	}

	const onDuration = (duration) => setTotalDuration(duration);

	// const onReady = () => setStatus("READY");
	const onStart = () => setStatus("START");
	const onPlay = () => setStatus("PLAY");
	const onPause = () => setStatus("PAUSE");
	const onBuffer = () => setStatus("BUFFERING");
	// const onBufferEnd = () => setStatus("BUFFERING END");
	const onEnded = () => setStatus("VIDEO END");
	const onError = () => setStatus("ERROR");

	return (
		<Fragment>
			<div className="flex-center p-4 bg-black100">
				{<ReactPlayer
					playing={true}
					controls={true}
					// onReady={onReady}
					onStart={onStart}
					onPlay={onPlay}
					onProgress={onProgress}
					onDuration={onDuration}
					onPause={onPause}
					onBuffer={onBuffer}
					// onBufferEnd={onBufferEnd}
					onEnded={onEnded}
					onError={onError}
					url={"http://localhost:5000/api/cinema/" + magnet}
					config={
						{ file: {
							attributes: {
								crossOrigin: 'true'
							},
							tracks: [
							{ kind: 'subtitles', src: 'subs.vtt', srcLang: 'en', default: true }
							]
						}
					}
				}/>}
			</div>
			<div className="flex-column center">
				<div>{status}</div>
				<div>played: {Math.round(secondsPlayed)} seconds</div>
				<div>loaded: {Math.round(secondsLoaded)} / {Math.round(totalDuration)} seconds</div>
			</div>
		</Fragment>
	)
}

export default Cinema;