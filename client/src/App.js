import './App.css';
import Login from './Pages/login';
import Landing from './Pages/Landing';
import Navbar from './Components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Pages/signup';
import Hopital from './Pages/Hopital/hopital';
import Admin from './Pages/Hopital/Admin';
import AddDoctor from './Pages/Hopital/AddDoctor';
import DoctorDashboard from './Pages/Doctor/Doctor';
import PatientDashBoard from './Pages/PatientDashboard';

const NavbarWrapper = () => {
  const showNavbar = ['/login/hospital', '/login/doctor', '/login/patient', '/signup'];

  return showNavbar ? <Navbar /> : null;
};

function App() {
  return (
    <BrowserRouter>
      <NavbarWrapper />
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login/hospital' element={<Login userType="hospital" />} />
        <Route path='/login/doctor' element={<Login userType="doctor" />} />
        <Route path='/login/patient' element={<Login userType="patient" />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/hospital' element={<Hopital />} />
        <Route path='/hospital/admin' element={<Admin />} />
        <Route path='/hospital/admin/add-doctor' element={<AddDoctor />} />
        <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
        <Route path='/patient-dashboard/*' element={<PatientDashBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
