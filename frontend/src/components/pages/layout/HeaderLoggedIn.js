import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';

import StateContext from '../../../context/StateContext';
import DispatchContext from '../../../context/DispatchContext';

import logo from "../../../images/logo.png";
import profilePicture from "../../../images/profile.jpg";

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
			<div className="flex" style={{ width: '100%' }}>
				<div className="navbar-title">
					<NavLink to='/home' alt='Home' title='Home'>
						<img src={logo} className='logo' alt='site logo'/> HIVEFLIX
					</NavLink>
				</div>
				<div>
					<ul>
						<li>
							<NavLink to='/about' alt='About' title='About'>
								<i className="fas fa-question-circle color-yellow"></i> About
							</NavLink>
						</li>
						<li>
							<Link to="" alt='Profile' title='Profile'>
								{typeof globalState.profileImage !== "undefined" ?
								<img className="profile-image" src={globalState.profileImage} alt='Profile'/> :
								<img className="profile-image" src={profilePicture} alt='Profile'/>}
							</Link>
						</li>
						<li>
							<Link to='#' alt='Logout' title='Logout'>
								<span onClick={handleLogout}><i className="fas fa-share-square color-primary"></i> Logout</span>
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
		</header>
	)
}

export default HeaderLoggedIn;