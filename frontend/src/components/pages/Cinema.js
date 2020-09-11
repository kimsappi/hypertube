import React, { useState, useEffect, Fragment } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import ReactPlayer from "react-player";
import Hls from 'hls.js';

const Cinema = () =>
{
	const { magnet } = useParams();
	const [video, setVideo] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() =>
	{
		setLoading(true);

		(async () =>
		{
			try
			{
				// console.log(magnet);

				// fetch stream
				// const response = await axios.get("http://localhost:5000/api/cinema/" + magnet, {
				// 	headers: {Accept: 'video/mp4'}
				// });
				// console.log(response);

				// console.log("response", response);  

				// var video = document.getElementById('ReactPlayer');
				// var videoSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
				// // var videoSrc = "http://localhost:5000/South.Park.S23E07.HDTV.x264-SVA[ettv]/South.Park.S23E07.HDTV.x264-SVA[ettv].mkv";

				// if (Hls.isSupported()) {
				//   var hls = new Hls();
				//   hls.loadSource(videoSrc);
				//   hls.attachMedia(video);
				//   hls.on(Hls.Events.MANIFEST_PARSED, function() {
				// 		console.log('playing' + video);
				// 		video.play();
				//   });
				// }
				// console.log(hls); 
				// setVideo(response.data); 
				// console.log(response)
				
				setLoading(false);
			}
			catch (err)
			{
				console.log('asd');
				console.error(err);
			}
		})()
	}, [magnet]);

// 	<ReactPlayer
//   playing
//   url={[
//     {src: 'foo.webm', type: 'video/paska'},
//     {src: 'foo.ogg', type: 'video/ogg'}
//   ]}
// />

	return (
		<Fragment>
			{<ReactPlayer id="ReactPlayer" width="100%" playing={true} controls={true}
			url={'http://localhost:5000/api/cinema/' + magnet} />}
			{/* <video id="video"></video> */}
			{loading && <div className="loading"></div>}
			{!loading && (
				<Fragment>
					<div className="center p-5">
						{/* <p>{stream}</p> */}
					</div>
					
					{/* <ReactPlayer width="100%" playing={true} controls={true} url="http://localhost:5000/A Bug's Life (1998)/A.Bugs.Life.1998.720p.BluRay.x264.YIFY.mp4" /> */}
					{/* <ReactPlayer width="100%" playing={true} controls={true} url="http://localhost:5000/South.Park.S23E07.HDTV.x264-SVA[ettv]/South.Park.S23E07.HDTV.x264-SVA[ettv].mkv" />
					{video && <ReactPlayer width="100%" playing={true} controls={true} url={video} />} */}
				</Fragment>
			)}
		</Fragment>
	)
}

export default Cinema;