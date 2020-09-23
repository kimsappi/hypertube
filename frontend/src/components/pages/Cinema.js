import Axios from 'axios';
import React, { useState, Fragment, useEffect } from "react";
import { useParams } from 'react-router-dom';
import ReactPlayer from "react-player";

import config from '../../config/config';

const Cinema =  () =>
{
	const { magnet, title_long, imdb } = useParams();
	const [status, setStatus] = useState("...");
	const [secondsPlayed, setSecondsPlayed] = useState(0);
	const [secondsLoaded, setSecondsLoaded] = useState(0);
	const [totalSeconds, setTotalSeconds] = useState(0);
	const [waitForIt, setWait] = useState(false);
	const [subtitles, setSubtitles] = useState('test');
	
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
console.log("PARAM1:", magnet);
console.log("IMDB:  ", imdb);
	const language = "en";
	const resolution = "720p";
	let subtitleUrl = 'asdasd';

	useEffect(async () => {const res = await Axios.get(config.SERVER_URL + "/api/cinema/start/" + magnet + "/" + token + "/" + imdb); 
				console.log(res);
					if (res.data == "subtitles not found" || res.data.message == "found")
					{
						if (res.data.message == 'found')
						setTimeout(() => {
							setSubtitles(config.SERVER_URL + "/" + res.data.sub);
							setWait(true);
						}, 1000);
						
						if (res.data == 'subtitles not found')
						{
							alert('no subtitles found. Playing anyways..');
							setWait(true);
						}
					}
					console.log(res);}, 
					[])
	

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

	useEffect( () => {
		
		
		
	}, [waitForIt])

console.log("WAITFOR: ", waitForIt);
	return (
		
		<Fragment>
			<div className="flex-center p-4 bg-black100">
			{waitForIt === true ? 
				<ReactPlayer
					width="100%"
					height="500px"
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
					url={config.SERVER_URL + "/api/cinema/" + magnet + "/" + token + "/" + imdb}
					config={
						{ file: {
							attributes: {
								crossOrigin: 'true'
							},
							tracks: [
							{ kind: 'subtitles', src: subtitles, srcLang: language, default: true } 
							]
							}
						}
					}
				/>
				: 'loading..'}
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
