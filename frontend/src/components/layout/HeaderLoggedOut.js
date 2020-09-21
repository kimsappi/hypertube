import React from 'react';
import { NavLink } from 'react-router-dom';

const HeaderLoggedOut = () =>
{
	return (
		<header>
		<nav className='navbar'>
				<ul>
					<li>
					<NavLink className="navbar-title" to='/home' alt='Home' title='Home'>
						HIVEFLIX
					</NavLink>
					</li>
				</ul>
				<ul>
					<li>
						<NavLink to='/login' alt='Log In' title='Log In'>
						<i className="fas fa-key color-primary"></i> Log In
						</NavLink></li>
					<li>
						<NavLink to='/register' alt='Register' title='Register'>
						<i className="fas fa-edit color-primary"></i> Register
						</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	)
}

export default HeaderLoggedOut;