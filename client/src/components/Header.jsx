import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContextProvider';
import axios from 'axios';
import { User } from 'lucide-react';


const backendUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const Header = () => {
  const { user, userAuth, setUserAuth, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(`${backendUrl}/users/logout`);
      setUser(null);
      setUserAuth(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axios.post(`${backendUrl}/users/current-user`);
      if (response?.data?.success) {
        setUser(response.data.user);
        setUserAuth(true);
      } else {
        setUser(null);
        setUserAuth(false);
      }
    } catch (error) {
      console.error('Failed to fetch user info', error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
            VideoVerse
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-5">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              Browse Videos
            </Link>
            {userAuth ? (
              <>
                <Link to="/subscriptions" className="text-gray-300 hover:text-white transition-colors">
                  Subscriptions
                </Link>
                <Link to="/publish-video" className="text-gray-300 hover:text-white transition-colors">
                  Upload Video
                </Link>
                {/* Profile Section */}
                <div className="relative group">
                  <button
                    onClick={() => navigate('/profile')}
                    className="focus:outline-none flex items-center"
                  >
                    {user?.avatar ?(
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-8 h-8 rounded-full ring-2 ring-gray-800"
                      />
                    ): (
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center ring-2 ring-gray-800">
                        <span className="text-gray-200 text-sm">
                          <User />
                        </span>
                      </div>
                    )}
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
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
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-300 hover:text-white focus:outline-none">
              {/* Hamburger Icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <div className="md:hidden">
            <Link to="/" className="block px-4 py-2 text-gray-300 hover:text-white">
              Browse Videos
            </Link>
            {userAuth ? (
              <>
                <Link to="/subscriptions" className="block px-4 py-2 text-gray-300 hover:text-white">
                  Subscriptions
                </Link>
                <Link to="/publish-video" className="block px-4 py-2 bg-blue-600 text-white rounded-md mx-4">
                  Upload Video
                </Link>
                <Link to="/profile" className="block px-4 py-2 text-gray-300 hover:text-white">
                  Your Profile
                </Link>
                <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-gray-300 hover:text-white">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-gray-300 hover:text-white">
                  Login
                </Link>
                <Link to="/register" className="block px-4 py-2 text-gray-300 hover:text-white">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
