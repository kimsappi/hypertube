import React from 'react';
import { Link } from 'react-router-dom';

const MovieItem = ({ movie }) =>
{
	// use default image if profile image url does not work
	const addDefaultSrc = (event) =>
	{
		event.target.src = "http://localhost:5000/default.jpg";
	}

	return (
		<div className="movie-item">
			<Link to={`/movie/${movie.id}`}>
				<img className="movie-image-medium" src={movie.medium_cover_image} onError={addDefaultSrc} alt='Profile'/>
			</Link>
		</div>
	)
}

export default MovieItem;