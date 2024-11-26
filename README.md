
# VideoVerse

**VideoVerse** is an innovative platform designed to offer a seamless video-sharing experience with a focus on user interactivity, profile management, and a rich, dark-mode user interface. Built with modern technologies, it provides functionalities like user authentication, video uploads, comments, and much more.

## Links
- **Live Link:** https://video-verse-client.vercel.app/
- **Youtube Video:** https://youtu.be/vM6N0BOm1vY

## Photos 


![Screenshot 2024-11-26 150222](https://github.com/user-attachments/assets/be850e2c-92cc-4e47-8670-a87625c4df80)
![Screenshot 2024-11-26 150246](https://github.com/user-attachments/assets/625a4188-5d34-43e5-9c2f-da53ba7cb32f)
![Screenshot 2024-11-26 150258](https://github.com/user-attachments/assets/dec3ac89-588b-4ca0-aa69-0df35de13bc1)
![Screenshot 2024-11-26 150438](https://github.com/user-attachments/assets/4e43bb10-849f-43ab-8c29-976bb2f1bb58)
![Screenshot 2024-11-26 150427](https://github.com/user-attachments/assets/f2e782d9-fc17-4c3b-8510-ec161cf6ba5f)
![Screenshot 2024-11-26 150414](https://github.com/user-attachments/assets/046caf00-26f8-440d-9b56-83cf38690e6c)
![Screenshot 2024-11-26 150355](https://github.com/user-attachments/assets/86321571-d417-460c-865d-3a3d3a06e959)

## Features

- **User Authentication:** Register and login via username, email, or phone number.
- **Dark Mode:** The entire platform is styled with Tailwind CSS for a dark mode experience.
- **Video Uploads:** Upload videos with a smooth interface and track video data.
- **Profile Management:** Users can update their profiles, including avatars and cover images.
- **Comments:** Add, delete, or edit comments on videos.
- **Search:** Easily search for videos, users, and more.
- **Responsive Design:** The platform is fully responsive across devices.
- **File Handling:** Uploads are handled through Cloudinary and server-side file management.
- **Loading States:** Features such as form submissions display loading states for better user experience.

## Tech Stack

- **Frontend:**
  - React.js
  - Tailwind CSS
  - Axios
  - React Router DOM
  - React Toastify (for notifications)
  - React Context API (for user state management)
  - Vite (for fast development and build)

- **Backend:**
  - Node.js with Express.js
  - MongoDB (Database)
  - Cloudinary (Image and Video Storage)
  - JWT (for user authentication)
  - Formidable (for file uploads)


## Installation

Follow these steps to set up the project locally:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Utsav3110/VideoVerse.git
   ```

2. **Install Dependencies:**

   Navigate to the project directory and install dependencies for both frontend and backend.

   - For the frontend:

     ```bash
     cd VideoVerse/client
     npm install
     ```

   - For the backend:

     ```bash
     cd VideoVerse/server
     npm install
     ```

3. **Set Up Environment Variables:**

   Create a `.env` file in the `server` folder with the following variables:

   ```plaintext
   PORT = value

    CORS_ORIGIN = http://localhost:5173

    ACCESS_TOKEN_SECRET = value

    ACCESS_TOKEN_EXPIRY = 1d

    REFRESH_TOKEN_SECRET = value

    REFRESH_TOKEN_EXPIRY = value

    CLOUDINARY_CLOUD_NAME = value

    CLOUDINARY_API_KEY = value

    CLOUDINARY_API_SECRET = value

    MONGODB_URI = value

    NODE_ENV = "local"
   ```
    Create a `.env` file in the `client` folder with the following variables:

   ```plaintext
   VITE_API_URL = "http://localhost:8000/api/v1"
   ```

4. **Start the Development Servers:**

   - Frontend:

     ```bash
     cd VideoVerse/client
     npm run dev
     ```

   - Backend:

     ```bash
     cd VideoVerse/server
     npm run dev
     ```

   The frontend will be available at `http://localhost:5173`, and the backend will run on `http://localhost:8000`.

## Usage

- **User Registration:** Register with your username, email, or phone number, then verify your account with a password.
- **Video Uploading:** Upload and share videos directly on the platform.
- **Profile Customization:** Update your profile image, cover image, and password.
- **Comments:** Interact with videos by adding comments and liking posts.


## Contact

For any queries or support, reach out to me at [Utsav3110](https://github.com/Utsav3110).

