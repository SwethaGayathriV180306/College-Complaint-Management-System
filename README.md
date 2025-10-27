Category	                  Technologies Used
Frontend	                  React.js, Vite, Tailwind CSS, Axios
Backend	                    Node.js, Express.js, Multer, JWT
Database	                  MongoDB (Mongoose ORM)
Authentication	            JWT-based login & role-based access control
Deployment	                (Optional) Render / Vercel / MongoDB Atlas

Clone the repository
git clone https://github.com/YOUR_USERNAME/ccms.git
cd ccms

Backend Setup
cd backend
npm install

Create a .env file inside backend/ with:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

start the backend server:
npm run dev

cd ../frontend
npm install
npm run dev
