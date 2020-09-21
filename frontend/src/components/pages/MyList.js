import React, { useEffect, useState, useContext, Fragment } from "react";
import axios from 'axios';

import config from '../../config/config';

import MovieItem from "./MovieItem";

import StateContext from "../../context/StateContext";


const MyList = () =>
{
	const globalState = useContext(StateContext);
	const [myList, setMyList] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchMyList();
	}, []);

	const fetchMyList = async () => {
		try {
			const response = await axios.get(config.SERVER_URL + '/api/myList', globalState.config);

			let list = [];

			for (let i = 0; i < response.data.length; i++)
			{
				const res = await axios.get("https://yts.mx/api/v2/movie_details.json?movie_id=" + response.data[i]);
				list.push(res.data.data.movie);
			}

			setMyList(list);
			setLoading(false);
		} catch(err) {}
	};

	return (
		<Fragment>
			<h2 className="center bg-black100 py-4">My List</h2>
			{loading && <div className="loading"></div>}
			{!loading && (
				<Fragment>
					<div className="movie-items-container">
						{myList.length ? myList.map (movie => (
							<Fragment key={movie.imdb_code}>
								<MovieItem movie={movie}/>
							</Fragment>
							)
						) :
						<div className="mt-4">Your list is empty</div>}
					</div>
				</Fragment>
			)}
		</Fragment>
	)
}

export default MyList;
