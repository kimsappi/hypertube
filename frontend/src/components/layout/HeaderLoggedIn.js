import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';

import StateContext from '../../context/StateContext';
import DispatchContext from '../../context/DispatchContext';

import ProfilePicture from '../ProfilePicture';

const HeaderLoggedIn = () =>
{
	const globalState = useContext(StateContext);
	const globalDispatch = useContext(DispatchContext);

	return (
		<header>
			<nav className='navbar'>
				<ul>
					<li>
						<NavLink className="navbar-title" to='/home' alt='Home' title='Home'>
							HIVEFLIX
						</NavLink>
					</li>
					<li>
						<NavLink to='/search' alt='Search' title='Search'>
							<div className="flex">
								<div className="navlink-icon"><i className="fas fa-search color-primary"></i></div>
								<div className="navlink-text">Search</div>
							</div>
						</NavLink>
					</li>
					<li>
						<NavLink to='/mylist' alt='My List' title='My List'>
							<div className="flex">
								<div className="navlink-icon"><i className="fas fa-images color-primary"></i></div>
								<div className="navlink-text">My List</div>
							</div>
						</NavLink>
					</li>
					<li>
						<NavLink to='/watched' alt='My List' title='Watched'>
							<div className="flex">
								<div className="navlink-icon"><i className="far fa-eye color-primary"></i></div>
								<div className="navlink-text">Watched</div>
							</div>
						</NavLink>
					</li>
				</ul>
				<ul>
					<li>
						<Link to={"/profile/" + globalState.id} alt='Profile' title='Profile'>
							<ProfilePicture url={globalState.profilePicture} className='profile-image' />
						</Link>
					</li>
					<li>
						<Link to='#' alt='Logout' title='Logout' onClick={() => globalDispatch({ type: "logout" })}>
							<div className="flex">
								<div className="navlink-icon"><i className="fas fa-share-square color-primary"></i></div>
								<div className="navlink-text">Log Out</div>
							</div>
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	)
}

export default HeaderLoggedIn;
