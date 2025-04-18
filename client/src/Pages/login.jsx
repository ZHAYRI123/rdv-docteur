import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import logo from '../image/logo.png';

const Login = ({ type = 'patient' }) => {
    const [showpassword, setshowpassword] = useState(false);
    const navigator = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginData = { email, password };

        try {
            const endpoints = {
                hospital: 'hospital/loginHospital',
                doctor: 'doctor/loginDoctor',
                patient: 'patient/loginPatient',
                admin: 'admin/login'
            };

            const response = await fetch(`http://localhost:5000/${endpoints[type]}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message || 'Login failed');
                return;
            }

            const { token } = await response.json();
            toast.success('Logged in successfully');
            
            document.cookie = `jwtToken=${token}; path=/`;
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userType', type);

            const redirectPaths = {
                hospital: '/hospital/admin',
                doctor: '/doctor-dashboard',
                patient: '/patient-dashboard',
            };

            navigator(redirectPaths[type]);
        } catch (error) {
            console.error(error);
            toast.error('An error occurred during login');
        }
    };

    const getTitle = () => {
        const titles = {
            hospital: 'Administration Login',
            doctor: 'Doctor Login',
            patient: 'Patient Login',
        };
        return titles[type] || 'Login';
    };

    return (
        <>
            <Toaster />
            <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-24 lg:px-8'>
                <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                    <img className='mx-auto h-16 w-32' src={logo} alt='Basmah Company' />
                    <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
                        {getTitle()}
                    </h2>
                </div>

                <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                    <form className='space-y-6' onSubmit={handleLogin}>
                        <div>
                            <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                                Email address
                            </label>
                            <div className='mt-2'>
                                <input
                                    id='email'
                                    name='email'
                                    type='email'
                                    autoComplete='email'
                                    required
                                    placeholder='Email'
                                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2'
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor='password' className='block text-sm font-medium leading-6 text-gray-900'>
                                Password
                            </label>
                            <div className='mt-2'>
                                <input
                                    id='password'
                                    name='password'
                                    type={showpassword ? 'text' : 'password'}
                                    autoComplete='current-password'
                                    required
                                    placeholder='Password'
                                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2'
                                />
                            </div>
                        </div>

                        <div className='mt-2 flex items-center'>
                            <input
                                id='showPassword'
                                name='showPassword'
                                type='checkbox'
                                checked={showpassword}
                                onChange={() => setshowpassword(!showpassword)}
                                className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                            />
                            <label htmlFor='showPassword' className='ml-2 block text-sm text-gray-900'>
                                Show Password
                            </label>
                        </div>

                        <div>
                            <button
                                type='submit'
                                className='flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            >
                                Log in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
