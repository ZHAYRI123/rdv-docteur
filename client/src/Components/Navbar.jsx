import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Fragment } from 'react';
import { Disclosure } from '@headlessui/react';

import logo from "../image/logo.png";


const Navbar = () => {
	const navigator = useNavigate();

	function logout() {
		document.cookie = 'jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
	}

	function getJwtToken() {
		const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
		for (const cookie of cookies) {
			const [name, value] = cookie.split('=');
			if (name === 'jwtToken') {
				return value;
			}
		}
		return null;
	}

	function JWT() {
		const jwtToken = getJwtToken();
		return jwtToken;
	}
	useEffect(() => {
		JWT();
	}, []);
	const handleSignout = () => {
		logout();
		localStorage.clear();
		navigator('/');
	};


	return (
		<>
			<Disclosure as='nav' className='bg-purple-50 fixed w-screen z-50 top-0'>
				<div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
					<div className='relative flex h-16 text-center justify-center'>
						<div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
							<div className='flex flex-shrink-0 items-center'>
								<div className='flex justify-center items-center'>
									<Link to='/'>
										<img className='mx-auto h-20 w-auto' src={logo} alt='Basmah' />
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Disclosure>
		</>
	);
};

export default Navbar;