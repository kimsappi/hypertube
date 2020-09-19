import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';

import StateContext from '../../../context/StateContext';
import DispatchContext from '../../../context/DispatchContext';

import ProfilePicture from '../../ProfilePicture';

const HeaderLoggedIn = () =>
{
	const globalState = useContext(StateContext);
	const globalDispatch = useContext(DispatchContext);

	const handleLogout = async () =>
	{
		globalDispatch({ type: "logout" });
	}

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
						<NavLink to='/mylist' alt='My List' title='My List'>
							<i className="fas fa-images color-primary"></i> My List
						</NavLink>
					</li>
				</ul>
				<ul>
					<li>
						<Link to={"/profile/" + globalState.id} alt='Profile' title='Profile'>
							<ProfilePicture url={globalState.ProfilePicture} className='profile-image' />
						</Link>
					</li>
					<li>
						<Link to='#' alt='Logout' title='Logout' onClick={handleLogout}>
							<i className="fas fa-share-square color-primary"></i> Log Out
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	)
}

export default HeaderLoggedIn;
