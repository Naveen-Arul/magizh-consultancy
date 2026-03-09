import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import stockRoutes from './routes/stock.routes.js';
import billingRoutes from './routes/billing.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Verify environment variables
if (!process.env.GROQ_API_KEY) {
  console.warn('⚠️ GROQ_API_KEY not found - chatbot will not work');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGO_ATLAS, {
  dbName: 'magizhHealDesk'
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/stock', stockRoutes);
app.use('/api/medicines', stockRoutes); // Alias for billing page
app.use('/api/billing', billingRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
