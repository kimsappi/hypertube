import React from 'react';
import { NavLink } from 'react-router-dom';

import logo from'../../images/logo.png';

const HeaderLoggedOut = () =>
{
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
							<NavLink to='/login' alt='Log In' title='Log In'>
								<i className="fas fa-key color-yellow"></i> Log In
							</NavLink></li>
						<li>
							<NavLink to='/register' alt='Register' title='Register'>
								<i className="fas fa-edit color-yellow"></i> Register
							</NavLink>
						</li>
					</ul>
				</div>
			</div>
		</nav>
		</header>
	)
}

export default HeaderLoggedOut;