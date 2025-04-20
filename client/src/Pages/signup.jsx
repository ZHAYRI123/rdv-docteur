import login from "../image/login.png";
import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Signup = () => {
  const [showpassword, setshowpassword] = useState(false);
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [sexe, setSexe] = useState('');
  // const navigator = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();

    if (email === '' || password === ''|| prenom === ''|| nom === ''|| sexe === ''|| telephone === ''|| dateNaissance === '') {
      toast.error('Merci de remplir tous les champs');
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email');
      return;
    }
    if (password.length < 6) {
      toast.error('Mot de passe trop court (6 caractères minimum)');
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(password)) {
      toast.error('Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial');
      return;
    }

    const signupData = {
      id: crypto.randomUUID(), // ou laisse le backend générer l’ID
      nom,
      prenom,
      email,
      telephone: Number(telephone),
      password,
      date_naissance: dateNaissance,
      sexe,
      role: "patient"
    };

    try {
      const response = await fetch('http://localhost:5000/patient/addPatient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });
      
      if (response.status === 400) {
        toast.error('Email déjà utilisé !');
        return;
      } else if (response.status === 500) {
        toast.error('Internal server error');
        return;
      } else {
        toast.success('Account created successfully!');
        const data = await response.json();
        document.cookie = `jwtToken=${data.token}; expires=${new Date(new Date().getTime() + 3600000).toUTCString()}; path=/`;
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isDoctor', false);
        //setTimeout(() => navigator('/update-profile'), 2000);
      }
    } catch (error) {
      console.log(error);
      toast.error('Internal server error');
    }
  };

  const handleShowPassword = () => {
    setshowpassword(!showpassword);
  };

  return (
    <>
      <Toaster />
      <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-24 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <img className='mx-auto h-20 w-auto' src={login} alt='login_image' />
          <h2 className='mt-1 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
            Patient inscription
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white border border-gray-300 rounded-xl shadow-lg p-6">
        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form className='space-y-6' onSubmit={handleSignup}>

            {/* Prénom */}
            <div>
              <label htmlFor='prenom' className='block text-sm font-medium leading-6 text-gray-900'>
                  Prénom
              </label>
              <div className='mt-2'>
              <input
                id='prenom'
                name='prenom'
                type='text'
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
                placeholder='Prénom'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2'
              />
            </div>
          </div>

            {/* Nom */}
            <div>
              <label htmlFor='nom' className='block text-sm font-medium leading-6 text-gray-900'>
                Nom
              </label>
              <div className='mt-2'>
                <input
                  id='nom'
                  name='nom'
                  type='text'
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                  placeholder='Nom'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2'
                />
              </div>
            </div>

            {/* Sexe */}
            <div>
              <label htmlFor='sexe' className='block text-sm font-medium leading-6 text-gray-900'>
                Sexe
              </label>
            <div className='mt-2'>
              <select
                id='sexe'
                name='sexe'
                value={sexe}
                onChange={(e) => setSexe(e.target.value)}
                required
                className='block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm'
              >
                <option value=''>Sélectionner</option>
                <option value='Homme'>Homme</option>
                <option value='Femme'>Femme</option>
              </select>
            </div>
          </div>

            {/* Téléphone */}
            <div>
              <label htmlFor='telephone' className='block text-sm font-medium leading-6 text-gray-900'>
                Téléphone
              </label>
              <div className='mt-2'>
                <input
                  id='telephone'
                  name='telephone'
                  type='tel'
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                  placeholder='Téléphone'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2'
                />
              </div>
            </div>

            {/* Date de naissance */}
           <div>
              <label htmlFor='dateNaissance' className='block text-sm font-medium leading-6 text-gray-900'>
                Date de naissance
              </label>
            <div className='mt-2'>
              <input
                id='dateNaissance'
                name='dateNaissance'
                type='date'
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                required
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2'
              />
            </div>
          </div>

          <div>
              <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                Addresse email
              </label>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  value={email} // Ajout de value
                  onChange={(e) => setEmail(e.target.value)} // Ajout de onChange
                  autoComplete='email'
                  required
                  placeholder='Email'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2'
                />
              </div>
            </div>
            
            <div>
              <label htmlFor='password' className='block text-sm font-medium leading-6 text-gray-900'>
                Mot de passe
              </label>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  type={showpassword ? 'text' : 'password'}
                  value={password} // Ajout de value
                  onChange={(e) => setPassword(e.target.value)} // Ajout de onChange
                  autoComplete='new-password'
                  required
                  placeholder='Password'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2'
                />
              </div>
            </div>

            <div className='mt-2 flex items-center'>
              <input
                id='showPassword'
                name='showPassword'
                type='checkbox'
                checked={showpassword}
                onChange={handleShowPassword}
                className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
              />
              <label htmlFor='showPassword' className='ml-2 block text-sm text-gray-900'>
                Afficher le mot de passe
              </label>
            </div>

            <div>
              <button
                type='submit'
                className='flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                S'inscrire
              </button>
            </div>
          </form>

          <p className='mt-10 text-center text-sm text-gray-500'>
            Vous avez déjà un compte?{' '}
            <a href='/login/patient' className='font-semibold leading-6 text-green-600 hover:text-green-500'>
              Se connecter
            </a>
          </p>
        </div>
      </div>
      </div>
    </>
  );
};

export default Signup;