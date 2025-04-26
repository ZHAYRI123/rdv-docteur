import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import loginImg from "../image/login.png";

const Login = ({ userType = 'patient' }) => {
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (event) => {
		event.preventDefault();
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;

		if (!email || !password) {
			toast.error("Veuillez remplir tous les champs");
			return;
		}

		const urlMap = {
			patient: 'http://localhost:5000/patient/loginPatient',
			doctor: 'http://localhost:5000/doctor/loginDoctor',
			hospital: 'http://localhost:5000/hopital/login',
		};

		const url = urlMap[userType];
		if (!url) {
			toast.error("Type d'utilisateur invalide.");
			return;
		}

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});

			if (response.status === 404) {
				if (userType === 'patient') {
					toast.error("Aucun compte patient trouvé. Redirection vers l'inscription...");
					setTimeout(() => {
						navigate('/signup');
					}, 2000);
				} else {
					toast.error(`Aucun compte ${userType} trouvé.`);
				}
				return;
			} else if (response.status === 400) {
				toast.error("Mot de passe incorrect");
				return;
			} else if (response.status === 500) {
				toast.error("Erreur serveur");
				return;
			}

			const { token } = await response.json();
			toast.success('Connexion réussie');

			localStorage.setItem('token', token);



			document.cookie = `jwtToken=${token}; expires=${new Date(new Date().getTime() + 3600000).toUTCString()}; path=/`;
			localStorage.setItem('userEmail', email);
			localStorage.setItem('userType', userType);

			setTimeout(() => {
				if (userType === 'patient') navigate('/patient-dashboard');
				else if (userType === 'doctor') navigate('/doctor-dashboard');
				else navigate('/hospital/admin');
			}, 1500);

		} catch (err) {
			toast.error("Erreur réseau");
			console.error(err);
		}
	};

	const Handleshowpassword = () => {
		setShowPassword(!showPassword);
	};

    const getTitle = () => {
        const titles = {
            hospital: 'Administration Connexion',
            doctor: 'Docteur Connexion',
            patient: 'Patient Connexion',
        };
        return titles[userType] || 'Login';
    };
	return (
		<>
			<Toaster />
			 <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-24 lg:px-8'>
                            <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                                <img className='mx-auto h-20 w-auto' src={loginImg} alt='Basmah Company' />
                                <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
                                    {getTitle()}
                                </h2>
                            </div>

					<div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
						<form className='space-y-6' action='/' method='POST' id='loginForm'>
							<div>
								<label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
									Email address
								</label>
								<div className='mt-2'>
									<input id='email' name='email' type='email' autoComplete='email' required placeholder='Email' className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 ' />
								</div>
							</div>

							<div>
								<div className='flex items-center justify-between'>
									<label htmlFor='password' className='block text-sm font-medium leading-6 text-gray-900'>
										Password
									</label>
								</div>
								<div className='mt-2'>
									<input id='password' name='password' type={showPassword ? 'text' : 'password'} autoComplete='current-password' required placeholder='Password' className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 ' />
								</div>
							</div>
							<div className='mt-2 flex items-center'>
								<input id='showPassword' name='showPassword' type='checkbox' checked={showPassword} onChange={Handleshowpassword} className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded' />
								<label htmlFor='showPassword' className='ml-2 block text-sm text-gray-900'>
									Show Password
								</label>
							</div>
							<div>
								<button type='submit' className='flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none' onClick={handleLogin}>
									Se connecter
								</button>
							</div>
						</form>

						{userType === 'patient' && (
                        <p className="mt-10 text-center text-sm text-gray-500">
                            Pas encore membre?{' '}
                            <Link
                                to="/signup"
                                className="font-semibold leading-6 text-green-600 hover:text-green-500"
                            >
                                Inscrivez-vous
                            </Link>
                        </p>
                    )}
                </div>
            </div>
		</>
	);
};

export default Login;
