import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContextProvider';
import axios from 'axios';
import { toast } from 'react-toastify';

const backendUrl = 'http://localhost:8000/api/v1';

axios.defaults.withCredentials = true;

const Header = () => {
  const { user, userAuth, setUserAuth, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${backendUrl}/users/logout`);
     
      setUser(null);
      setUserAuth(false);
      navigate('/');
    } catch (error) {
      
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axios.post(`${backendUrl}/users/current-user`);
      if (response?.data?.success) {
        setUser(response.data.user);
        setUserAuth(true);
      }else{
        setUser(null);
        setUserAuth(false);
      }
    } catch (error) {
     
    }
  };

  useEffect(() => {
    getUserInfo();
    console.log(userAuth);
  }, []);

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
            >
              VideoApp
            </Link>
          </div>

          <div className="flex items-center space-x-5">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Browse Videos
            </Link>

            {userAuth ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/publish-video"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Upload Video
                </Link>
                <div className="relative group">
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-full"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-8 h-8 rounded-full ring-2 ring-gray-800"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center ring-2 ring-gray-800">
                        <span className="text-gray-200 text-sm">
                          {user.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </button>

                  {/* Optional: Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
