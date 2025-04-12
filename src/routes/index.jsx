import Cards from './card.jsx';
import Header from './Header.jsx';
import Footer from './footer.jsx';
import Features from './Features.jsx';
import Acc from './Acc.jsx';

function App() {
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