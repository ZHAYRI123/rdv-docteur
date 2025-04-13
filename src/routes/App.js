import Login from './login.jsx';
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
		</>


	);
}

export default App;