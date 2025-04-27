import React, { useState, useEffect } from 'react';
import TableCard from './CardforPending';
import toast, { Toaster } from 'react-hot-toast';

function PendingData() {
	const [Data, setData] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const [isData, setIsData] = useState(false);
	const email = localStorage.getItem('userEmail');

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

	const jwtToken = getJwtToken();

	useEffect(() => {
		if (!jwtToken) {
			toast.error('Session expirée. Veuillez vous reconnecter.');
			window.location.href = '/patient-login';
			return;
		}

		const fetchPatient = async () => {
			try {
				const response = await fetch('http://localhost:5000/patient/getByEmail', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${jwtToken}`,
					},
					body: JSON.stringify({ email }),
				});

				if (response.status === 404) {
					toast.error('Patient introuvable.');
					return;
				}
				if (response.status === 500) {
					toast.error('Erreur interne du serveur.');
					return;
				}

				const patient = await response.json();
				console.log("Patient récupéré :", patient);
				
				// Check if patient.doctor exists
				if (!patient.doctor || !Array.isArray(patient.doctor)) {
					setIsData(false);
					setLoading(false);
					return;
				}

				// Use Promise.all to handle multiple async operations
				const doctorPromises = patient.doctor
					.filter(doctor => doctor.status === 'consultation')
					.map(async (doctor, index) => {
						try {
							const response = await fetch('http://localhost:5000/doctor/getByEmail', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
									Authorization: `Bearer ${jwtToken}`,
								},
								body: JSON.stringify({ email: doctor.email }),
							});

							if (!response.ok) {
								throw new Error(`HTTP error! status: ${response.status}`);
							}

							const doctorData = await response.json();
							return {
								sr: index + 1,
    							name: doctorData.nom + ' ' + doctorData.prenom,
    							specialisation: doctorData.specialite.nom, 
    							symptoms: doctor.symptoms,
							};
						} catch (error) {
							console.error(error);
							return null;
						}
					});

				const results = await Promise.all(doctorPromises);
				const validResults = results.filter(Boolean);
				
				setData(validResults);
				setIsData(validResults.length > 0);
				setLoading(false);

			} catch (error) {
				console.error(error);
				toast.error('Erreur interne du serveur.');
				setLoading(false);
			}
		};

		fetchPatient();
	}, [jwtToken]);

	return (
		<>
			<Toaster />
			{isLoading ? (
				<div className='flex justify-center items-center h-screen'>Chargement...</div>
			) : (
				<>
					{isData ? (
						<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
  <div className='overflow-hidden rounded-lg shadow-md'>
    <table className='min-w-full table-fixed divide-y divide-gray-200'>
      <thead className='bg-purple-900'> {/* Changed from bg-green-600 to bg-purple-600 */}
        <tr>
          <th scope='col' className='w-[10%] px-6 py-4 text-left text-sm font-semibold text-white'>#</th>
          <th scope='col' className='w-[30%] px-6 py-4 text-left text-sm font-semibold text-white'>Docteur</th>
          <th scope='col' className='w-[30%] px-6 py-4 text-left text-sm font-semibold text-white'>Spécialité</th>
          <th scope='col' className='w-[30%] px-6 py-4 text-left text-sm font-semibold text-white'>Symptômes</th>
        </tr>
      </thead>
      <tbody className='bg-white divide-y divide-gray-200'>
        {Data.map((data, index) => (
          <TableCard
            key={index}
            sr={data.sr}
            name={data.name}
            specialisation={data.specialisation}
            symptoms={data.symptoms}
          />
        ))}
      </tbody>
    </table>
  </div>
</div>
					) : (
						<div className='p-5 m-2 border-solid border-2 border-red-600 rounded-lg shadow-md bg-stone-100 hover:scale-105 transition-all m-auto'>
							<div className='flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row'>
								<div className=''>
									<h4 className='text-lg font-bold text-left mx-2 text-red-700'>Aucune consultation en attente</h4>
								</div>
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
}

export default PendingData;
