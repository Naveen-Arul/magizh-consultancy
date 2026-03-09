import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Medicine from './models/Medicine.model.js';

dotenv.config();

const seedMedicines = [
  // Near Expiry Items (for dashboard alerts)
  {
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    category: 'Painkiller',
    manufacturer: 'PharmaCorp',
    price: 12,
    lowStockThreshold: 20,
    batches: [
      {
        batchNumber: 'PAR001',
        quantity: 50,
        expiryDate: new Date('2026-04-15'), // Near expiry
        purchasePrice: 10
      },
      {
        batchNumber: 'PAR002',
        quantity: 200,
        expiryDate: new Date('2026-12-01'), // Good stock
        purchasePrice: 10
      }
    ]
  },
  // Low Stock Item
  {
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    category: 'Antibiotic',
    manufacturer: 'MediLife',
    price: 45,
    lowStockThreshold: 15,
    batches: [
      {
        batchNumber: 'AMX001',
        quantity: 8, // Low stock
        expiryDate: new Date('2026-08-20'),
        purchasePrice: 38
      }
    ]
  },
  // Critical - Low Stock + Near Expiry
  {
    name: 'Cetirizine',
    genericName: 'Cetirizine HCl',
    category: 'Antihistamine',
    manufacturer: 'AllerCare',
    price: 8,
    lowStockThreshold: 10,
    batches: [
      {
        batchNumber: 'CET001',
        quantity: 3, // Low stock + Near expiry
        expiryDate: new Date('2026-03-05'),
        purchasePrice: 6
      }
    ]
  },
  // Low Stock + Near Expiry
  {
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    category: 'Antacid',
    manufacturer: 'GastroHealth',
    price: 30,
    lowStockThreshold: 20,
    batches: [
      {
        batchNumber: 'OME001',
        quantity: 15, // Low stock + Near expiry
        expiryDate: new Date('2026-05-01'),
        purchasePrice: 25
      }
    ]
  },
  // Good stock with multiple batches
  {
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    category: 'Painkiller',
    manufacturer: 'PharmaCorp',
    price: 18,
    lowStockThreshold: 15,
    batches: [
      {
        batchNumber: 'IBU001',
        quantity: 120,
        expiryDate: new Date('2027-01-10'),
        purchasePrice: 15
      },
      {
        batchNumber: 'IBU002',
        quantity: 60,
        expiryDate: new Date('2026-11-15'),
        purchasePrice: 15
      }
    ]
  },
  {
    name: 'Azithromycin',
    genericName: 'Azithromycin',
    category: 'Antibiotic',
    manufacturer: 'MediLife',
    price: 65,
    lowStockThreshold: 10,
    batches: [
      {
        batchNumber: 'AZI001',
        quantity: 35,
        expiryDate: new Date('2026-08-22'),
        purchasePrice: 55
      }
    ]
  },
  {
    name: 'Metformin',
    genericName: 'Metformin HCl',
    category: 'Other',
    manufacturer: 'DiabCare',
    price: 25,
    lowStockThreshold: 30,
    batches: [
      {
        batchNumber: 'MET001',
        quantity: 150,
        expiryDate: new Date('2027-03-15'),
        purchasePrice: 20
      }
    ]
  },
  {
    name: 'Pantoprazole',
    genericName: 'Pantoprazole',
    category: 'Antacid',
    manufacturer: 'GastroHealth',
    price: 35,
    lowStockThreshold: 20,
    batches: [
      {
        batchNumber: 'PAN001',
        quantity: 75,
        expiryDate: new Date('2026-10-12'),
        purchasePrice: 28
      }
    ]
  },
  {
    name: 'Dolo 650',
    genericName: 'Paracetamol 650mg',
    category: 'Painkiller',
    manufacturer: 'Micro Labs',
    price: 15,
    lowStockThreshold: 25,
    batches: [
      {
        batchNumber: 'DLO001',
        quantity: 180,
        expiryDate: new Date('2026-09-25'),
        purchasePrice: 12
      }
    ]
  },
  {
    name: 'Crocin Advance',
    genericName: 'Paracetamol 500mg',
    category: 'Painkiller',
    manufacturer: 'GSK',
    price: 10,
    lowStockThreshold: 25,
    batches: [
      {
        batchNumber: 'CRO001',
        quantity: 220,
        expiryDate: new Date('2027-02-18'),
        purchasePrice: 8
      }
    ]
  },
  {
    name: 'Vitamin D3',
    genericName: 'Cholecalciferol',
    category: 'Vitamin',
    manufacturer: 'NutriHealth',
    price: 22,
    lowStockThreshold: 25,
    batches: [
      {
        batchNumber: 'VD3001',
        quantity: 95,
        expiryDate: new Date('2027-06-30'),
        purchasePrice: 18
      }
    ]
  },
  {
    name: 'Vitamin B Complex',
    genericName: 'B-Complex Vitamins',
    category: 'Vitamin',
    manufacturer: 'NutriHealth',
    price: 28,
    lowStockThreshold: 20,
    batches: [
      {
        batchNumber: 'VBC001',
        quantity: 65,
        expiryDate: new Date('2027-04-20'),
        purchasePrice: 22
      }
    ]
  },
  {
    name: 'Calcium Tablets',
    genericName: 'Calcium Carbonate',
    category: 'Vitamin',
    manufacturer: 'BoneHealth',
    price: 32,
    lowStockThreshold: 20,
    batches: [
      {
        batchNumber: 'CAL001',
        quantity: 88,
        expiryDate: new Date('2027-05-15'),
        purchasePrice: 26
      }
    ]
  },
  {
    name: 'Cough Syrup',
    genericName: 'Dextromethorphan',
    category: 'Other',
    manufacturer: 'RespiCare',
    price: 85,
    lowStockThreshold: 15,
    batches: [
      {
        batchNumber: 'CGH001',
        quantity: 42,
        expiryDate: new Date('2026-07-30'),
        purchasePrice: 70
      }
    ]
  },
  {
    name: 'Ciprofloxacin',
    genericName: 'Ciprofloxacin',
    category: 'Antibiotic',
    manufacturer: 'MediLife',
    price: 55,
    lowStockThreshold: 15,
    batches: [
      {
        batchNumber: 'CIP001',
        quantity: 48,
        expiryDate: new Date('2026-11-08'),
        purchasePrice: 45
      }
    ]
  },
  {
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    category: 'Painkiller',
    manufacturer: 'CardioMed',
    price: 5,
    lowStockThreshold: 30,
    batches: [
      {
        batchNumber: 'ASP001',
        quantity: 250,
        expiryDate: new Date('2027-01-25'),
        purchasePrice: 4
      }
    ]
  },
  {
    name: 'Insulin Glargine',
    genericName: 'Insulin Glargine',
    category: 'Other',
    manufacturer: 'DiabCare',
    price: 850,
    lowStockThreshold: 5,
    batches: [
      {
        batchNumber: 'INS001',
        quantity: 12,
        expiryDate: new Date('2026-06-15'),
        purchasePrice: 750
      }
    ]
  },
  {
    name: 'Atorvastatin',
    genericName: 'Atorvastatin',
    category: 'Other',
    manufacturer: 'CardioMed',
    price: 68,
    lowStockThreshold: 20,
    batches: [
      {
        batchNumber: 'ATO001',
        quantity: 72,
        expiryDate: new Date('2026-12-20'),
        purchasePrice: 55
      }
    ]
  },
  {
    name: 'Levothyroxine',
    genericName: 'Levothyroxine Sodium',
    category: 'Other',
    manufacturer: 'ThyroHealth',
    price: 42,
    lowStockThreshold: 15,
    batches: [
      {
        batchNumber: 'LEV001',
        quantity: 55,
        expiryDate: new Date('2027-02-28'),
        purchasePrice: 35
      }
    ]
  },
  {
    name: 'Montelukast',
    genericName: 'Montelukast Sodium',
    category: 'Antihistamine',
    manufacturer: 'RespiCare',
    price: 95,
    lowStockThreshold: 10,
    batches: [
      {
        batchNumber: 'MON001',
        quantity: 38,
        expiryDate: new Date('2026-09-10'),
        purchasePrice: 80
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_ATLAS, {
      dbName: 'magizhHealDesk'
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    await Medicine.deleteMany({});
    console.log('🗑️  Cleared existing medicines');
    
    // Insert seed data
    await Medicine.insertMany(seedMedicines);
    console.log('✅ Successfully seeded medicines');
    
    mongoose.connection.close();
    console.log('👋 Database connection closed');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
