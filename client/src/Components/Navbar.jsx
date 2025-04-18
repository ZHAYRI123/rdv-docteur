import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fragment } from 'react';
import { Disclosure} from '@headlessui/react';

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
			<Disclosure as='nav' class='bg-green-800 fixed w-screen z-50 top-0'>
				<div class='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
					<div class='relative flex h-16 text-center justify-center '>
						<div class='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
							<div class='flex flex-shrink-0 items-center'>
								<div class='flex justify-center items-center'>
									<img class='h-16 w-32' src={logo} alt='Basmah' />
									<h1 class='m-2 text-white text-lg font-bold'>Basmah</h1>
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