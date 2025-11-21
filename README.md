# 💬 Convo – Real-Time Chat Application

Convo is a full-stack real-time messaging application built using the **MERN** stack.  
It allows users to chat instantly, share images and videos, update profiles, check online/offline status, and manage their account securely using JWT authentication and cookies.

Powered by **Socket.io**, the chat is fast, reliable, and works in real time across multiple users.

---

## 🌍 Live Demos  

- **Frontend:** https://real-time-chat-app-1-5ked.onrender.com  
- **Backend API:** https://real-time-chat-app-e97l.onrender.com  
- **Full App Name:** Convo – Real-Time Chat App  

---

## ⭐ Highlights  

- ⚡ **Real-time chat** using Socket.io  
- 👤 **User Registration, Login, Logout**  
- 🔒 **JWT Authentication** with HTTP-only cookies  
- 📸 **Send Images & Videos**  
- 🟢 **Online / Offline Presence**  
- 📝 **Profile Info**  
  - Update name  
  - Update password  
  - Upload profile picture  
  - View account info (Member since, Account status)  
- 🗂️ **User List** showing all users except the current one  
- 💬 **Individual Conversation History**  
- 🧩 **Clean MVC architecture** with controllers and routes  
- 🔐 **Protected APIs** using `isAuthenticated` middleware  
- 🚫 **Centralized Error Handling** with catchAsync  
- ☁️ **Cloudinary Integration** for profile and chat media  
- 📦 **MongoDB + Mongoose** for database  
- ⚙️ **Fully typed folder structure & modular design**

---

## 🧰 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)

### Real-Time Engine
![Socket.io](https://img.shields.io/badge/Socket.io-010101?logo=socket.io&logoColor=white)

### Storage & Authentication
![Cloudinary](https://img.shields.io/badge/Cloudinary-FE5F9A?logo=cloudinary&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
![Bcrypt](https://img.shields.io/badge/Bcryptjs-F4B400?logoColor=white)

---

## ✨ Key Features

### 👤 User Features
- Register with name, email, password  
- Login using secure authentication  
- Logout with token removal  
- View profile data  
- Update name, email, password  
- Upload a profile picture  
- See **online / offline** indicator  
- See **member since**, **account status**  

---

### 💬 Chat Features
- Real-time one-to-one chat  
- Send text, images, and videos  
- View chat history  
- Only authenticated users can chat  
- Shows all users except yourself  
- Automatically logs out invalid tokens  
- Updates UI instantly when a new message arrives  

---

## 🗂️ Backend Routes Overview

### User Routes (`/api/v1/user`)

```javascript
router.post("/sign-up", signup);
router.post("/sign-in", signin);
router.get("/sign-out", isAuthenticated, signout);
router.get("/me", isAuthenticated, getUser);
router.put("/update-profile", isAuthenticated, updateProfile);
```

### Message Routes (`/api/v1/message`)
```javascript
router.get("/users", isAuthenticated, getAllUsers);
router.get("/:id", isAuthenticated, getMessages);
router.post("/send/:id", isAuthenticated, sendMessage);
```

---

## 🧩 Folder Structure

convo-chat-app/  
├── backend/  
│   ├── controllers/  
│   ├── models/  
│   ├── routes/  
│   ├── middlewares/    
│   ├── utils/  
│   └── server.js    
├── frontend/  
│   ├── src/  
│   ├── public/  
│   └── index.html  
└── README.md  


---
## ⚙️ Environment Variables (.env)

```bash
# Server
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGO_URI=<your-mongodb-uri>

# Cloudinary (for image/video uploads)
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# JWT / Authentication
JWT_SECRET_KEY=<your-secret-key>
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Optional: Socket / other secrets
SOCKET_SECRET_KEY=<optional-if-needed>
```

⸻

## 📦 Install Backend Dependencies
```bash
npm install bcryptjs cloudinary cookie-parser dotenv express express-fileupload jsonwebtoken mongoose socket.io cors
```

## 🚀 Run the project
### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### 🧑‍💻 Author

**Ritu Pagar**  
**Complete development**: Frontend + Backend + Socket.io + Cloudinary + Deployment

---

# 💬 Convo — A real-time chat platform built with speed, simplicity, and modern tech.
