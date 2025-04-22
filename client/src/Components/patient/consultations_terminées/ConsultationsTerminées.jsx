import React from 'react';
import { useState, useEffect } from 'react';
import TableCard from './CardforCompleted';
import toast, { Toaster } from 'react-hot-toast';

function CompletedConsultations() {
	const [Data, setData] = useState([]);
	const [isData, setIsData] = useState(false);
	const [isLoading, setLoading] = useState(true);
	const patientEmail = localStorage.getItem('userEmail');

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

		const fetchCompleted = async () => {
			try {
				const patientResponse = await fetch('http://localhost:5000/patient/getByEmail', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${jwtToken}`,
					},
					body: JSON.stringify({ email: patientEmail }),
				});

				if (!patientResponse.ok) {
					throw new Error(`HTTP error! status: ${patientResponse.status}`);
				}

				const patient = await patientResponse.json();

				// Check if patient and patient.doctor exist
				if (!patient || !patient.doctor) {
					setIsData(false);
					setLoading(false);
					return;
				}

				const completedDoctors = patient.doctor.filter((doc) => doc.status === 'completed');

				if (completedDoctors.length === 0) {
					setIsData(false);
					setLoading(false);
					return;
				}

				const doctorsData = await Promise.all(
					completedDoctors.map(async (doc) => {
						try {
							const doctorResponse = await fetch('http://localhost:5000/doctor/getByEmail', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
									Authorization: `Bearer ${jwtToken}`,
								},
								body: JSON.stringify({ email: doc.email }),
							});

							if (!doctorResponse.ok) {
								throw new Error(`HTTP error! status: ${doctorResponse.status}`);
							}

							const doctorData = await doctorResponse.json();
							return {
								sr: Data.length + 1,
								name: doctorData.name,
								email: doc.email,
								id: doc.id,
								specialisation: doctorData.specialisation,
								symptoms: doc.symptoms,
								feedback: doc.feedback,
							};
						} catch (error) {
							console.error('Error fetching doctor:', error);
							return null;
						}
					})
				);

				const validDoctorsData = doctorsData.filter(Boolean);
				setData(validDoctorsData);
				setIsData(validDoctorsData.length > 0);
			} catch (error) {
				console.error('Error:', error);
				toast.error('Erreur lors du chargement des consultations terminées');
			} finally {
				setLoading(false);
			}
		};

		fetchCompleted();
	}, [jwtToken, patientEmail]);

	return (
		<>
			<Toaster />
			{isLoading ? (
				<div className='flex justify-center items-center h-screen'>Chargement...</div>
			) : (
				<>
					{isData ? (
						<div className='flex flex-col overflow-x-auto'>
							<div className='sm:-mx-6 lg:-mx-8'>
								<div className='inline-block min-w-full py-2 sm:px-6 lg:px-8'>
									<div className='overflow-x-auto'>
										<table className='min-w-full text-left text-sm font-light'>
											<thead className='border-b text-white text-base font-medium dark:border-neutral-500 bg-green-600'>
												<tr>
													<th scope='col' className='px-6 py-4'>#</th>
													<th scope='col' className='px-6 py-4'>Nom</th>
													<th scope='col' className='px-6 py-4'>Spécialisation</th>
													<th scope='col' className='px-6 py-4'>Symptômes</th>
													<th scope='col' className='px-6 py-4'>Retour</th>
												</tr>
											</thead>
											<tbody>
												{Data.map((data, index) => (
													<TableCard
														key={index}
														sr={data.sr}
														name={data.name}
														email={data.email}
														specialisation={data.specialisation}
														symptoms={data.symptoms}
														feedback={data.feedback}
														id={data.id}
													/>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className='p-5 m-2 border-solid border-2 border-red-600 rounded-lg shadow-md bg-stone-100 hover:scale-105 transition-all m-auto'>
							<div className='flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row'>
								<div>
									<h4 className='text-lg font-bold text-left mx-2 text-red-700'>
										Aucun rendez-vous terminé
									</h4>
								</div>
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
}

export default CompletedConsultations;
