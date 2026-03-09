# Changelog

All notable changes to MagizhHealDesk project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-09

### Added
- 🎉 Initial release of MagizhHealDesk Pharmacy Management System
- 📊 Stock Management with multi-batch tracking
- 💳 Billing System with auto-generated bill numbers
- 🤖 AI-powered Stock Enquiry Chatbot using Groq (Llama 3.1 8B Instant)
- 🔔 Low Stock alerts (threshold: 20 units)
- ⏰ Expiry tracking with categorization (Expired, Critical, Warning, Good)
- 🚨 Red blinking animation for expired medicines
- 📦 Separate Expired Items section for urgent action
- 📊 Markdown table rendering in chatbot responses
- 🎨 Full-screen chatbot UI with auto-scroll
- 🔄 Expiry-based sorting (most urgent first)
- 💾 MongoDB Atlas integration for data persistence
- 🌐 Vercel deployment configuration for both frontend and backend
- 🔐 Environment variable management (.env, .env.local)
- 📝 Comprehensive documentation (README, DEPLOYMENT, CONTRIBUTING)
- ⚖️ MIT License
- 🎨 Beautiful UI with TailwindCSS and Shadcn/ui components

### Features

#### Stock Management
- Add, edit, and delete medicines
- Multi-batch tracking per medicine
- Real-time stock quantity updates
- Automatic status categorization
- Visual indicators with emojis
- Low stock warnings
- Expiry date monitoring

#### Billing System
- Create bills with multiple medicines
- Automatic bill number generation (BILL{YYYYMMDD}{0001})
- Real-time price lookup from database
- Automatic stock deduction on billing
- Payment type selection (Cash/Card)
- Discount calculation
- Digital bill records with timestamps

#### AI Chatbot
- Natural language medicine queries
- Real-time stock availability checks
- Markdown-formatted responses
- Table-based medicine lists
- Status indicators (🔴, ⚠️, ✅)
- Expiry-based prioritization
- Context-aware recommendations

#### UI/UX
- Responsive design for all screen sizes
- Dark mode support (via Tailwind)
- Smooth animations and transitions
- Loading states
- Error handling with user-friendly messages
- Accessible components (ARIA labels)

### Technical Stack
- **Backend**: Node.js 18+, Express.js 4.18, MongoDB Atlas, Mongoose 8.0, Groq SDK
- **Frontend**: React 18.3, TypeScript 5.5, Vite 5.4, TailwindCSS 3.4, Shadcn/ui
- **AI**: Groq API with Llama 3.1 8B Instant model
- **Deployment**: Vercel serverless functions
- **Version Control**: Git + GitHub

### Security
- Environment variable protection (.gitignore)
- Separate .env.local for local development
- CORS configuration for API security
- MongoDB Atlas network security
- Groq API key protection
- Input validation on API endpoints

### Documentation
- Comprehensive README.md with badges
- Detailed deployment guide (DEPLOYMENT.md)
- Contributing guidelines (CONTRIBUTING.md)
- API documentation with examples
- Troubleshooting section
- Code of Conduct
- MIT License

### Infrastructure
- Vercel deployment ready (frontend + backend)
- MongoDB Atlas cloud database
- GitHub repository with CI/CD
- Automatic deployments on push
- Environment-based configuration

---

## [Unreleased]

### Planned
- Dashboard with analytics and charts
- Billing History page with search/filter
- Print/PDF functionality for bills
- User authentication system
- Role-based access control (Admin/Staff)
- Email notifications for expiry/low stock
- Supplier management
- Purchase order tracking
- Sales reports
- Barcode scanning integration
- Mobile app (React Native)

---

## Release Notes

### Version 1.0.0 - Initial Release

This is the first production-ready release of MagizhHealDesk. The system is fully functional with:
- Complete stock management
- Working billing system
- AI-powered chatbot
- Production deployment on Vercel
- Comprehensive documentation

**Target Audience**: Small to medium-sized pharmacies looking for a modern, digital inventory and billing solution.

**Known Limitations**:
- No user authentication (planned for v1.1.0)
- No print functionality (planned for v1.1.0)
- No dashboard analytics (planned for v1.2.0)

---

## Version History

- **v1.0.0** (2026-03-09) - Initial release with core features

---

## How to Update

To update to the latest version:

```bash
# Pull latest changes
git pull origin main

# Update backend dependencies
cd backend
npm install

# Update frontend dependencies
cd ../frontend
npm install

# Restart servers
```

For deployed versions on Vercel:
- Changes are deployed automatically on git push to main branch
- Manual redeploy: Vercel Dashboard → Deployments → Redeploy

---

## Feedback & Bug Reports

Found a bug or have a feature request?
- Open an [issue](https://github.com/Naveen-Arul/magizh-consultancy/issues)
- Start a [discussion](https://github.com/Naveen-Arul/magizh-consultancy/discussions)

---

**Legend:**
- `Added` - New features
- `Changed` - Changes to existing functionality
- `Deprecated` - Features that will be removed
- `Removed` - Features that were removed
- `Fixed` - Bug fixes
- `Security` - Security improvements
