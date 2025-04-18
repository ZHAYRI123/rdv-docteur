import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from '../Hopital/Calendar';
import logo from '../../image/logo.png';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [activeTab, setActiveTab] = useState('consultations');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:5000/doctor/patients', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="bg-gray-50">
      <Header />
      <main className="pt-20 px-4 pb-8">
        <div className="container mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Médecin</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('consultations')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'consultations'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Dossiers Patients
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'appointments'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Rendez-vous
              </button>
            </div>
          </div>

          {activeTab === 'consultations' ? (
            <PatientRecords patients={patients} />
          ) : (
            <Calendar />
          )}
        </div>
      </main>
    </div>
  );
};

const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-white shadow-lg z-50">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Basmah Logo" className="h-16 w-32" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Dr. {localStorage.getItem('doctorName')}</span>
            <Link
              to="/hospital"
              className="text-zinc-600 hover:text-blue-500 transition-colors"
            >
              Déconnexion
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

const PatientRecords = ({ patients }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Dossiers Patients</h2>
        <div className="relative">
          <input
            type="search"
            placeholder="Rechercher un patient..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière Visite</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{patient.lastVisit}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">
                    Voir Dossier
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    Nouveau RDV
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorDashboard;