import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorForm from './DoctorForm';
import { Link } from 'react-router-dom';

const AddDoctor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialty: '',
    email: '',
    phone: '',
    startTime: '',
    endTime: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-gray-50">
      <Header />
      <main className="pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Ajouter un nouveau médecin
            </h1>
            <DoctorForm 
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          </div>
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
          <Link to="/src/routes" className="flex items-center gap-2">
            <img src="logo.png" alt="Basmah Logo" className="h-16 w-32" />
          </Link>
          <Link 
            to="/admin" 
            className="text-zinc-600 hover:text-blue-500 transition-colors"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default AddDoctor;