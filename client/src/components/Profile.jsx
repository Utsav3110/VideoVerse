import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContextProvider';
import axios from 'axios';
import { toast } from 'react-toastify';


const backendUrl = 'http://localhost:8000/api/v1';


axios.defaults.withCredentials = true;


const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);


  


  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleFileChange = (e, setter) => setter(e.target.files[0]);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

 
  const handleSaveChanges = async () => {
    try {
      if (passwordData.oldPassword && passwordData.newPassword) {
        await axios.post(`${backendUrl}/users/change-password`, passwordData, {
          withCredentials: true,
        });
        toast.success('Password updated successfully');
      }

      if (avatar) {
        const avatarData = new FormData();
        avatarData.append('avatar', avatar);
        await axios.patch(`${backendUrl}/users/change-avatar`, avatarData, {
          withCredentials: true,
        });
      }

      if (coverImage) {
        const coverData = new FormData();
        coverData.append('coverImage', coverImage);
        await axios.patch(`${backendUrl}/users/change-cover-image`, coverData, {
          withCredentials: true,
        });
      }

      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    }
  };




  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendUrl}/users/logout`,
        {}, // Request body (empty object)
        {
          withCredentials: true, // Make sure cookies are sent with the request
        }
      );
      toast.success('Logged out successfully');
      setUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  useEffect(() => {
  

    if (!user) {
      const response = axios.get(`/users/current-user`);

      if (response?.data?.success) {
        setUser(response.data.user);
      }
    }
  }, []);

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center ">
      <div className="profile-container dark:bg-gray-800 text-white flex flex-col items-center p-4 w-full space-y-6 mx-auto max-w-md">
        <div className="cover-image w-full h-40 bg-gray-700 relative rounded-lg overflow-hidden">
          {user?.coverImage && (
            <img
              src={user.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="avatar w-24 h-24 rounded-full overflow-hidden border-4 border-white -mt-12">
          {user?.avatar && (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="user-info text-center">
          <h2 className="text-2xl font-semibold">{user?.username}</h2>
          <p className="text-gray-400">{user?.fullName}</p>
        </div>

        {isEditing ? (
          <div className="edit-form w-full space-y-4">
            <div className="edit-password">
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Current Password"
                className="w-full p-2 bg-gray-800 text-white border rounded"
              />
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
                className="w-full p-2 bg-gray-800 text-white border rounded mt-2"
              />
            </div>

            <div className="edit-avatar">
              <label className="block text-sm font-medium text-gray-300">
                Update Avatar
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setAvatar)}
                className="mt-1"
              />
            </div>

            <div className="edit-cover-image">
              <label className="block text-sm font-medium text-gray-300">
                Update Cover Image
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setCoverImage)}
                className="mt-1"
              />
            </div>

            <button
              onClick={handleSaveChanges}
              className="w-full bg-green-500 text-white py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <button
            onClick={handleEditToggle}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Edit Profile
          </button>
        )}

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
