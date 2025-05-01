import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../image/logo.png';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const doctorId = localStorage.getItem('doctorId');
  
      const response = await fetch(`http://localhost:5000/doctor/${doctorId}/patients`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        const doctorData = await response.json();
        // Get patients array from doctor's data
        const patientsList = doctorData.patients || [];
        setPatients(patientsList);
      } else {
        toast.error('Erreur lors du chargement des patients');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Erreur de connexion au serveur');
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/rdv/getAllRdv', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Appointments error:', errorText);
        throw new Error(errorText);
      }
  
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Erreur lors du chargement des rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentAction = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem('token');
      const doctorId = localStorage.getItem('doctorId');
  
      const response = await fetch(`http://localhost:5000/rdv/updateStatus/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status,
          doctorId,
          completionDate: status === 'completed' ? new Date() : null
        })
      });
  
      if (response.ok) {
        toast.success(
          status === 'approved' ? 'Rendez-vous approuvé' :
          status === 'completed' ? 'Consultation terminée' :
          'Rendez-vous rejeté'
        );
        fetchAppointments(); // Refresh the list
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erreur lors de la mise à jour du rendez-vous");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur de connexion au serveur');
    }
  };

  const AppointmentsList = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Rendez-vous</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Heure</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {appointment.patient.nom} {appointment.patient.prenom}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(appointment.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{appointment.heure}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    appointment.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'}`}>
                  {appointment.status === 'pending' ? 'En attente' :
                   appointment.status === 'approved' ? 'Approuvé' :
                   appointment.status === 'completed' ? 'Terminé' : 
                   'Rejeté'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {appointment.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAppointmentAction(appointment._id, 'approved')}
                      className="text-green-600 hover:text-green-900"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => handleAppointmentAction(appointment._id, 'rejected')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Rejeter
                    </button>
                  </div>
                )}
                {appointment.status === 'approved' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAppointmentAction(appointment._id, 'completed')}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                    >
                      <span>Terminer la consultation</span>
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const PatientRecords = ({ patients }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Mes Patients</h2>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symptômes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap">{patient.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${patient.status === 'consultation' ? 'bg-yellow-100 text-yellow-800' : 
                      patient.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.symptoms}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {patient.completionDate ? new Date(patient.completionDate).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-blue-600 hover:text-blue-900 mr-4"
                    onClick={() => handleViewPatientDetails(patient.id)}
                  >
                    Voir Dossier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const handleViewPatientDetails = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/patient/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        const patientDetails = await response.json();
        // Here you can implement the logic to show patient details
        // For example, open a modal or navigate to a details page
        console.log('Patient details:', patientDetails);
      } else {
        toast.error('Erreur lors du chargement des détails du patient');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur de connexion au serveur');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="bg-gray-50">
      <Header />
      <main className="pt-20 px-4 pb-8">
        <div className="container mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Médecin</h1>
            <div className="flex gap-4">
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
              <button
                onClick={() => setActiveTab('patients')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'patients'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Mes Patients
              </button>
            </div>
          </div>

          {activeTab === 'appointments' ? (
            <AppointmentsList />
          ) : (
            <PatientRecords patients={patients} />
          )}
        </div>
      </main>
    </div>
  );
};

const Header = () => {
  const [doctorName, setDoctorName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail'); // Get email from localStorage

        if (!token || !email) {
          console.error('No token or email found');
          navigate('/login/doctor');
          return;
        }
    
        const response = await fetch('http://localhost:5000/doctor/getByEmail', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email }) // Send email in request body
        });
        
        if (response.ok) {
          const data = await response.json();
          setDoctorName(`Dr. ${data.nom} ${data.prenom}`);
          // Store doctor info for later use if needed
          localStorage.setItem('doctorId', data._id);
          localStorage.setItem('doctorName', `${data.nom} ${data.prenom}`);
        } else {
          const error = await response.json();
          console.error('Error response:', error);
          if (response.status === 401 || response.status === 403) {
            navigate('/login/doctor');
          }
        }
      } catch (error) {
        console.error('Error fetching doctor info:', error);
        navigate('/login/doctor');
      }
    };

    fetchDoctorInfo();
  }, [navigate]);

  return (
    <header className="fixed top-0 w-full bg-white shadow-lg z-50">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Basmah Logo" className="h-16 w-32" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{doctorName}</span>
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

export default DoctorDashboard;