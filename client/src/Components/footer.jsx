import { useNavigate } from 'react-router-dom';
 
function Footer() {
  const navigate = useNavigate();

  const handleServiceClick = (service) => {
    switch (service) {
      case "Prise de RDV":
      case "Documents Médicaux":
        navigate('/login/patient');
        break;
      case "Consultation IA":
        navigate('/login/patient', { 
          state: { redirectTo: '/ia' } 
        });
        break;
      default:
        break;
    }
  };
  const services = [
    { name: "Consultation IA", path: "#" },
    { name: "Prise de RDV", path: "/login/patient" },
    { name: "Documents Médicaux", path: "/login/patient" }
  ];
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-blue-500 mb-4">Basmah</h3>
            <p className="text-gray-400">Votre plateforme de confiance pour la prise de rendez-vous médicaux en ligne.</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              {["Accueil", "À propos", "Services", "Contact"].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleServiceClick(service.name)}
                    className="text-gray-400 hover:text-blue-500 transition-colors text-left"
                  >
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: basmahbouch@gmail.com</li>
              <li>Tél: +212 000000000</li>
              <li>Fes, Maroc</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Basmah. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;