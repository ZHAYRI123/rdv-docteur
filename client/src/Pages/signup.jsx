import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import logo from '../image/logo.png';

const Signup = () => {
  const [showpassword, setshowpassword] = useState(false);
  // const navigator = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === '' || password === '') {
      toast.error('Please fill all the fields');
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(password)) {
      toast.error('Password must have an upper case letter, a lower case letter, a number and a special character');
      return;
    }

    const signupData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:5000/patient/createPatient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });
      
      if (response.status === 400) {
        toast.error('Email already in use!');
        return;
      } else if (response.status === 500) {
        toast.error('Internal server error');
        return;
      } else {
        toast.success('Account created successfully!');
        const data = await response.json();
        document.cookie = `jwtToken=${data.token}; expires=${new Date(new Date().getTime() + 3600000).toUTCString()}; path=/`;
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isDoctor', false);
        //setTimeout(() => navigator('/update-profile'), 2000);
      }
    } catch (error) {
      console.log(error);
      toast.error('Internal server error');
    }
  };

  const handleShowPassword = () => {
    setshowpassword(!showpassword);
  };

  return (
    <>
      <Toaster />
      <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-24 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <img className='mx-auto h-32 w-32' src={logo} alt='Basmah Company' />
          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
            Patient Sign Up
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form className='space-y-6' onSubmit={handleSignup}>
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
                  autoComplete='new-password'
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
                onChange={handleShowPassword}
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
                S'inscrire
              </button>
            </div>
          </form>

          <p className='mt-10 text-center text-sm text-gray-500'>
            Vous avez déjà un compte?{' '}
            <a href='/login/patient' className='font-semibold leading-6 text-green-600 hover:text-green-500'>
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;