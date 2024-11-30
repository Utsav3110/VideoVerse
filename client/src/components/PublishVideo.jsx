import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Upload, X, Film, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const PublishVideo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  useEffect(() => {
    toast.info(
      "Due to Vercel's serverless deployment limitations, videos cannot exceed 5-10 seconds in duration or 2-3 MB in size",
      {
        autoClose: false, // Don't auto close the toast
        closeButton: true, // Show close button on the toast
      }
    );
  }, []);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const imageUrl = URL.createObjectURL(file);
      setThumbnailPreview(imageUrl);
    }
  };

  const clearVideo = () => {
    setVideoFile(null);
    setVideoPreview('');
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const clearThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview('');
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('videoFile', videoFile);
    formData.append('thumbnail', thumbnail);

    try {
      const response = await axios.post(
        `${backendUrl}/video/publish`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setMessage(response.data.message);
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      // Clear form after successful upload
      setTitle('');
      setDescription('');
      clearVideo();
      clearThumbnail();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error publishing video.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Publish Your Video
          </h1>
          <p className="mt-2 text-gray-400">
            Share your content with the world
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
              placeholder="Enter a catchy title"
              required
            />
          </div>

          {/* Description Input */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 min-h-[120px]"
              placeholder="Describe your video..."
              required
            ></textarea>
          </div>

          {/* Video Upload Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Video File
            </label>

            {!videoPreview ? (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8">
                <div className="text-center">
                  <Film className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-300">
                        Click to upload video
                      </span>
                      <input
                        id="video-upload"
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                        required
                      />
                      <span className="mt-2 block text-xs text-gray-500">
                        MP4, WebM, or OGG
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden">
                <video
                  src={videoPreview}
                  controls
                  className="w-full rounded-lg"
                ></video>
                <button
                  type="button"
                  onClick={clearVideo}
                  className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Thumbnail Upload Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Thumbnail
            </label>

            {!thumbnailPreview ? (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label
                      htmlFor="thumbnail-upload"
                      className="cursor-pointer"
                    >
                      <span className="mt-2 block text-sm font-medium text-gray-300">
                        Click to upload thumbnail
                      </span>
                      <input
                        id="thumbnail-upload"
                        ref={thumbnailInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                        required
                      />
                      <span className="mt-2 block text-xs text-gray-500">
                        PNG, JPG
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={clearThumbnail}
                  className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button and Message */}
          <div className="flex flex-col items-center space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Publish Video</span>
                </>
              )}
            </button>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.includes('Error')
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-green-500/20 text-green-400'
                } text-center`}
              >
                {message}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishVideo;
