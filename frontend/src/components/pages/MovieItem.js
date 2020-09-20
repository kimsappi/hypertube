import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MovieItem = ({ movie }) =>
{
	const [mouseHover, setMouseHover] = useState(false);

	return (
		<div className="movie-item" onMouseEnter={() => setMouseHover(true)} onMouseLeave={() => setMouseHover(false)}>
			<Link to={"/movie/" + movie.id}>
				<img className="movie-image-medium" src={movie.medium_cover_image} alt='Profile'/>
			</Link>
			{/* {mouseHover && (
				<div className="movie-hover-box">
					<a href={`https://www.imdb.com/title/${movie.imdb_code}`} target="blank">
						IMDb link test
					</a>
				</div>	
			)} */}
		</div>
	)
}

export default MovieItem;