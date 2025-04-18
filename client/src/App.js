import './App.css';
import Login from './Pages/login';
import Landing from './Pages/Landing';
import Navbar from './Components/Navbar';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Signup from './Pages/signup';
import Hopital from './Pages/Hopital/hopital';
import Admin from './Pages/Hopital/Admin';
import AddDoctor from './Pages/Hopital/AddDoctor';

// Create a NavbarWrapper component to conditionally render Navbar
const NavbarWrapper = () => {
  const location = useLocation();
  const showNavbar = ['/doctor-login', '/patient-login', '/hospital-login', '/signup'].includes(location.pathname);
  
  return showNavbar ? <Navbar /> : null;
};

function App() {
  return (
    <BrowserRouter>
      <NavbarWrapper />
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/hospital-login' element={<Login isHospital={true} />} />
        <Route path='/doctor-login' element={<Login isDoctor={true} />} />
        <Route path='/patient-login' element={<Login isDoctor={false} />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/hospital' element={<Hopital />} />
        <Route path='/hospital/admin' element={<Admin />} />
        <Route path='/hospital/admin/add-doctor' element={<AddDoctor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;