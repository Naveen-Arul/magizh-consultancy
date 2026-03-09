# Contributing to MagizhHealDesk

Thank you for your interest in contributing to MagizhHealDesk! We welcome contributions from the community.

## 🎯 Ways to Contribute

1. **Report Bugs** - Found a bug? Let us know!
2. **Suggest Features** - Have an idea? Share it!
3. **Improve Documentation** - Help make our docs better
4. **Submit Code** - Fix bugs or add features
5. **Review Pull Requests** - Help review others' contributions

## 🚀 Getting Started

### 1. Fork the Repository

Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/magizh-consultancy.git
cd magizh-consultancy
```

### 3. Set Up Development Environment

Follow the installation instructions in [README.md](README.md).

### 4. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features (e.g., `feature/add-dashboard`)
- `fix/` - Bug fixes (e.g., `fix/billing-calculation`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/optimize-queries`)
- `test/` - Adding tests (e.g., `test/add-billing-tests`)

## 💻 Development Guidelines

### Code Style

#### Backend (JavaScript)
- Use ES6+ features (arrow functions, async/await, destructuring)
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Example:
  ```javascript
  /**
   * Calculate total bill amount with discount
   * @param {Array} items - Array of bill items
   * @param {Number} discount - Discount percentage (0-100)
   * @returns {Number} Total amount after discount
   */
  const calculateTotal = (items, discount) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return subtotal - (subtotal * discount / 100);
  };
  ```

#### Frontend (TypeScript + React)
- Use TypeScript for type safety
- Follow React best practices (hooks, functional components)
- Use proper typing for props and state
- Example:
  ```typescript
  interface StockItem {
    _id: string;
    name: string;
    quantity: number;
    expiry: string;
  }

  const StockTable: React.FC<{ items: StockItem[] }> = ({ items }) => {
    // Component logic
  };
  ```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Formatting, missing semicolons, etc.
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance tasks

Examples:
```bash
feat(chatbot): add table formatting for medicine lists
fix(billing): correct discount calculation logic
docs(readme): update deployment instructions
refactor(stock): optimize database query performance
```

### Testing

Before submitting:

1. **Test locally**:
   ```bash
   # Backend
   cd backend && npm start

   # Frontend
   cd frontend && npm run dev
   ```

2. **Check for errors**:
   - Test all affected features
   - Check browser console for errors
   - Verify API responses

3. **Test edge cases**:
   - Empty states
   - Invalid inputs
   - Network errors

## 📝 Pull Request Process

### 1. Update Documentation

If your changes affect:
- User-facing features → Update README.md
- API endpoints → Update API documentation section
- Deployment → Update DEPLOYMENT.md

### 2. Self-Review Checklist

Before submitting, ensure:
- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] No console errors or warnings
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] No sensitive data (API keys, passwords) in commits
- [ ] `.env` files are not committed

### 3. Create Pull Request

1. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Go to GitHub and create a Pull Request

3. Fill out the PR template with:
   - **Description**: What does this PR do?
   - **Motivation**: Why is this change needed?
   - **Testing**: How did you test it?
   - **Screenshots**: For UI changes

4. Link related issues: `Closes #123` or `Fixes #456`

### 4. Code Review

- Respond to feedback constructively
- Make requested changes promptly
- Push changes to the same branch (PR auto-updates)

### 5. Merge

Once approved:
- Maintainers will merge your PR
- Your contribution will be credited
- Branch will be deleted automatically

## 🐛 Reporting Bugs

### Before Reporting

1. **Search existing issues** - Maybe it's already reported
2. **Try latest version** - Bug might be fixed already
3. **Reproduce the bug** - Can you recreate it consistently?

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Node version: [e.g. 18.17.0]

**Additional context**
Any other context about the problem.
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Describe the problem you're trying to solve.

**Describe the solution you'd like**
Clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Mockups, examples, or related features.
```

## 📚 Documentation Contributions

Documentation improvements are always welcome:

- Fix typos and grammar
- Add code examples
- Clarify confusing sections
- Add troubleshooting tips
- Update outdated information

## 🔧 Development Tips

### Useful Commands

```bash
# Backend
npm run dev      # Start with hot reload
npm start        # Start production mode
node seed.js     # Seed database

# Frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Environment Setup

Always use environment files:
- `.env.local` - Local development (gitignored)
- `.env` - Production/shared config
- `.env.example` - Template (committed to git)

### Debugging

- Use `console.log()` for quick debugging
- Use browser DevTools Network tab for API issues
- Check MongoDB Atlas logs for database errors
- Use Vercel deployment logs for production issues

## 🤔 Questions?

- Open a [GitHub Discussion](https://github.com/Naveen-Arul/magizh-consultancy/discussions)
- Create an [Issue](https://github.com/Naveen-Arul/magizh-consultancy/issues)
- Comment on existing issues or PRs

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

**Positive behavior:**
- Being respectful and inclusive
- Accepting constructive criticism gracefully
- Focusing on what's best for the community

**Unacceptable behavior:**
- Harassment or discriminatory language
- Personal attacks or trolling
- Publishing others' private information

### Enforcement

Maintainers have the right to remove, edit, or reject contributions that don't align with this Code of Conduct.

## 🙏 Thank You!

Your contributions make MagizhHealDesk better for everyone. We appreciate your time and effort!

---

<div align="center">

**Happy Contributing! 🎉**

</div>
