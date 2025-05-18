import { Link } from "react-router-dom";
import logo from "../../image/logo.png";
const Hopital = () => {
  return (
    <div className="bg-blue-50">
      <Header />
      <main className="min-h-screen flex items-center justify-center px-4 pt-20">
        <LoginCard />
      </main>
      <Footer />
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
          <Link 
            to="/" 
            className="text-zinc-600 hover:text-blue-500 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </nav>
    </header>
  );
};

const LoginCard = () => {
  const accountTypes = [
    {
      title: "Administration",
      description: "Accédez aux fonctionnalités de gestion de l'hôpital",
      path: "/login/hospital",
      hoverColor: "blue"
    },
    {
      title: "Médecin",
      description: "Gérez vos rendez-vous et dossiers patients",
      path: "/login/doctor",
      hoverColor: "teal"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Espace Hôpital
        </h1>
        <p className="text-gray-600">
          Veuillez sélectionner votre type de compte
        </p>
      </div>

      <div className="space-y-4">
        {accountTypes.map((account, index) => (
          <Link to={account.path} className="block" key={index}>
            <div className={`border rounded-lg p-4 hover:border-${account.hoverColor}-500 hover:shadow-md transition-all duration-300`}>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {account.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {account.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Besoin d'aide ?{' '}
          <Link to="/contact" className="text-blue-500 hover:text-blue-600">
            Contactez-nous
          </Link>
        </p>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto py-4">
      <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
        <p>&copy; 2025 Basmah. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Hopital;