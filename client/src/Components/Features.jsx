import iaMed from "../image/aiMedical.png";
import rdv from "../image/rdv.png";
import protection from "../image/protection.png";


function Features() {
  const features = [
    {
      title: "Consultation assistée par IA",
      description: "Notre système d'intelligence artificielle vous guide à travers un processus personnalisé pour identifier vos besoins médicaux. En répondant à quelques questions simples, nous vous aidons à trouver le bon spécialiste et le meilleur créneau pour votre rendez-vous.",
      image: iaMed,
      buttonText: "Commencer la consultation",
      imagePosition: "left"
    },
    {
      title: "Prise de rendez-vous directe",
      description: "Accédez rapidement à notre réseau de professionnels de santé et prenez rendez-vous en quelques clics. Choisissez votre spécialiste, consultez ses disponibilités et réservez votre créneau instantanément.",
      image: rdv,
      buttonText: "Prendre rendez-vous",
      imagePosition: "right"
    },
    {
      title: "Vos Document de sante, toujours avec vous",
      description: "Chez Basmah, Conservez vos ordonnances, résultats d'examen et certificats dans un environnement sécurisé. Partagez-les en direct avec vos praticiens avant, pendant ou après vos rendez-vous médicaux.",
      image: protection,
      buttonText: "En savoir plus",
      imagePosition: "left"
    }
  ];

  return (
    <section className="py-16 bg-white">
      {features.map((feature, index) => (
        <div key={index} className="container mx-auto px-4 mb-16">
          <div className={`flex flex-col ${feature.imagePosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8`}>
            <div className="md:w-1/2">
              <img src={feature.image} alt={feature.title} className="rounded-lg shadow-lg w-64w" />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{feature.title}</h2>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <button className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                {feature.buttonText}
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default Features;