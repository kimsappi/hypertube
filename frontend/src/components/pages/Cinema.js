import React, { useState, useEffect, Fragment } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import ReactPlayer from "react-player";

const Cinema = () =>
{
	const { magnet } = useParams();
	const [stream, setStream] = useState("");
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
				const response = await axios.get("http://localhost:5000/api/cinema/" + magnet);

				console.log("response", response);
				
				setStream(response.data);
				setLoading(false);
			}
			catch (err)
			{
				console.error(err.message);
			}
		})()
	}, [magnet]);

	return (
		<Fragment>
			{loading && <div className="loading"></div>}
			{!loading && (
				<Fragment>
					<div className="center p-5">
						<h1>Hello, this is Mr. Backend.</h1>
						<h4>Here's a file for you:</h4>
						<p>{stream}</p>
					</div>
					<ReactPlayer width="100%" url="http://localhost:5000/A Bug's Life (1998)/A.Bugs.Life.1998.720p.BluRay.x264.YIFY.mp4" />
				</Fragment>
			)}
		</Fragment>
	)
}

export default Cinema;