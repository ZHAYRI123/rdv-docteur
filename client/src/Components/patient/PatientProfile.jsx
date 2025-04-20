import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const PatientProfile = () => {
  const [patientData, setPatientData] = useState({
    prenom: '',
    nom: '',
    email: '',
    dateNaissance: '',
    telephone: '',
    sexe: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = getJwtToken();
        if (!token) {
          toast.error('Session expirée');
          return;
        }

        const response = await fetch('http://localhost:5000/patient/getByEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            email: localStorage.getItem('userEmail') 
          })
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données');
        }

        const data = await response.json();
        if (data) {
          setPatientData(data);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Erreur lors du chargement du profil');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  const calculateAge = (dateNaissance) => {
    if (!dateNaissance) return 'Non renseigné';
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  function getJwtToken() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'jwtToken') return value;
    }
    return null;
  }

  if (isLoading) {
    return <div className="w-96 p-6 bg-white rounded-lg shadow-lg">Chargement...</div>;
  }

  return (
    <div className="w-96 p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mon Profil</h2>
        
        {patientData && (
          <div className="grid gap-4">
            <div className="border-b pb-3">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Nom complet</h3>
              <p className="text-lg font-medium text-gray-900">
                {`${patientData.prenom} ${patientData.nom}`.trim() || 'Non renseigné'}
              </p>
            </div>

            <div className="border-b pb-3">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p className="text-lg font-medium text-gray-900">
                {patientData.email || 'Non renseigné'}
              </p>
            </div>

            <div className="border-b pb-3">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Âge</h3>
              <p className="text-lg font-medium text-gray-900">
                {calculateAge(patientData.dateNaissance) !== 'Non renseigné' 
                  ? `${calculateAge(patientData.dateNaissance)} ans` 
                  : 'Non renseigné'}
              </p>
            </div>

            <div className="border-b pb-3">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Téléphone</h3>
              <p className="text-lg font-medium text-gray-900">
                {patientData.telephone || 'Non renseigné'}
              </p>
            </div>

            <div className="border-b pb-3">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Sexe</h3>
              <p className="text-lg font-medium text-gray-900">
                {patientData.sexe || 'Non renseigné'}
              </p>
            </div>
          </div>
        )}

        <Link 
          to="/update-profile"
          className="mt-6 block w-full text-center bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          Modifier le profil
        </Link>
      </div>
    </div>
  );
};

export default PatientProfile;
