import React, { useState, useEffect, Fragment } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import ReactPlayer from "react-player";

const Cinema = () =>
{
	const { magnet } = useParams();
	const [video, setVideo] = useState(true);
	const [isStream, setIsStream] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	// useEffect(() =>
	// {
	// 	setIsLoading(true);

	// 	(async () =>
	// 	{
	// 		try
	// 		{
	// 			// fetch stream
	// 			const response = await axios.get("http://localhost:5000/api/cinema/" + magnet);
	// 			// const response = await axios.get("http://localhost:5000/api/cinema/" + magnet, {
	// 			// 	headers: {Accept: 'video/mp4'}
	// 			// });

	// 			console.log("response", response.data);

	// 			// check if response is stream or url to static file
	// 			if (response.data.isStream === true)
	// 				setIsStream(true);
	// 			else
	// 				setIsStream(false);

	// 			setVideo(response.data);
				
	// 			setIsLoading(false);
	// 		}
	// 		catch (err)
	// 		{
	// 			console.error(err);
	// 		}
	// 	})()
	// }, [magnet]);

// 	return (
// 		<Fragment>
// 			{isLoading && <div className="loading"></div>}
// 			{!isLoading && (
// 				<div className="flex-center p-4 bg-black100">
// 					{<ReactPlayer playing={true} controls={true} url={"http://localhost:5000/api/cinema/" + magnet} config={
// 						{ file: {
// 							attributes: {
// 								crossOrigin: 'true'
// 							},
// 							tracks: [
// 							{ kind: 'subtitles', src: 'subs.vtt', srcLang: 'en', default: true }
// 							]
// 						}}
// 					}/>}
// 				</div>
// 			)}
// 		</Fragment>
// 	)
// }

return (<video src={"http://localhost:5000/api/cinema/" + magnet} width='200px' height='200px' controls autoPlay muted />);
}


export default Cinema;
