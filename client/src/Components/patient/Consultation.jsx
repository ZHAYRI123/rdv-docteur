import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import RdvReservé from './Rdv_Reservés/RdvReservé';
import PendingConsulations from './Consultations_En_Attente/ConsultationsEnAttente';
import CompletedConsultations from './consultations_terminées/ConsultationsTerminées';

export default function Consultations() {
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
		}
	}, []);

	return (
		<>
			<Toaster />
			<PendingConsulations />
			<h2 className='m-auto pt-12 font-bold my-2 text-xl uppercase'>Rendez-vous Réservés</h2>
			<RdvReservé />
			<h2 className='m-auto pt-12 font-bold my-2 text-xl uppercase'>Consultations Terminées</h2>
			<CompletedConsultations />
		</>
	);
}
