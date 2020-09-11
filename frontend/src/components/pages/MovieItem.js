import React from 'react';
import { Link } from 'react-router-dom';

const MovieItem = ({ movie }) =>
{
	return (
		<div className="movie-item">
			<Link to={`/movie/${movie.id}`}>
				<img className="movie-image-medium" src={movie.medium_cover_image} alt='Profile'/>
			</Link>
		</div>
	)
}

export default MovieItem;