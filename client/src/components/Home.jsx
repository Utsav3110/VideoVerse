import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-semibold">Welcome to VideoVerse</h1>
        <p className="text-lg">Choose an option to get started</p>
        <div className="space-x-6">
          <Link
            to="/login"
            className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
