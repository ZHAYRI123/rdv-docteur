import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';

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

	function classNames(...classes) {
		return classes.filter(Boolean).join(' ');
	}

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
							{/* Header to show hello user in center*/}
						</div>
						<div class='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
							<Menu as='div' class='relative ml-3'>
								<div>
									<Menu.Button class='relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
										<span class='absolute -inset-1.5' />
										<span class='sr-only'>Open user menu</span>
										<img class='h-8 w-8 rounded-full' src='./profile.png' alt='' />
									</Menu.Button>
								</div>
								<Transition as={Fragment} enter='transition ease-out duration-100' enterFrom='transform opacity-0 scale-95' enterTo='transform opacity-100 scale-100' leave='transition ease-in duration-75' leaveFrom='transform opacity-100 scale-100' leaveTo='transform opacity-0 scale-95'>
									<Menu.Items class='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none px-2'>
										{JWT() ? (
											<Menu.Item>
												{({ active }) => (
													<>
														<Link to='/update-profile' class={classNames(active ? 'bg-gray-100 m-auto w-full rounded' : '', 'block md:hidden py-2 text-sm text-gray-700 m-auto w-full rounded')}>
															Profile
														</Link>
														<button class={classNames(active ? 'bg-gray-100 m-auto w-full rounded' : '', 'block px-4 py-2 text-sm text-gray-700 m-auto w-full rounded')} onClick={handleSignout}>
															Sign out
														</button>
													</>
												)}
											</Menu.Item>
										) : (
											<Menu.Item>
												{({ active }) => (
													<>
														<Link to='/doctor-login' class={classNames(active ? 'bg-gray-100 m-auto w-full rounded' : '', 'block py-2 text-sm text-gray-700 m-auto w-full rounded')}>
															Doctor Login
														</Link>
														<Link to='/patient-login' class={classNames(active ? 'bg-gray-100 m-auto w-full rounded' : '', 'block  py-2 text-sm text-gray-700 m-auto w-full rounded')}>
															Patient Login
														</Link>
													</>
												)}
											</Menu.Item>
										)}
									</Menu.Items>
								</Transition>
							</Menu>
						</div>
					</div>
				</div>
			</Disclosure>
		</>
	);
};

export default Navbar;