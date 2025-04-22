import React, { useState, useEffect } from 'react';
import DoctorCard from './DoctorCard';
import toast, { Toaster } from 'react-hot-toast';

function DoctorData() {
	const [Data, setData] = useState([]);
	const [specialisations, setSpecialisations] = useState([]);
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
				
				const doctorResponse = await fetch('http://localhost:5000/doctor/getAll', {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${getJwtToken()}`,
						'Content-Type': 'application/json',
					},
				});

				if (doctorResponse.status === 404) {
					setData([]);
					setLoading(false);
					return;
				}

				if (doctorResponse.status === 500) {
					toast.error('Erreur interne du serveur.');
					setLoading(false);
					return;
				}

				const doctorsData = await doctorResponse.json();

				doctorsData.sort((a, b) => {
					const specArrA = a.specialisation.toLowerCase().split(',').map((s) => s.trim()).sort();
					const specArrB = b.specialisation.toLowerCase().split(',').map((s) => s.trim()).sort();
					return specArrA.join(',').localeCompare(specArrB.join(','));
				});

				setData(doctorsData);

				const specs = new Set();
				doctorsData.forEach((doctor) => {
					doctor.specialisation.split(',').forEach((spec) => specs.add(spec.trim()));
				});
				setSpecialisations(Array.from(specs));
				setLoading(false);
			} catch (error) {
				console.log(error);
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
						specialisations.map((spec, index) => (
							<div key={index} className='flex flex-col justify-center space-y-4 md:space-y-0 md:space-x-6 w-full'>
								<h4 className='text-lg font-bold text-left mx-auto text-red-700'>{spec}</h4>
								{Data.map((data) => {
									const specs = data.specialisation.split(',').map((s) => s.trim());
									if (specs.includes(spec)) {
										return (
											<div key={data._id}>
												<DoctorCard
													name={data.name}
													specialisation={data.specialisation}
													workingHours={data.workingHours}
													email={data.email}
													doctor_id={data._id}
												/>
											</div>
										);
									}
									return null;
								})}
							</div>
						))
					) : (
						<div className='p-5 m-2 border-solid border-2 border-red-600 rounded-lg shadow-md bg-stone-100 hover:scale-105 transition-all m-auto'>
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
