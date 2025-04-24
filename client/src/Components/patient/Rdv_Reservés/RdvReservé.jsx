import React from 'react';
import { useState, useEffect } from 'react';
import TableCard from './CardPourRdv';
import toast, { Toaster } from 'react-hot-toast';

function RdvReservé() {
	const [Data, setData] = useState([]);
	const [isData, setIsData] = useState(false);
	const [isLoading, setLoading] = useState(true);
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
		const fetchAppointments = async () => {
			try {
				if (!jwtToken) {
					toast.error('Session expirée');
					return;
				}

				const response = await fetch('http://localhost:5000/rdv/getAllRdv', {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${jwtToken}`,
					},
					
				});

				if (response.status === 404) {
					setData([]);
					return;
				}

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const rdvs = await response.json();
				setData(
					rdvs.map((rdv, index) => ({
						sr: index + 1,
						name: rdv.docteur.nom,
						 specialisation: rdv.docteur.specialisation,
						date: new Date(rdv.date).toLocaleDateString(),
						time: rdv.heure,
					}))
				);
				setIsData(true);
			} catch (error) {
				console.error('Error:', error);
				toast.error('Erreur lors du chargement des rendez-vous');
			} finally {
				setLoading(false);
			}
		};

		fetchAppointments();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [jwtToken]);

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
													<th scope='col' className='px-6 py-4'>Specialité</th>
													<th scope='col' className='px-6 py-4'>Date</th>
													<th scope='col' className='px-6 py-4'>Heure</th>
												</tr>
											</thead>
											<tbody>
												{Data.map((data, index) => (
													<TableCard
														key={index}
														sr={data.sr}
														name={data.name}
														specialisation={data.specialisation}
														date={data.date}
														time={data.time}
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
								<h4 className='text-lg font-bold text-left mx-2 text-red-700'>Aucun rendez-vous à venir</h4>
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
}

export default RdvReservé;