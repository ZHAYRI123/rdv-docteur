import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const SpecialityManagement = () => {
  const [specialities, setSpecialities] = useState([]);
  const [newSpeciality, setNewSpeciality] = useState({ nom: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSpecialities();
  }, []);

  const fetchSpecialities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/specialite/getAllSpecialites', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSpecialities(data);
      } else {
        toast.error('Erreur lors du chargement des spécialités');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/specialite/createSpecialite', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        
        body: JSON.stringify(newSpeciality)
      });
      if (response.ok) {
        toast.success('Spécialité ajoutée avec succès');
        setNewSpeciality({ nom: '', description: '' });
        fetchSpecialities();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Erreur lors de la création');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette spécialité ?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/specialite/deleteSpecialite/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          toast.success('Spécialité supprimée avec succès');
          fetchSpecialities();
        } else {
          toast.error('Erreur lors de la suppression');
        }
      } catch (error) {
        toast.error('Erreur de connexion au serveur');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Gestion des Spécialités</h2>

      {/* Form for adding new speciality */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la spécialité
            </label>
            <input
              type="text"
              value={newSpeciality.nom}
              onChange={(e) => setNewSpeciality({...newSpeciality, nom: e.target.value})}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={newSpeciality.description}
              onChange={(e) => setNewSpeciality({...newSpeciality, description: e.target.value})}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Ajouter la spécialité
        </button>
      </form>

      {/* Specialities list */}
      {loading ? (
        <div className="text-center">Chargement...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {specialities.map((speciality) => (
                <tr key={speciality._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{speciality.nom}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{speciality.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(speciality._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SpecialityManagement;