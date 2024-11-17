import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { UserContext } from '../context/UserContextProvider';

const Login = () => {

  const {setUser , navigate} = useContext(UserContext);
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { emailOrUsername, password } = formData;

    if (!emailOrUsername || !password) {
      setError('Both fields are required');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/login', {
        email: emailOrUsername,
        username: emailOrUsername,
        password,
      }, { withCredentials: true });

      if (response.data.success) {
        toast.success(response.data.message);
        setUser(response.data.loggedInUser)
        // Redirect to profile page or home page
        navigate('/profile')
        
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      toast.error(error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-center">Login</h2>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <label className="block mb-2">
          Email or Username
          <input
            type="text"
            name="emailOrUsername"
            value={formData.emailOrUsername}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </label>

        <label className="block mb-2">
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 text-center text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-600"
        >
          {loading ? 'Logging In...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
