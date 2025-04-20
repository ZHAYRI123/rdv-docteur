import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    sexe: ''
  });

  const calculateAge = (dateNaissance) => {
    if (!dateNaissance) return '';
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getJwtToken();
        if (!token) {
          toast.error('Session expirée, veuillez vous reconnecter');
          navigate('/login/patient');
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        // Format the date to YYYY-MM-DD for the input
        const formattedDate = data.dateNaissance ? 
          new Date(data.dateNaissance).toISOString().split('T')[0] : '';
        
        setFormData({
          nom: data.nom || '',
          prenom: data.prenom || '',
          email: data.email || '',
          telephone: data.telephone || '',
          dateNaissance: formattedDate,
          sexe: data.sexe || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Erreur lors du chargement du profil');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getJwtToken();
      if (!token) {
        toast.error('Session expirée, veuillez vous reconnecter');
        navigate('/login/patient');
        return;
      }

      const response = await fetch('http://localhost:5000/patient/updateProfile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour');
      }

      toast.success('Profil mis à jour avec succès');
      navigate('/patient-dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour du profil');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value || ''  // Ensure value is never undefined
    }));
  };

  function getJwtToken() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'jwtToken') return value;
    }
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      <Toaster />
      <h1 className="text-3xl font-bold mb-2">Informations du patient</h1>
      <p className="text-gray-600 mb-6">Vos informations personnelles.</p>

      {!isEditing ? (
        <>
          <div className="divide-y divide-gray-200">
            <div className="py-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Nom complet</h3>
              <p className="text-xl font-medium text-gray-900">
                {formData.prenom && formData.nom ? `${formData.prenom} ${formData.nom}` : 'Non renseigné'}
              </p>
            </div>
            <div className="py-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Adresse e-mail</h3>
              <p className="text-xl font-medium text-gray-900">
                {formData.email || 'Non renseigné'}
              </p>
            </div>
            <div className="py-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Âge</h3>
              <p className="text-xl font-medium text-gray-900">
                {calculateAge(formData.dateNaissance) ? `${calculateAge(formData.dateNaissance)} ans` : 'Non renseigné'}
              </p>
            </div>
            <div className="py-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Téléphone</h3>
              <p className="text-xl font-medium text-gray-900">
                {formData.telephone || 'Non renseigné'}
              </p>
            </div>
            <div className="py-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Sexe</h3>
              <p className="text-xl font-medium text-gray-900">
                {formData.sexe || 'Non renseigné'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-8 w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium text-lg"
          >
            Modifier le profil
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="text"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700">Date de naissance</label>
            <input
              type="date"
              id="dateNaissance"
              name="dateNaissance"
              value={formData.dateNaissance}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="sexe" className="block text-sm font-medium text-gray-700">Sexe</label>
            <select
              id="sexe"
              name="sexe"
              value={formData.sexe}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Sélectionnez</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Mettre à jour
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateProfile;
