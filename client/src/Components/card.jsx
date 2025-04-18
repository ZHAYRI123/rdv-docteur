function Cards() {
  const cards = [
    {
      image: "../image/aiMedical.png",
      alt: "IA",
      text: "Discutez avec notre ia pour vous guider a prendre le meilleur rendez-vous en repondant a une serie de question",
      buttonText: "Discuter avec l'IA"
    },
    {
      image: "../image/rdv.png",
      alt: "Prendre rendez-vous",
      text: "Vous voulez prendre directement rendez-vous avec un medecin ?",
      buttonText: "Prendre rendez-vous"
    },
    {
      image: "../image/protection.png",
      alt: "Protection des Données",
      text: "La protection des données personnelles chez Basmah",
      buttonText: "Découvrir"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-12 -mt-32 relative z-10">
      <div className="flex flex-wrap justify-center gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 w-72 flex flex-col items-center text-center">
            <img src={card.image} alt={card.alt} className="w-24 h-24 mb-4 object-cover" />
            <p className="text-gray-700">{card.text}</p>
            <button className="mt-4 px-4 py-2 border-2 border-teal-500 text-teal-500 rounded-lg hover:bg-teal-500 hover:text-white transition-all duration-300">
              {card.buttonText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Cards;