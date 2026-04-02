[README.md](https://github.com/user-attachments/files/26431715/README.md)
# AI Chat-Based Doubt Solver for Students

A production-ready full-stack web application for students to get AI-powered answers to their academic doubts. Features a mesmerizing Three.js background, modern glassmorphism UI, real-time chat, Markdown rendering, and Syntax Highlighting.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Three.js (@react-three/fiber), Lucide Icons
- **Backend**: Node.js, Express.js
- **Database & Auth**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI API (GPT-3.5/4)

## Local Setup Instructions

### 1. Supabase Setup
1. Create a project on [Supabase](https://supabase.com).
2. Go to SQL Editor and run the SQL commands found in `supabase_setup.sql`.
3. Get your `Project URL` and `anon public key` from Settings > API.
4. Get your `service_role secret key` from Settings > API for the backend.

### 2. Environment Variables
You need to set up two `.env` files:

**`frontend/.env`**
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**`backend/.env`**
```
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

### 3. Running Locally
**Backend**
```bash
cd backend
npm install
node server.js
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Deployment Steps

### Frontend (Vercel / Netlify)
1. Push your code to GitHub.
2. Connect your repository to Vercel/Netlify.
3. Set the Root Directory to `frontend`.
4. Add the Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
5. Build Command: `npm run build`, Output Directory: `dist`.
6. Deploy!

### Backend (Render / Railway)
1. On Render, create a new "Web Service".
2. Connect your repository.
3. Set the Root Directory to `backend` (or use a `render.yaml` / configure build command `npm install` and start command `node server.js`).
4. Add the Environment Variables (`PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`).
5. Deploy!

### Post-Deployment
Make sure to update the API URL in `frontend/src/pages/Dashboard.jsx` (currently `http://localhost:5000`) to your deployed backend URL.
