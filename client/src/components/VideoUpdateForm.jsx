import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Upload, Edit2, Save } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VideoUpdateForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { videoId } = useParams();

  const backendUrl = import.meta.env.VITE_API_URL;
  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    if (thumbnail) formData.append('thumbnail', thumbnail);

    try {
      const response = await axios.patch(`${backendUrl}/video/${videoId}`, formData);
      const data = response.data;

      if (data.success) {
        toast.success('Video updated successfully');
        setTitle('');
        setDescription('');
        setThumbnail(null);
      } else {
        toast.error(data.message || 'Error updating video');
      }
    } catch (error) {
      toast.error('Error updating video');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-lg text-gray-200 sm:w-full">
      <h2 className="text-3xl font-extrabold mb-6 text-white text-center">Update Video</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">
            Title
          </label>
          <div className="mt-2 relative">
            <Edit2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              id="title"
              className="pl-12 pr-4 py-2 w-full rounded-md bg-gray-700 border border-gray-600 text-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter new title"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">
            Description
          </label>
          <div className="mt-2 relative">
            <Edit2 className="absolute left-4 top-3 text-gray-500" size={20} />
            <textarea
              id="description"
              rows="4"
              className="pl-12 pr-4 py-2 w-full rounded-md bg-gray-700 border border-gray-600 text-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter new description"
            ></textarea>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-300">
            Thumbnail
          </label>
          <div className="mt-2 flex flex-col sm:flex-row items-center gap-4">
            <label
              htmlFor="thumbnail"
              className="cursor-pointer bg-gray-700 py-2 px-4 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Upload className="inline-block mr-2" size={18} />
              Choose File
            </label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              className="hidden"
              onChange={(e) => setThumbnail(e.target.files[0])}
            />
            {thumbnail && <span className="text-sm text-gray-400 truncate">{thumbnail.name}</span>}
          </div>
        </div>

        <button
          type="submit"
          className={`w-full flex justify-center py-3 px-4 rounded-md text-white font-medium bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${isLoading && 'opacity-75 cursor-not-allowed'}`}
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : (
            <>
              <Save className="mr-2" size={20} />
              Update Video
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default VideoUpdateForm;
