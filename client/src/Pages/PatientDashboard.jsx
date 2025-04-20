import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route, Link, Outlet } from 'react-router-dom';
import PatientProfile from '../Components/patient/PatientProfile';
import DoctorData from '../Components/patient/DoctorData';
import toast, { Toaster } from 'react-hot-toast';
import Consultations from '../Components/Patient/Consultations';

const PatientDashBoard = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [location, setLocation] = useState('Clinique Centrale'); // valeur par défaut
	const Location = useLocation();
	const navigator = useNavigate();

	const email = localStorage.getItem('userEmail');
	const isDoctor = localStorage.getItem('isDoctor');

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

	const authFetch = async (url, options = {}) => {
		const jwtToken = getJwtToken();
		const headers = {
			'Content-Type': 'application/json',
		};
		if (jwtToken) headers['Authorization'] = `Bearer ${jwtToken}`;
		if (options.headers) Object.assign(headers, options.headers);

		return await fetch(url, { ...options, headers });
	};

	useEffect(() => {
		const jwtToken = getJwtToken();
		if (!jwtToken) {
			toast.error('Accès refusé. Veuillez vous connecter.');
			return setTimeout(() => navigator('/patient-login'), 1500);
		}

		if (isDoctor === 'true') {
			toast.error('Accès refusé. Veuillez vous connecter en tant que patient.');
			return setTimeout(() => navigator('/patient-login'), 1500);
		}

		const fetchData = async () => {
			try {
				const response = await authFetch('http://localhost:5000/patient/getByEmail', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email }),
				});

				if (response.status === 404) return toast.error('Patient introuvable');
				if (response.status === 500) return toast.error('Erreur interne du serveur');

				const data = await response.json();
				if (!data.location) toast('Veuillez mettre à jour votre profil.');
				setLocation(data.location || 'Clinique Centrale');
				setIsLoading(false);
			} catch (err) {
				toast.error('Erreur lors du chargement du profil.');
				console.log(err);
			}
		};

		fetchData();
	}, [email, isDoctor, navigator]);

	return (
		<>
			<Toaster />
			{isLoading ? (
				<div className='m-auto font-bold text-2xl'>Chargement...</div>
			) : (
				<div className='flex relative px-10'>
					{/* Partie principale */}
					<div className='flex flex-col justify-center w-full md:w-[calc(100%-24rem)]'>
						<div className='pt-24 m-auto pb-1 flex justify-around items-center md:w-[calc(100%-10rem)]'>
							{/* Affichage du bouton pour changer de vue */}
							{window.location.pathname === '/patient-dashboard/consultations' ? (
								<Link to='/patient-dashboard' className='m-2 px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700'>
									Tous les Médecins
								</Link>
							) : (
								<Link to='/patient-dashboard/consultations' className='m-2 px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700'>
									Mes Consultations
								</Link>
							)}
						</div>

						<h2 className='m-auto font-bold my-2 text-xl uppercase'>
							{window.location.pathname === '/patient-dashboard/consultations' ? 'Consultations en attente' : 'Liste des médecins disponibles'}
						</h2>

						<Routes>
							<Route path='/' element={<DoctorData location={location} />} />
							<Route path='/consultations' element={<Consultations />} />
							<Route path='/patient-dashboard' element={<Outlet />} />
						</Routes>
					</div>

					{/* Profil patient affiché à droite */}
					<div className='hidden md:block fixed right-0 top-16'>
						<PatientProfile />
					</div>
				</div>
			)}
		</>
	);
};

export default PatientDashBoard;
