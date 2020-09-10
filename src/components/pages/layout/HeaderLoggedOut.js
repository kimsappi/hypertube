import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const HeaderLoggedOut = () =>
{
	return (
		<header className="mb-2">
		<nav className='navbar'>
			<div className="flex" style={{ width: '100%' }}>
				<div className="navbar-title">
					<NavLink to='/home' alt='Home' title='Home'>
						HIVEFLIX
					</NavLink>
				</div>
				<div>
					<ul>
						<li>
							<NavLink to='/about' alt='About' title='About'>
								<i className="fas fa-question-circle fa-2x color-yellow"></i> About
							</NavLink>
						</li>
					</ul>
				</div>
				<div>
					<ul>
						<li><NavLink to='/login' alt='Log In' title='Log In'><i className="fas fa-key fa-2x color-yellow"></i> Log In</NavLink></li>
						<li><NavLink to='/register' alt='Register' title='Register'><i className="fas fa-edit fa-2x color-yellow"></i> Register</NavLink></li>
					</ul>
				</div>
			</div>
		</nav>
		</header>
	)
}

export default HeaderLoggedOut;