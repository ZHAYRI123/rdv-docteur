import React from 'react';
import ChatBot from './ia';

const IAPage = () => {
  return (
    <>
      <br />
      <br />
       <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <div className="text-center p-6 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-blue-600">Assistant Médical IA</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Décrivez vos symptômes et notre IA vous aidera à identifier la pathologie possible et la spécialité médicale appropriée.
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatBot />
      </div>
    </div>
    </>
  );
};

export default IAPage;