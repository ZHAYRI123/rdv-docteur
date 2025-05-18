import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PaperAirplaneIcon,
  UserIcon,
  CpuChipIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/solid';

const ChatBot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          symptoms: input  // Match the SymptomInput model in main.py
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur réseau');
      }

      const data = await response.json();
      
      // Create a formatted response using the data from backend
      const botMessage = { 
        text: data.response, // Use the generated response from backend
        sender: 'bot',
        details: {
          disease: data.Maladie,
          specialty: data.specialite
        }
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Erreur :', error);
      setMessages((prev) => [
        ...prev,
        { 
          text: 'Désolé, je ne peux pas traiter votre demande pour le moment. Veuillez réessayer.', 
          sender: 'bot' 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Scroll en bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Gestion dark mode sur body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderMessage = (message, index) => (
    <div
      key={index}
      className={`flex items-start ${
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.sender === 'bot' && (
        <div className="flex-shrink-0 w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-2">
          <CpuChipIcon className="w-5 h-5" />
        </div>
      )}
      <div
        className={`p-3 rounded-lg max-w-[75%] shadow ${
          message.sender === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-white dark:bg-gray-800'
        }`}
      >
        <div>{message.text}</div>
        {message.details && (
          <div className="mt-2 space-y-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <div>Pathologie : {message.details.disease}</div>
              <div>Spécialité : {message.details.specialty}</div>
            </div>
            <Link
              to="/patient-dashboard"
            state={{ 
              specialty: message.details.specialty,
              disease: message.details.disease 
            }}
            className="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
          >
            Prendre rendez-vous
          </Link>
          </div>
        )}
      </div>
      {message.sender === 'user' && (
        <div className="flex-shrink-0 w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center ml-2">
          <UserIcon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
  

 return (
  <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
    {/* Header */}
    <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
      <h1 className="text-xl font-bold text-blue-600">Assistant Médical IA</h1>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
      >
        {darkMode ? (
          <SunIcon className="w-5 h-5 text-yellow-400" />
        ) : (
          <MoonIcon className="w-5 h-5 text-gray-700" />
        )}
      </button>
    </div>

    {messages.length === 0 ? (
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 text-center">
        <h2 className="text-2xl font-semibold text-blue-600">Bienvenue 👋</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Décrivez vos symptômes et notre IA médicale vous aidera.
        </p>
        <form onSubmit={handleSubmit} className="flex w-full max-w-xl gap-2">
          <input
            type="text"
            className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none"
            placeholder="Décrivez vos symptômes..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
          </button>
        </form>
      </div>
    ) : (
      <>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => renderMessage(message, index))}

          {loading && (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-blue-500"></div>
              <span className="text-sm">Assistant Médical réfléchit...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <input
            type="text"
            className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none"
            placeholder="Écrivez un message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className={`ml-2 p-3 text-white rounded-full transition ${
              loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
          </button>
        </form>
      </>
    )}
  </div>
  );
};

export default ChatBot;
