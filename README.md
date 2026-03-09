# 💊 MagizhHealDesk - Pharmacy Management System
Option 2: Add Billing History Page 📋 High Value
Currently you can create bills but can't view them. I can add:

Bills list with search/filter functionality
View bill details
Bill status management
Date range filtering
Export/Print functionality
Option 3: Create Dashboard Page 📊 Visual Impact
Add an analytics dashboard with:

Total sales & revenue charts
Low stock alerts summary
Near expiry medicines overview
Top-selling medicines
Recent billing activity
Option 4: Add Print/PDF Bills 🖨️ Business Critical
Enable printing and PDF export for bills:

Professional bill format
Print functionality
Download as PDF
Include pharmacy branding
<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.3.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.5.3-blue.svg)

A comprehensive, production-ready pharmacy management system with AI-powered features for billing, inventory management, and intelligent stock enquiry.

[Live Demo](#-live-demo) • [Features](#-features) • [Installation](#-installation) • [API Docs](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## 🌟 Overview

MagizhHealDesk is a modern, full-stack pharmacy management solution designed to streamline operations with real-time inventory tracking, automated billing, and AI-powered stock enquiry assistance.

## ✨ Features

### 📊 **Stock Management**
- Multi-batch inventory tracking with automatic expiry date monitoring
- Real-time low stock alerts (threshold-based notifications)
- Batch-wise quantity management
- Automatic expiry status categorization (Expired, Critical, Warning, Good)
- Visual status indicators with red blinking animation for expired items
- Separate expired items section for urgent action

### 💳 **Billing System**
- Automated bill generation with unique bill numbers
- Real-time medicine price lookup from database
- Auto-generated bill numbers with date format (BILL{YYYYMMDD}{0001})
- Automatic stock deduction on billing
- Payment type selection (Cash/Card)
- Discount calculation support
- Digital bill records with timestamp

### 🤖 **AI-Powered Stock Enquiry Chatbot**
- Powered by **Groq AI** (Llama 3.1 8B Instant model)
- Real-time medicine availability checks
- Natural language queries (e.g., "Is Paracetamol available?")
- Intelligent responses with markdown table formatting
- Expiry-based sorting (most urgent first)
- Status indicators with emojis (🔴 Critical, ⚠️ Warning, ✅ Good)
- Context-aware recommendations

### 🔔 **Smart Alerts**
- Low stock warnings (≤20 units)
- Expiry alerts with time-based categorization:
  - 🚨 **Expired** (≤0 days) - Red blinking
  - 🔴 **Critical** (1-30 days)
  - ⚠️ **Warning** (31-90 days)
  - ✅ **Good** (>90 days)
- Visual pulse animations for urgent items

## �️ Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 4.18
- **Database**: MongoDB Atlas with Mongoose ODM
- **AI Integration**: Groq SDK (Llama 3.1 8B Instant)
- **Authentication**: CORS-enabled API
- **Environment**: dotenv for configuration

### Frontend
- **Framework**: React 18.3 + TypeScript 5.5
- **Build Tool**: Vite 5.4
- **Styling**: TailwindCSS 3.4
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Routing**: React Router v6
- **Data Fetching**: TanStack Query (React Query)
- **Markdown Rendering**: react-markdown + remark-gfm
- **Icons**: Lucide React

### DevOps & Deployment
- **Hosting**: Vercel (Frontend + Backend serverless)
- **Version Control**: Git + GitHub
- **CI/CD**: Vercel automatic deployments
- **Environment Management**: .env files with .env.local override

## 📁 Project Structure

```
consultancy-pro/
├── backend/
│   ├── controllers/     # Business logic
│   │   ├── billing.controller.js
│   │   ├── stock.controller.js
│   │   └── chatbot.controller.js
│   ├── models/          # MongoDB schemas
│   │   ├── Billing.model.js
│   │   └── Medicine.model.js
│   ├── routes/          # API endpoints
│   │   ├── billing.routes.js
│   │   ├── stock.routes.js
│   │   └── chatbot.routes.js
│   ├── .env             # Environment variables (gitignored)
│   ├── .env.example     # Template for environment setup
│   ├── .gitignore       # Git exclusions
│   ├── vercel.json      # Vercel deployment config
│   ├── package.json     # Dependencies and scripts
│   └── server.js        # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   │   ├── ui/      # Shadcn/ui components
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/       # Route components
│   │   │   ├── Index.tsx
│   │   │   ├── Stock.tsx
│   │   │   ├── Billing.tsx
│   │   │   ├── Chatbot.tsx
│   │   │   └── About.tsx
│   │   ├── lib/         # Utilities
│   │   ├── hooks/       # Custom React hooks
│   │   ├── App.tsx      # Main app component
│   │   └── main.tsx     # React entry point
│   ├── public/          # Static assets
│   ├── .env             # Production API URL
│   ├── .env.local       # Local dev API URL (gitignored)
│   ├── .env.example     # Template
│   ├── vercel.json      # Vercel deployment config
│   ├── vite.config.ts   # Vite configuration
│   └── package.json     # Dependencies and scripts
│
├── DEPLOYMENT.md        # Detailed deployment guide
├── README.md            # This file
└── .gitignore           # Root git exclusions
```

## 📦 Installation

### Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** or **yarn** package manager
- **MongoDB Atlas** account (free tier works)
- **Groq API Key** ([Get free key](https://console.groq.com))
- **Git** for version control

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/Naveen-Arul/magizh-consultancy.git
cd magizh-consultancy
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
```

Edit `backend/.env` with your credentials:
```env
MONGO_ATLAS=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
GROQ_API_KEY=gsk_your_groq_api_key_here
PORT=5000
NODE_ENV=development
```

#### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create environment files
cp .env.example .env
cp .env.example .env.local
```

Edit `frontend/.env.local` for local development:
```env
VITE_API_URL=http://localhost:5000/api
```

#### 4. Seed Database (Optional but Recommended)
```bash
cd ../backend
node seed.js
```
This populates the database with sample medicines for testing.

#### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Server runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend runs on http://localhost:5173

#### 6. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## 🌐 Live Demo

- **Frontend**: https://magizhHealDesk-frontend.vercel.app
- **Backend API**: https://magizh-consultancy.vercel.app
- **API Health**: https://magizh-consultancy.vercel.app/api/health

---

## 📚 API Documentation

### Base URL
- **Local**: `http://localhost:5000/api`
- **Production**: `https://magizh-consultancy.vercel.app/api`

### Stock Management Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/stock` | Get all medicines with batches | - |
| `GET` | `/stock?flat=true` | Get flattened batch view | - |
| `POST` | `/stock` | Add new medicine/batch | `{name, quantity, expiry, batch, price, genericName, category, manufacturer}` |
| `PUT` | `/stock/:id` | Update medicine/batch | `{name, quantity, expiry, batch}` |
| `DELETE` | `/stock/:id` | Delete medicine/batch | - |
| `GET` | `/stock/low-stock` | Get medicines with ≤20 units | - |
| `GET` | `/stock/near-expiry` | Get medicines expiring ≤90 days | - |

### Billing Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/billing` | Get all bills | - |
| `POST` | `/billing` | Create new bill | `{items: [{medicineId, quantity, batchId}], paymentType, discount}` |
| `GET` | `/billing/:id` | Get bill by ID | - |
| `PUT` | `/billing/:id/status` | Update bill status | `{status: "paid" | "pending" | "cancelled"}` |
| `DELETE` | `/billing/:id` | Delete bill | - |

### Chatbot Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/chatbot/query` | Query AI assistant | `{message: "Is Paracetamol available?"}` |
| `GET` | `/chatbot/stats` | Get chatbot statistics | - |

### Response Format

**Success Response:**
```json
{
  "message": "Success message",
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "details": "Additional context"
}
```

---

## � Deployment

### Vercel Deployment (Recommended)

Both frontend and backend are configured for **Vercel serverless deployment**.

#### Quick Deploy Steps:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy Backend**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Set **Root Directory** to `backend`
   - Add environment variables: `MONGO_ATLAS`, `GROQ_API_KEY`, `NODE_ENV=production`
   - Deploy

3. **Deploy Frontend**:
   - Import same repository again
   - Set **Root Directory** to `frontend`
   - Add environment variable: `VITE_API_URL=https://your-backend.vercel.app/api`
   - Deploy

📖 **Detailed Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions, troubleshooting, and configuration details.

---

## 🔒 Security & Best Practices

### Environment Variables
- ✅ All sensitive data stored in `.env` files
- ✅ `.env` files are gitignored (never committed)
- ✅ `.env.example` templates provided for setup
- ✅ Separate `.env.local` for local development overrides

### API Security
- ✅ CORS configured for trusted origins
- ✅ MongoDB credentials protected
- ✅ Groq API key secured in environment variables
- ✅ Input validation on API endpoints
- ✅ Error messages sanitized (no sensitive data leaked)

### Database Security
- ✅ MongoDB Atlas with IP whitelisting
- ✅ Mongoose schema validation
- ✅ Connection string encryption

### Recommendations
- 🔐 Use strong MongoDB passwords
- 🔐 Rotate API keys periodically
- 🔐 Enable MongoDB Atlas network access restrictions
- 🔐 Review and audit CORS origins regularly

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **MongoDB Connection Failed**
```
❌ MongoDB connection error: MongoNetworkError
```
**Solutions**:
- Verify `MONGO_ATLAS` connection string in `.env`
- Check MongoDB Atlas network access (whitelist your IP or use `0.0.0.0/0`)
- Ensure database user has read/write permissions
- Check internet connectivity

#### 2. **Groq API Key Invalid**
```
❌ Groq API error: Invalid API key
```
**Solutions**:
- Verify `GROQ_API_KEY` in `backend/.env`
- Get new key from [console.groq.com](https://console.groq.com)
- Restart backend server after updating `.env`

#### 3. **Frontend Can't Connect to Backend**
```
❌ Network Error: Failed to fetch
```
**Solutions**:
- Check `VITE_API_URL` in `frontend/.env.local`
- Ensure backend server is running on correct port
- Verify CORS configuration in `backend/server.js`
- Clear browser cache and restart dev server

#### 4. **Build Errors on Deployment**
```
❌ Error: Cannot find module
```
**Solutions**:
- Run `npm install` in both frontend and backend
- Check `package.json` for missing dependencies
- Verify Node.js version compatibility (v18+)
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

#### 5. **Port Already in Use**
```
❌ Error: listen EADDRINUSE: address already in use :::5000
```
**Solutions**:
- Change port in `backend/.env`: `PORT=5001`
- Kill existing process: `npx kill-port 5000`
- Find and terminate process manually (Windows Task Manager / Linux `lsof`)

---

## 📊 Features Roadmap

### Completed ✅
- [x] Stock Management with batch tracking
- [x] Billing system with auto-generation
- [x] AI-powered chatbot with Groq integration
- [x] Low stock and expiry alerts
- [x] Expiry-based sorting and categorization
- [x] Blinking animation for expired items
- [x] Markdown table rendering in chatbot
- [x] Vercel deployment configuration

### In Progress 🚧
- [ ] Dashboard with analytics and charts
- [ ] Billing History page with search/filter
- [ ] Print/PDF functionality for bills
- [ ] User authentication system
- [ ] Role-based access control (Admin/Staff)

### Planned 🔮
- [ ] Supplier management
- [ ] Purchase order tracking
- [ ] Sales reports and analytics
- [ ] Barcode scanning integration
- [ ] Email notifications for expiry/low stock
- [ ] Mobile app (React Native)
- [ ] Multi-pharmacy support
- [ ] Advanced AI features (demand forecasting)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute
1. 🐛 **Report Bugs**: Open an issue with reproduction steps
2. 💡 **Suggest Features**: Share your ideas in discussions
3. 📝 **Improve Documentation**: Fix typos, add examples
4. 💻 **Submit Code**: Fork, branch, code, test, PR

### Development Workflow
```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/magizh-consultancy.git

# 2. Create feature branch
git checkout -b feature/amazing-feature

# 3. Make changes and commit
git commit -m "feat: add amazing feature"

# 4. Push to your fork
git push origin feature/amazing-feature

# 5. Open Pull Request
```

### Contribution Guidelines
- Follow existing code style and conventions
- Write clear commit messages (use [Conventional Commits](https://www.conventionalcommits.org/))
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 👥 Team

**MagizhHealDesk Development Team**
- Project Lead: Naveen Arul
- Repository: [github.com/Naveen-Arul/magizh-consultancy](https://github.com/Naveen-Arul/magizh-consultancy)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - Free to use, modify, and distribute with attribution.
```

---

## 🙏 Acknowledgments

- **Groq** - For providing fast AI inference with Llama 3.1
- **MongoDB Atlas** - For reliable cloud database hosting
- **Vercel** - For seamless serverless deployment
- **Shadcn/ui** - For beautiful, accessible UI components
- **React Community** - For amazing tools and ecosystem

---

## 📞 Support

Need help? Have questions?

- 📧 **Email**: [Create an issue](https://github.com/Naveen-Arul/magizh-consultancy/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Naveen-Arul/magizh-consultancy/discussions)
- 📖 **Documentation**: Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by MagizhHealDesk Team

</div>

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, please open an issue in the GitHub repository.
