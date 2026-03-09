# 🚀 Quick Start Guide

Get up and running with MagizhHealDesk in 5 minutes!

## Prerequisites Checklist

Before you begin, make sure you have:
- [ ] Node.js v18+ installed ([Download](https://nodejs.org))
- [ ] Git installed ([Download](https://git-scm.com))
- [ ] MongoDB Atlas account ([Sign up free](https://www.mongodb.com/cloud/atlas))
- [ ] Groq API key ([Get free key](https://console.groq.com))
- [ ] Code editor (VS Code recommended)

---

## 1. Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/Naveen-Arul/magizh-consultancy.git
cd magizh-consultancy

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 2. Configure Environment (2 minutes)

### Backend Configuration

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGO_ATLAS=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
GROQ_API_KEY=gsk_your_api_key_here
PORT=5000
NODE_ENV=development
```

### Frontend Configuration

```bash
cd ../frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 3. Seed Database (Optional - 30 seconds)

```bash
cd backend
node seed.js
```

This adds sample medicines for testing.

---

## 4. Start Servers (1 minute)

Open **TWO terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Server running at http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ App running at http://localhost:5173

---

## 5. Access the App

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **API Health Check**: http://localhost:5000/api/health

---

## 🎯 Test the Features

### Stock Management
1. Go to **Stock** page
2. Add a new medicine
3. Check low stock and expiry alerts

### Billing
1. Go to **Billing** page
2. Create a new bill
3. Select medicines and quantities
4. Check automatic price calculation

### AI Chatbot
1. Go to **Chatbot** page
2. Ask: "Show all medicines"
3. Try: "Which medicines are expiring soon?"
4. See markdown table responses!

---

## 🐛 Common Issues

### "MongoDB connection error"
- Check your `MONGO_ATLAS` connection string
- Whitelist your IP in MongoDB Atlas (Network Access)

### "Groq API error"
- Verify `GROQ_API_KEY` is correct
- Get new key from [console.groq.com](https://console.groq.com)

### "Port already in use"
- Change port in `backend/.env`: `PORT=5001`
- Or kill the process: `npx kill-port 5000`

### "Cannot connect to backend"
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `frontend/.env.local`

---

## 📚 Next Steps

- Read [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

---

## 🎉 You're Ready!

Your local development environment is set up and running!

**Happy coding!** 🚀

---

## Quick Commands Reference

```bash
# Backend
cd backend
npm run dev      # Start with hot reload
npm start        # Start production mode
node seed.js     # Seed database

# Frontend
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production

# Git
git status       # Check status
git add .        # Stage changes
git commit -m "message"  # Commit
git push         # Push to remote
```
