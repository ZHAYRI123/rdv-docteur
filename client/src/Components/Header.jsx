import logo from "../image/logo.png";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="fixed top-0 w-full bg-white shadow-lg z-50">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center gap-2">
            <img src={logo} alt="Basmah Logo" className="h-16 w-32" />
          </a>
          <div className="space-x-6">
            <Link to="/login/patient" className="text-zinc-900 hover:text-blue-500 transition-colors">
              Connection
            </Link>
            <Link to="/signup" className="text-zinc-900 hover:text-blue-500 transition-colors">
              Inscription
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;