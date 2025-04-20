import { Link } from "react-router-dom";
import Calendar from './Calendar';
import logo from "../../image/logo.png";

const Admin = () => {
  return (
    <div className="bg-gray-50">
      <Header />
      <main className="pt-20 px-4 pb-8">
        <div className="container mx-auto">
          <StatisticsSection />
          <DoctorManagement />
          <calendar />
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
              to="/hopital"
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
  const stats = [
    { title: "Total Rendez-vous", value: 152, percentage: 12 },
    { title: "Rendez-vous Aujourd'hui", value: 24 },
    { title: "Médecins Actifs", value: 8 },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatisticCard key={index} {...stat} />
      ))}
    </section>
  );
};

const DoctorManagement = () => {
  const doctors = [
    {
      name: "Dr. Mohamed Cheick",
      specialty: "Cardiologie",
      email: "m.cheick@basmah.com"
    }
  ];

  const handleDelete = (email) => {
    console.log(`Delete doctor with email: ${email}`);
  };

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spécialité</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {doctors.map((doctor, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{doctor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{doctor.specialty}</td>
                <td className="px-6 py-4 whitespace-nowrap">{doctor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(doctor.email)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Calendar />
      </div>
    </section>
  );
};


export default Admin;