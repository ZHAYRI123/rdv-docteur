import { Link } from "react-router-dom";
import Calendar from './Calendar';
import logo from "../../image/logo.png";
import SpecialityManagement from "./specialite";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Admin = () => {
  return (
    <div className="bg-gray-50">
      <Header />
      <main className="pt-20 px-4 pb-8">
        <div className="container mx-auto">
          <StatisticsSection />
          <SpecialityManagement />
          <br />
          <DoctorManagement />
          <PatientManagement />
          <Calendar />
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
            <span className="text-gray-600">Admin Panel</span>
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

const StatisticCard = ({ title, value, percentage }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
      <div className="flex items-center">
        <span className="text-3xl font-bold text-gray-800">{value}</span>
        {percentage && (
          <span className="text-green-500 text-sm ml-2">+{percentage}%</span>
        )}
      </div>
    </div>
  );
};

const StatisticsSection = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    activeDoctors: 0,
    totalPatients: 0,
    loading: true
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      
      const [rdvResponse, doctorsResponse, patientsResponse] = await Promise.all([
        fetch('http://localhost:5000/rdv/getAllRdv', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:5000/doctor/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:5000/patient/getAllPatients', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);
  
      if (!rdvResponse.ok || !doctorsResponse.ok || !patientsResponse.ok) {
        throw new Error('Failed to fetch statistics');
      }
  
      const [appointments, doctors, patients] = await Promise.all([
        rdvResponse.json(),
        doctorsResponse.json(),
        patientsResponse.json()
      ]);

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      // Calculate statistics
      const todayAppointments = appointments.filter(rdv => 
        rdv.date.startsWith(today)
      ).length;

      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      const lastMonthAppointments = appointments.filter(rdv => 
        new Date(rdv.date) >= lastMonthDate
      ).length;

      const percentageChange = lastMonthAppointments > 0 
        ? Math.round((todayAppointments / lastMonthAppointments) * 100) 
        : 0;

      setStats({
        totalAppointments: appointments.length,
        todayAppointments,
        activeDoctors: doctors.length,
        totalPatients: patients.length,
        percentageChange,
        loading: false
      });

    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast.error('Erreur lors du chargement des statistiques');
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  if (stats.loading) {
    return <div>Chargement des statistiques...</div>;
  }

  const statisticsData = [
    { 
      title: "Total Rendez-vous", 
      value: stats.totalAppointments, 
      percentage: stats.percentageChange 
    },
    { 
      title: "Rendez-vous Aujourd'hui", 
      value: stats.todayAppointments 
    },
    { 
      title: "Médecins Actifs", 
      value: stats.activeDoctors 
    },
    { 
      title: "Patients Total", 
      value: stats.totalPatients 
    }
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statisticsData.map((stat, index) => (
        <StatisticCard 
          key={index}
          title={stat.title}
          value={stat.value}
          percentage={stat.percentage}
        />
      ))}
    </section>
  );
};

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialities, setSpecialities] = useState([]);

  useEffect(() => {
    fetchDoctors();
    fetchSpecialities();
  }, []);

  const fetchSpecialities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/specialite/getAllSpecialites', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSpecialities(data);
      }
    } catch (error) {
      console.error('Error fetching specialities:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/doctor/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else {
        toast.error('Erreur lors du chargement des médecins');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const getSpecialityName = (specialityId) => {
    const speciality = specialities.find(s => s._id === specialityId);
    return speciality ? speciality.nom : 'Non spécifié';
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce médecin ?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/doctor/${id}`, { // Changed from docteur to doctor
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (response.ok) {
          toast.success('Médecin supprimé avec succès');
          fetchDoctors(); // Refresh the list
        } else {
          const errorData = await response.text();
          console.error('Server response:', errorData);
          toast.error('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Erreur de connexion au serveur');
      }
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <section className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Gestion des Médecins</h2>
        <Link
          to="/hospital/admin/add-doctor"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Ajouter un Médecin
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prénom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spécialité</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {doctors.map((doctor) => (
              <tr key={doctor._id}>
                <td className="px-6 py-4 whitespace-nowrap">{doctor.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap">{doctor.prenom}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getSpecialityName(doctor.specialite)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{doctor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{doctor.telephone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-4">
                  <Link
                    to={`/hospital/admin/edit-doctor/${doctor._id}`}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(doctor._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/patient/getAllPatients', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      } else {
        toast.error('Erreur lors du chargement des patients');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/patient/deletePatient/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          toast.success('Patient supprimé avec succès');
          fetchPatients();
        } else {
          const errorData = await response.text();
          console.error('Server response:', errorData);
          toast.error('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Erreur de connexion au serveur');
      }
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <section className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Gestion des Patients</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prénom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date de naissance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient._id}>
                <td className="px-6 py-4 whitespace-nowrap">{patient.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.prenom}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.telephone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(patient.dateNaissance).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(patient._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Admin;