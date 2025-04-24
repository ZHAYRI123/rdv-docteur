import React, { useState, useEffect } from 'react';
import DoctorCard from './DoctorCard';
import toast, { Toaster } from 'react-hot-toast';

function DoctorData() {
	const [Data, setData] = useState([]);
	const [specialities, setSpecialities] = useState([]);
	const [loading, setLoading] = useState(true);

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

	useEffect(() => {
		if (!getJwtToken()) {
			toast.error('Session expirée. Veuillez vous reconnecter.');
			window.location.href = '/patient-login';
			return;
		}

		const fetchData = async () => {
			try {
				const token = localStorage.getItem('token');

				if (!token) {
					toast.error('Session expirée. Veuillez vous reconnecter.');
					window.location.href = '/login/patient';
					return;
				}
					const [doctorResponse, specialitiesResponse] = await Promise.all([
							fetch('http://localhost:5000/doctor/all', {
									headers: {
											'Authorization': `Bearer ${getJwtToken()}`,
											'Content-Type': 'application/json',
									},
							}),
							fetch('http://localhost:5000/specialite/getAllSpecialites', {
									headers: {
											'Authorization': `Bearer ${getJwtToken()}`,
											'Content-Type': 'application/json',
									},
							})
					]);

					if (doctorResponse.status === 404) {
							setData([]);
							setLoading(false);
							return;
					}

					if (doctorResponse.status === 500 || !specialitiesResponse.ok) {
							toast.error('Erreur interne du serveur.');
							setLoading(false);
							return;
					}

					const [doctorsData, specialitiesData] = await Promise.all([
							doctorResponse.json(),
							specialitiesResponse.json()
					]);

					// Create a map of speciality IDs to names
					const specialityMap = new Map(
							specialitiesData.map(spec => [spec._id, spec.nom])
					);

					// Add speciality names to doctor data
					const doctorsWithSpecialities = doctorsData.map(doctor => ({
							...doctor,
							specialiteName: specialityMap.get(doctor.specialite) || 'Non spécifié'
					}));

					// Sort doctors by speciality name
					doctorsWithSpecialities.sort((a, b) => 
							a.specialiteName.localeCompare(b.specialiteName)
					);

					setData(doctorsWithSpecialities);
					setSpecialities(specialitiesData);
					setLoading(false);
			} catch (error) {
				console.error('Fetch error:', error);
				toast.error("Une erreur s'est produite lors du chargement.");
				setLoading(false);
			}
	};

	fetchData();
}, []);

return (
	<>
			<Toaster />
			{loading ? (
					<div className='text-center font-semibold text-gray-700 p-5'>Chargement des données...</div>
			) : (
					<div className='flex flex-wrap max-w-screen-lg m-auto px-5 w-full'>
							{Data.length > 0 ? (
									specialities.map((speciality) => (
											<div key={speciality._id} className='flex flex-col justify-center space-y-4 md:space-y-0 md:space-x-6 w-full'>
													<h4 className='text-lg font-bold text-left mx-auto text-red-700'>{speciality.nom}</h4>
													{Data.filter(doctor => doctor.specialite === speciality._id).map((data) => (
															<div key={data._id}>
																	<DoctorCard
																			name={`${data.nom} ${data.prenom}`}
																			specialisation={data.specialiteName}
																			email={data.email}
																			telephone={data.telephone}
																			doctor_id={data._id}
																	/>
															</div>
													))}
											</div>
									))
							) : (
									<div className='p-5 border-solid border-2 border-red-600 rounded-lg shadow-md bg-stone-100 hover:scale-105 transition-all m-auto'>
											<div className='flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row'>
													<div>
															<h4 className='text-lg font-bold text-left mx-2 text-red-700'>Aucun médecin disponible</h4>
													</div>
											</div>
									</div>
							)}
					</div>
			)}
	</>
);
}

export default DoctorData;
