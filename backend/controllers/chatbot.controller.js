import Groq from 'groq-sdk';
import Medicine from '../models/Medicine.model.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Helper to get stock context for AI
const getStockContext = async () => {
  try {
    const medicines = await Medicine.find().sort({ name: 1 });
    
    const stockData = medicines.map(med => {
      const totalQty = med.batches.reduce((sum, batch) => sum + batch.quantity, 0);
      const nearestExpiry = med.batches.length > 0 
        ? med.batches.reduce((nearest, batch) => 
            batch.expiryDate < nearest ? batch.expiryDate : nearest, 
            med.batches[0].expiryDate
          )
        : null;
      
      const daysUntilExpiry = nearestExpiry 
        ? Math.ceil((new Date(nearestExpiry) - new Date()) / (1000 * 60 * 60 * 24))
        : null;
      
      return {
        name: med.name,
        genericName: med.genericName,
        category: med.category,
        manufacturer: med.manufacturer,
        price: med.price,
        totalQuantity: totalQty,
        isLowStock: med.isLowStock,
        nearestExpiry: nearestExpiry ? nearestExpiry.toISOString().split('T')[0] : 'N/A',
        daysUntilExpiry: daysUntilExpiry,
        isNearExpiry: daysUntilExpiry !== null && daysUntilExpiry <= 90,
        batches: med.batches.map(b => ({
          batch: b.batchNumber,
          quantity: b.quantity,
          expiry: b.expiryDate.toISOString().split('T')[0]
        }))
      };
    });
    
    return stockData;
  } catch (error) {
    console.error('Error fetching stock context:', error);
    return [];
  }
};

// Main chatbot query handler
export const queryChatbot = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get current stock data
    const stockData = await getStockContext();
    
    // Prepare context for Groq AI
    const systemPrompt = `You are a helpful pharmacy stock enquiry assistant for MagizhHealDesk pharmacy. 
Your job is to help pharmacy staff quickly check medicine availability, stock levels, and expiry information.

Current Stock Data (as of ${new Date().toISOString().split('T')[0]}):
${JSON.stringify(stockData, null, 2)}

Guidelines:
- Be concise and direct - staff are busy
- If asked about a medicine, provide: availability, quantity, batch info, and expiry status
- Flag low stock (<= 20 units) and near expiry (<= 90 days) items clearly with ⚠️ or 🔴 emojis
- If a medicine is not in stock, say so clearly
- For general queries (low stock, near expiry lists), provide organized summaries
- Always mention batch numbers and expiry dates when relevant
- Use bullet points for multiple items
- Include practical recommendations (reorder suggestions, urgency notes)

Example responses:
Q: "Is Paracetamol available?"
A: "✅ Paracetamol is available. Total: 250 units across 2 batches
   • Batch PAR001: 50 units, Expiry: 2026-04-15 ⚠️ (Near expiry)
   • Batch PAR002: 200 units, Expiry: 2026-12-01 (Good stock)"

Q: "Which medicines are low on stock?"
A: "🔴 Low Stock Medicines (≤20 units):
   • Amoxicillin: 8 units (Batch AMX001, Expiry: 2026-08-20) - Reorder urgently
   • Cetirizine: 3 units (Batch CET001, Expiry: 2026-03-05) - Critical!
   • Omeprazole: 15 units (Batch OME001, Expiry: 2026-05-01)
   
   Recommendation: Place immediate orders for top 2 medicines."`;

    // Call Groq AI
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3, // Lower temperature for more consistent, factual responses
      max_tokens: 1024,
      top_p: 0.9
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not process that query.';

    res.json({
      message: reply,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      error: 'Failed to process chatbot query', 
      message: error.message 
    });
  }
};

// Get chatbot statistics (optional)
export const getChatbotStats = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    
    const totalMedicines = medicines.length;
    const lowStockCount = medicines.filter(med => med.isLowStock).length;
    
    const sixtyDaysFromNow = new Date();
    sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 90);
    
    let nearExpiryCount = 0;
    medicines.forEach(med => {
      med.batches.forEach(batch => {
        if (batch.expiryDate <= sixtyDaysFromNow && batch.quantity > 0) {
          nearExpiryCount++;
        }
      });
    });
    
    res.json({
      totalMedicines,
      lowStockCount,
      nearExpiryCount,
      status: 'online'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats', message: error.message });
  }
};
