import Groq from 'groq-sdk';
import Medicine from '../models/Medicine.model.js';

// Lazy initialization of Groq client to ensure env vars are loaded
let groq = null;
const getGroqClient = () => {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  return groq;
};

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
        batches: med.batches.map(b => {
          const batchDaysUntilExpiry = Math.ceil((new Date(b.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
          return {
            batch: b.batchNumber,
            quantity: b.quantity,
            expiry: b.expiryDate.toISOString().split('T')[0],
            daysUntilExpiry: batchDaysUntilExpiry,
            urgency: batchDaysUntilExpiry <= 0 ? 'EXPIRED' : 
                     batchDaysUntilExpiry <= 30 ? 'CRITICAL' : 
                     batchDaysUntilExpiry <= 90 ? 'WARNING' : 'GOOD'
          };
        }).sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry) // Sort batches by expiry (earliest first)
      };
    });
    
    // Sort medicines by nearest expiry date (most urgent first)
    stockData.sort((a, b) => {
      if (a.daysUntilExpiry === null) return 1;
      if (b.daysUntilExpiry === null) return -1;
      return a.daysUntilExpiry - b.daysUntilExpiry;
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

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not configured in environment variables');
      return res.status(500).json({ 
        error: 'AI service not configured', 
        message: 'Groq API key is missing' 
      });
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
- **ALWAYS use Markdown tables** for presenting medicine lists and stock data
- **ALWAYS sort medicines by expiry date** (earliest/most urgent first)
- **Segregate medicines by expiry urgency** when showing lists:
  - 🔴 **EXPIRED** or **CRITICAL** (0-30 days)
  - ⚠️ **WARNING** (31-90 days)
  - ✅ **GOOD** (>90 days)
- Use proper **Markdown formatting** for all responses
- Use **bold** for emphasis on medicine names and important info
- Use colored emojis for visual status indicators:
  - ✅ for available/good stock
  - ⚠️ for warnings (low stock or near expiry)
  - 🔴 for critical/expired
  - 📦 for stock information
  - ⏰ for expiry information
  - 💊 for medicine names
  - 🚨 for urgent action needed
- For medicine lists, use tables with columns: **Medicine | Quantity | Batch | Expiry Date | Days Left | Status**
- Include "Days Left" column showing countdown to expiry
- Flag low stock (<= 20 units) and near expiry (<= 90 days) items clearly
- If a medicine is not in stock, say so clearly
- Include practical recommendations with emoji bullets
- Keep responses organized with headers (###)

Example responses (using markdown tables with expiry sorting):

Q: "Show all medicines"
A: "📦 **Medicine Stock Overview** - Sorted by Expiry Date

### 🔴 Critical - Expiring Soon (0-30 days)

| Medicine | Quantity | Batch | Expiry Date | Days Left | Status |
|----------|----------|-------|-------------|-----------|--------|
| **Cetirizine** | 3 units | CET001 | 2026-03-10 | 1 day | 🔴 URGENT |
| **Ibuprofen** | 12 units | IBU001 | 2026-03-25 | 16 days | 🔴 Critical |

### ⚠️ Warning - Expiring in 31-90 days

| Medicine | Quantity | Batch | Expiry Date | Days Left | Status |
|----------|----------|-------|-------------|-----------|--------|
| **Paracetamol** | 50 units | PAR001 | 2026-04-15 | 37 days | ⚠️ Monitor |
| **Omeprazole** | 15 units | OME001 | 2026-05-01 | 53 days | ⚠️ Low Stock |

### ✅ Good Stock (>90 days)

| Medicine | Quantity | Batch | Expiry Date | Days Left | Status |
|----------|----------|-------|-------------|-----------|--------|
| **Amoxicillin** | 150 units | AMX002 | 2026-08-20 | 164 days | ✅ Good |
| **Paracetamol** | 200 units | PAR002 | 2026-12-01 | 267 days | ✅ Good |

### 📊 Summary
- 🚨 **Urgent Action**: 2 medicines expiring within 30 days
- ⚠️ **Monitor**: 2 medicines expiring in 31-90 days
- ✅ **Good**: 8 medicines with >90 days validity"

Q: "Which medicines are expiring soon?"
A: "⏰ **Expiry Alert** - Sorted by Most Urgent First

| Medicine | Quantity | Batch | Expiry Date | Days Left | Priority |
|----------|----------|-------|-------------|-----------|----------|
| **Cetirizine** | 3 units | CET001 | 2026-03-10 | 1 day | 🔴 URGENT |
| **Ibuprofen** | 12 units | IBU001 | 2026-03-25 | 16 days | 🔴 Critical |
| **Paracetamol** | 50 units | PAR001 | 2026-04-15 | 37 days | ⚠️ Warning |

### 🚨 Action Required
- Return **Cetirizine** to supplier immediately
- Offer discount on **Ibuprofen** to clear stock
- Monitor **Paracetamol** batch PAR001"`;

    // Call Groq AI with Llama 3.1 8B Instant (Fast GPT-like OSS model)
    const groqClient = getGroqClient();
    const completion = await groqClient.chat.completions.create({
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
      model: 'llama-3.1-8b-instant', // Fast GPT-compatible open-source model
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
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    res.status(500).json({ 
      error: 'Failed to process chatbot query', 
      message: error.message,
      details: error.response?.data?.error || 'Unknown error'
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
