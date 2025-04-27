import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function DoctorCard(props) {
	// const renderableWorkingHours = props.workingHours.filter((workingHour) => workingHour.from !== '' && workingHour.to !== '');

	const [showModal, setShowModal] = useState(false);
	const [inputValue, setInputValue] = useState('');

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
		const token = getJwtToken();
		if (!token) {
			toast.error('Session expirée. Veuillez vous reconnecter');
			return window.location.href('/patient-login');
		}

		const headers = {
			'Content-Type': 'application/json',
		};

		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		if (options.headers) {
			Object.assign(headers, options.headers);
		}

		return await fetch(url, {
			...options,
			headers: headers,
		});
	};

	const handleOpenModal = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleInputChange = (event) => {
		setInputValue(event.target.value);
	};

	const handlePrescriptionSubmit = async () => {
		const doctorEmail = props.email;
		const patientEmail = localStorage.getItem('userEmail');
		const symptoms = inputValue;
		let dupFlag = false;

		if (!symptoms.trim()) {
			toast.error('Veuillez décrire vos symptômes');
			return;
		}

		try {
			const patientResponse = await authFetch('http://localhost:5000/patient/getByEmail', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: patientEmail,
				}),
			});

			if (!patientResponse.ok) {
				throw new Error(`HTTP error! status: ${patientResponse.status}`);
			}

			const patient = await patientResponse.json();
			
			// Check if patient.doctor exists and is an array
			if (patient.doctor && Array.isArray(patient.doctor)) {
				// Check for existing consultation
				const existingConsultation = patient.doctor.find(
					doctor => doctor.email === doctorEmail && doctor.status === 'consultation'
				);

				if (existingConsultation) {
					toast.error('Une demande de consultation est déjà en attente. Veuillez patienter.');
					return;
				}
			}

			// Update patient data
			const patientDataToUpdate = {
				email: patientEmail,
				$push: {
					doctor: {
						email: doctorEmail,
						status: 'consultation',
						symptoms: symptoms,
					},
				},
			};

			const response = await authFetch('http://localhost:5000/patient/updatePatient', {
				method: 'PUT', // Changed from POST to PUT
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(patientDataToUpdate),
			});

			if (!response.ok) {
				const errorMessage = await response.text();
				throw new Error(errorMessage);
			}

			const updatedPatient = await response.json();
			console.log('Patient mis à jour avec succès:', updatedPatient);

			// Update doctor data
			const doctorResponse = await authFetch('http://localhost:5000/doctor/updateDoctor', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: doctorEmail,
					$push: {
						patients: {
							email: patientEmail,
							status: 'consultation',
							symptoms: symptoms,
						},
					},
				}),
			});

			if (!doctorResponse.ok) {
				throw new Error(`HTTP error! status: ${doctorResponse.status}`);
			}

			const updatedDoctor = await doctorResponse.json();
			console.log('Médecin mis à jour avec succès:', updatedDoctor);
			
			toast.success('Demande de consultation envoyée avec succès');
			setTimeout(() => {
				handleCloseModal();
				setInputValue('');
			}, 2000);

		} catch (error) {
			console.error('Error:', error);
			toast.error('Erreur lors de l\'envoi de la demande');
		}
	};

	return (
		<>
			<Toaster />
			{showModal && (
				<div className='fixed inset-0 z-10 overflow-y-auto' role='dialog' aria-modal='true'>
					<div className='flex flex-col items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
						<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' aria-hidden='true'></div>
						<span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>&#8203;</span>
						<div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full'>
							<div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
								<div className='text-center'>
									<div className='flex justify-center'>
										<h1 className='text-2xl font-medium text-gray-900' id='modal-title'>Formulaire de consultation</h1>
										<div className='absolute right-5'>
											<button onClick={handleCloseModal} className='hover:bg-gray-100 transition-all rounded'>&#10060;</button>
										</div>
									</div>
									<div className='mt-10 text-left'>
										<div className='font-bold'>Médecin : <span className='text-gray-600 font-normal'>{props.name}</span></div>
										<div className='font-bold'>Spécialité : <span className='text-gray-600 font-normal'>{props.specialisation}</span></div>
										<div className='mt-4'>
											<div className='font-bold mb-2'>Veuillez décrire vos symptômes :</div>
											<textarea value={inputValue} onChange={handleInputChange} className='min-h-20 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm' placeholder='Listez vos symptômes séparés par des virgules' />
										</div>
									</div>
								</div>
							</div>
							<div className='flex justify-center bg-gray-50 px-4 py-3 sm:px-6'>
								<button className='inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm' onClick={handlePrescriptionSubmit}>
									Envoyer
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className='p-5 m-2 w-full border-2 border-green-600 rounded-lg shadow-md bg-stone-100 hover:scale-105 transition-all'>
				<div className='flex flex-col md:flex-row md:space-x-6'>
					<div>
						<h4 className='text-lg font-bold text-left mx-2'>Dr. {props.name}</h4>
						<div className='mx-2'>
							<div className='font-bold text-left'>Spécialité : <span className='text-gray-600 font-normal'>{props.specialisation}</span></div>
						</div>
					</div>
				</div>
				{/* <div className='mx-2'>
					<div className='font-bold text-left'>
						Horaires : <span className='text-gray-600 font-normal'>
							{renderableWorkingHours.map((workingHour, index) => (
								<span key={index}>
									{workingHour.day} : {workingHour.from} à {workingHour.to}
									{index !== renderableWorkingHours.length - 1 && ', '}
								</span>
							))}
						</span>
					</div>
				</div> */}
				<button className='m-2 px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500' onClick={handleOpenModal}>
					Réserver
				</button>
			</div>
		</>
	);
}
