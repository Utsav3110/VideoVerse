import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContextProvider';
import { Upload, User, Image as ImageIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const Register = () => {

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    avatar: null,
    coverImage: null,
  });
  const [previews, setPreviews] = useState({
    avatar: null,
    coverImage: null,
  });
  const [loading, setLoading] = useState(false);

  const { setUser,userAuth,
    setUserAuth} = useContext(UserContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (file) {
      setFormData((prevData) => ({ ...prevData, [name]: file }));
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviews((prevPreviews) => ({
        ...prevPreviews,
        [name]: previewUrl,
      }));
    }
  };

  // Cleanup preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      if (previews.avatar) URL.revokeObjectURL(previews.avatar);
      if (previews.coverImage) URL.revokeObjectURL(previews.coverImage);
    };
  }, []);

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
        `${backendUrl}/users/register`,
        formDataToSubmit,
        { withCredentials: true }
      );

      if (response.data.success) {
        setUserAuth(true)
        toast.success(response.data.message);
        setFormData({
          fullName: '',
          email: '',
          username: '',
          password: '',
          avatar: null,
          coverImage: null,
        });
        setPreviews({
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-700/50">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">Create Account</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Avatar Preview and Upload */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-300">
                    Profile Picture
                  </label>
                  <div className="mb-3">
                    <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-700/50 border-2 border-purple-500/50">
                      {previews.avatar ? (
                        <img
                          src={previews.avatar}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      name="avatar"
                      onChange={handleFileChange}
                      className="hidden"
                      id="avatar-upload"
                      accept="image/*"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="flex items-center justify-center w-full px-4 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-800/50 transition duration-200"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      <span>{previews.avatar ? 'Change Avatar' : 'Choose Avatar'}</span>
                    </label>
                  </div>
                </div>

                {/* Cover Image Preview and Upload */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-300">
                    Cover Image
                  </label>
                  <div className="mb-3">
                    <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-700/50 border-2 border-purple-500/50">
                      {previews.coverImage ? (
                        <img
                          src={previews.coverImage}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      name="coverImage"
                      onChange={handleFileChange}
                      className="hidden"
                      id="cover-upload"
                      accept="image/*"
                    />
                    <label
                      htmlFor="cover-upload"
                      className="flex items-center justify-center w-full px-4 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-800/50 transition duration-200"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      <span>{previews.coverImage ? 'Change Cover Image' : 'Choose Cover Image'}</span>
                    </label>
                  </div>
                </div>

                {/* Text Input Fields */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-300">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    placeholder="johndoe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-200"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>
          <div className="mt-2 flex justify-center mb-5">
                  Already have an account ?{' '}  
                  <Link to="/login" className="mx-2 text-purple-400 hover:text-purple-300 transition duration-200">
                  Log in
                  </Link>
                </div>
        </div>
        
      </div>
    </div>
  );
};

export default Register;