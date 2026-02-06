# 🌌 DreamSphere.ai  
**Your Digital Dream Space**

DreamSphere.ai is a modern full-stack web application designed to deliver a visually rich, interactive, and intelligent digital experience. It combines a sleek React frontend with a robust Node.js backend and secure integrations for authentication, data handling, and communication.

---

## 🚀 Features

- 🌙 Modern, responsive UI with dark mode support  
- ⚛️ React + TypeScript frontend (Vite)  
- 🎨 Tailwind CSS + shadcn/ui for clean design  
- 🔐 Authentication & protected routes  
- 🤖 AI-powered features (API-based)  
- 📩 Contact form with real email delivery  
- 🗄️ MongoDB database integration  
- 🔒 Secure environment variable handling  

---

## 🏗️ Tech Stack

### Frontend
- React (TypeScript)
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- Nodemailer
- CORS & dotenv

---

## 📂 Project Structure

```text
DreamSphere.ai/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── server.js
│
├── README.md
└── .gitignore
```

---

## ⚙️ Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB (local or Atlas)
- Git

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/DevKaushik007/DreamSphere.ai.git
cd DreamSphere.ai
```

---

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dreamsphere
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_app_password
```

Run backend:
```bash
npm run dev
```

---

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
```

Create `frontend/.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_public_key
```

Run frontend:
```bash
npm run dev
```

---

## 📩 Contact Form

Messages sent through the Contact page are delivered directly to the admin email using Nodemailer and Gmail App Password authentication.

---

## 🔒 Security Notes

- `.env` files are excluded via `.gitignore`
- Never commit credentials or secrets
- Frontend env variables must start with `VITE_`

---

## 🚀 Deployment

- Frontend: Vercel / Netlify / Lovable
- Backend: Render / Railway / VPS
- Database: MongoDB Atlas

---

## 👨‍💻 Author

**Dev Kaushik**  
GitHub: https://github.com/DevKaushik0007

---

## 📄 License

MIT License

---

✨ *DreamSphere.ai — where ideas meet imagination.*
