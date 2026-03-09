# MagizhHealDesk - Pharmacy Management System

A comprehensive pharmacy management system with billing, inventory management, and stock enquiry features.

## 🚀 Features

- **Billing Management**: Digital bill generation with auto-price lookup and stock deduction
- **Stock Management**: Multi-batch inventory tracking with expiry alerts
- **Stock Enquiry Chatbot**: AI-powered assistant for quick medicine availability checks
- **Low Stock Alerts**: Real-time notifications for medicines running low
- **Expiry Tracking**: Automatic alerts for medicines nearing expiry

## 📁 Project Structure

```
consultancy-pro/
├── backend/          # Express.js + MongoDB backend
├── frontend/         # React + TypeScript frontend
└── README.md         # This file
```

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB (Atlas)
- Mongoose ODM
- CORS

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- Shadcn/ui Components
- React Router
- TanStack Query

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/Naveen-Arul/magizh-consultancy.git
cd magizh-consultancy
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file from example
cp .env.example .env

# Edit .env and add your MongoDB connection string
# MONGO_ATLAS=your_mongodb_connection_string_here
# PORT=5000
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install

# Create .env file from example
cp .env.example .env

# Edit .env if needed (default API URL is http://localhost:5000/api)
# VITE_API_URL=http://localhost:5000/api
```

4. **Seed Database (Optional)**
```bash
cd ../backend
node seed.js
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📚 API Endpoints

### Stock Management
- `GET /api/stock` - Get all medicines
- `GET /api/stock?flat=true` - Get flattened batch view
- `POST /api/stock` - Add new medicine/batch
- `PUT /api/stock/:id` - Update medicine/batch
- `DELETE /api/stock/:id` - Delete medicine/batch
- `GET /api/stock/low-stock` - Get low stock medicines
- `GET /api/stock/near-expiry` - Get near expiry medicines

### Billing
- `GET /api/billing` - Get all bills
- `POST /api/billing` - Create new bill
- `GET /api/billing/:id` - Get bill by ID
- `PUT /api/billing/:id/status` - Update bill status
- `DELETE /api/billing/:id` - Delete bill

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use environment variables for sensitive data
- MongoDB connection strings contain credentials
- Frontend `.env` files are also excluded from git

## 👥 Team

**MagizhHealDesk Team**

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, please open an issue in the GitHub repository.
