import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DoctorForm from './DoctorForm';

const AddDoctor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    specialite: '',
    role: 'docteur'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/doctor/createDoctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          password: formData.password,
          telephone: formData.telephone,
          specialite: formData.specialite
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.token);  // Stocke le token JWT
        toast.success("Médecin créé avec succès !");
        navigate('/hospital/admin');  // Redirige vers la page d'administration
      } else {
        toast.error(data.message || "Erreur lors de la création du docteur.");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <DoctorForm 
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AddDoctor;