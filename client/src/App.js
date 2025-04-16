/*import Login from './login.jsx';
import Acc from './Acc.jsx';
import Cards from './card.jsx';
import Features from './Features.jsx';
import Footer from './footer.jsx';
import Header from './Header.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
	return (
		<>
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route path='/hospital-login' element={<Login isHospital={true} />} />
					<Route path='/doctor-login' element={<Login isDoctor={true} />} />
					<Route path='/patient-login' element={<Login isDoctor={false} />} />
				</Routes>
			</BrowserRouter>
			<div className="bg-zinc-50">
      <Header />
      <main className="pt-20">
        <Acc />
        <Cards />
        <Features />
      </main>
      <Footer />
    </div>
			<Router>
				<Routes>
					<Route path='/Hopital' element={<HopitalPage />} />
				</Routes>
			</Router>
		</>


	);
}

export default App;*/

import './App.css';
import Login from '../Pages/login';
import Landing from './Pages/Landing';
import UpdateProfile from './Pages/UpdateProfile';
import Navbar from './Components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DoctorDashBoard from './Pages/DoctorDashBoard';
import PatientDashBoard from './Pages/PatientDashBoard';
function App() {
	return (
		<>
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route path='/' element={<Landing />} />
          			<Route path='/hospital-login' element={<Login isHospital={true} />} />
					<Route path='/doctor-login' element={<Login isDoctor={true} />} />
					<Route path='/patient-login' element={<Login isDoctor={false} />} />
					<Route path='/update-profile' element={<UpdateProfile />} />
					<Route path='/doctor-dashboard' element={<DoctorDashBoard />} />
					<Route path='/patient-dashboard/*' element={<PatientDashBoard />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}
	