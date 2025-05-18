import aiMed from "../image/aiMedical.png";
import rdv from "../image/rdv.png";
import protection from "../image/protection.png";
import { useNavigate } from "react-router-dom";

function Cards() {
  const navigate = useNavigate();

  const handleButtonClick = (buttonText) => {
    switch (buttonText) {
      case "Prendre rendez-vous":
      case "Accéder à mes documents":
        navigate('/login/patient');
        break;
      case "Detection de symptome":
         navigate('/login/patient', { 
          state: { redirectTo: '/ia' } 
        });
        break;
      default:
        break;
    }
  };
  const cards = [
    {
      image: aiMed,
      alt: "IA",
      text: "Discutez avec notre ia pour vous aider à détecter vos symptômes de manière rapide et efficace et vous guider a prendre le meilleur rdv.",
      buttonText: "Detection de symptome"
    },
    {
      image: rdv,
      alt: "Prendre rendez-vous",
      text: "Vous voulez prendre directement rendez-vous avec un medecin ?",
      buttonText: "Prendre rendez-vous"
    },
    {
      image: protection,
      alt: "Protection des Données",
      text: "La protection des données personnelles chez Basmah",
      buttonText: "Accéder à mes documents"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-12 -mt-32 relative z-10">
      <div className="flex flex-wrap justify-center gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 w-72 flex flex-col items-center text-center">
            <img src={card.image} alt={card.alt} className="w-24 h-24 mb-4 object-cover" />
            <p className="text-gray-700">{card.text}</p>
            <button 
              onClick={() => handleButtonClick(card.buttonText)}
              className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              {card.buttonText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Cards;