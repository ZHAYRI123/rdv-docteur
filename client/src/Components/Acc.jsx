import backgImage from "../image/image.png";
import Hopital from "../Pages/Hopital/hopital";
import { Link } from "react-router-dom";
function Acc() {
  return (
    <section className="relative w-full h-screen">
      <div className="absolute inset-0">
        <img src={backgImage} className="w-full h-full object-cover" alt="Background" />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-2xl px-4">
          <h1 className="text-5xl font-bold text-white mb-6">Basmah</h1>
          <p className="text-white text-lg mb-8">
            Bienvenue sur Basmah, votre site de Prise de Rendez-vous en ligne.
            Choisissez votre rôle pour continuer.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/hospital"
              className="bg-blue-500 text-white font-bold py-3 px-8 rounded-md transition-colors"
            >
              Hopital
            </Link>
            <Link 
              to="/patient-login"
              className="bg-white text-blue-500 font-bold py-3 px-8 rounded-md transition-colors"
            >
              Patient
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Acc;