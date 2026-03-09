import express from 'express';
import {
  queryChatbot,
  getChatbotStats
} from '../controllers/chatbot.controller.js';

const router = express.Router();

// Chatbot query endpoint
router.post('/query', queryChatbot);

// Chatbot stats endpoint
router.get('/stats', getChatbotStats);

export default router;
