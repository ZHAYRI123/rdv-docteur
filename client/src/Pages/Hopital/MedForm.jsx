import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const DoctorForm = ({ formData, handleChange, handleSubmit }) => {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
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
        setSpecialties(data);
      } else {
        toast.error('Erreur lors du chargement des spécialités');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Personal Information */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Informations personnelles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Spécialité
          </label>
          <select
            name="specialite"
            value={formData.specialite}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez une spécialité</option>
            {loading ? (
              <option disabled>Chargement des spécialités...</option>
            ) : (
              specialties.map(specialty => (
                <option key={specialty._id} value={specialty._id}>
                  {specialty.nom}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Informations de contact
        </h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Work Hours */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Horaires de travail
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heure de début
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heure de fin
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => navigate('/hospital/admin')}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
        >
          Ajouter le médecin
        </button>
      </div>
    </form>
  );
};

export default DoctorForm;