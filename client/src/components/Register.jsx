import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContextProvider';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    avatar: null,
    coverImage: null,
  });
  const [loading, setLoading] = useState(false);

  const { setUser, navigate } = useContext(UserContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    setFormData((prevData) => ({ ...prevData, [name]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { fullName, email, username, password, avatar, coverImage } = formData;
    if (!fullName || !email || !username || !password || !avatar) {
      toast.error('All fields are required');
      setLoading(false);
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('fullName', fullName);
    formDataToSubmit.append('email', email);
    formDataToSubmit.append('username', username);
    formDataToSubmit.append('password', password);
    formDataToSubmit.append('avatar', avatar);
    if (coverImage) formDataToSubmit.append('coverImage', coverImage);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/users/register',
        formDataToSubmit,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          fullName: '',
          email: '',
          username: '',
          password: '',
          avatar: null,
          coverImage: null,
        });
        setUser(response.data.userCreated);
        navigate("/profile");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-md"
      >
        <h2 className="mb-6 text-2xl font-semibold text-center">Register</h2>

        <label className="block mb-2">
          Full Name
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </label>

        <label className="block mb-2">
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </label>

        <label className="block mb-2">
          Username
          <input
            type="text"
            name="username"
            value={formData.username}
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

        <label className="block mb-4">
          Avatar
          <input
            type="file"
            name="avatar"
            onChange={handleFileChange}
            className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </label>

        <label className="block mb-4">
          Cover Image
          <input
            type="file"
            name="coverImage"
            onChange={handleFileChange}
            className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 text-center text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-600"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
