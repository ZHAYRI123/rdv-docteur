import Cards from '../Components/card.jsx';
import Header from '../Components/Header.jsx';
import Footer from '../Components/footer.jsx';
import Features from '../Components/Features.jsx';
import Acc from '../Components/Acc.jsx';

function Landing() {
  return (
    <div className="bg-zinc-50">
      <Header />
      <main className="pt-20">
        <Acc />
        <Cards />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
export default Landing;