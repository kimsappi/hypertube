import React, { useEffect, useState } from "react";
import axios from 'axios';

import config from '../../config/config';

const MyList = () =>
{
	const [myList, setMyList] = useState([]);

	useEffect(() => {
		fetchMyList();
	}, []);

	const fetchMyList = async () => {
		try {
			const res = await axios.get(config.SERVER_URL + '/api/myList', {
				headers: {Authorization: `Bearer ${localStorage.getItem('HiveflixToken')}`}
			});
			setMyList(res.data);
		} catch(err) {}
	};

	return (
		<div className="center">
			<h1 className="my-4">My List</h1>
			{myList.length ?
				myList.map((item, index) => (<div key={index}>Movie ID {item}</div>)) :
				<div>MyList is empty</div>
			}
		</div>
	)
}

export default MyList;
