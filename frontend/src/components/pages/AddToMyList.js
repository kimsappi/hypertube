import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';

import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";

import config from '../../config/config';

const AddToMyList = ({id}) =>
{
	const globalState = useContext(StateContext);
	const globalDispatch = useContext(DispatchContext);
	const [alreadyOnList, setAlreadyOnList] = useState(false);

	useEffect(() =>
	{
		(async () =>
		{
			for (let i = 0; i < globalState.myList.length; i++)
			{
				if (globalState.myList[i] === id)
				{
					setAlreadyOnList(true);
					break;
				}
			}
		})()
	}, [id, globalState.myList]);

	const addItemToMyList = async () =>
	{
		try
		{
			await axios.post(config.SERVER_URL + '/api/myList', { id }, globalState.config);
			
			globalDispatch({ type: "addToMyList", value: id });
			setAlreadyOnList(true);

		}
		catch(err)
		{
			console.error(err);
		}
	};

	const removeFromMyList = async () =>
	{
		try
		{
			await axios.delete(config.SERVER_URL + `/api/myList/${id}`, globalState.config);

			for (let i = 0; globalState.myList[i]; i++)
				if (globalState.myList[i] === id)
				{
					globalDispatch({ type: "removeFromMyList", value: i });
					setAlreadyOnList(false);
					console.log('removed from My List');
				}
		}
		catch(err)
		{
			console.error(err);
		}
	};

	return (
		<div className="flex m-2">
				{alreadyOnList ? <button onClick={removeFromMyList}>Remove From My List</button> :
				<button onClick={addItemToMyList}>Add to My List</button>}
		</div>
		);
};

export default AddToMyList;
