# PDF-Blender

A powerful, full-stack PDF processing application built with React, Express, and Node.js. Process, merge, and manipulate PDF files with an intuitive web interface.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (automatically detected by setup script)
- **npm** 9+ (comes with Node.js)

### Installation & Running

The setup is **completely automated** - just run one command!

**macOS/Linux:**
```bash
./setup.sh
```

**Windows:**
```bash
setup.bat
```

### What the Setup Script Does
✅ Checks for Node.js & npm installation  
✅ Detects existing installations  
✅ Offers clean reinstall option  
✅ Creates `.env` file with defaults  
✅ Installs all npm dependencies (2-3 minutes)  
✅ Starts the development server automatically  

### Access the Application
Once setup is complete, the app will automatically open at:
```
http://localhost:5000
```

## 📁 Project Structure

```
.
├── client/                  # React frontend with Vite
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── components/      # Reusable React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities
│   │   └── index.css
│   ├── index.html
│   └── public/
├── server/                  # Express backend
│   ├── index.ts            # Main server entry point
│   ├── db.ts               # Database setup
│   ├── routes.ts           # API routes
│   ├── storage.ts          # File storage logic
│   ├── static.ts           # Static file serving
│   └── vite.ts             # Vite dev server setup
├── shared/                  # Shared code
│   ├── schema.ts           # Database schema
│   └── routes.ts           # API routes definition
├── setup.sh               # Automated setup (macOS/Linux)
├── setup.bat              # Automated setup (Windows)
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🛠 Available Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check TypeScript types
npm run check

# Push database schema (if using PostgreSQL)
npm run db:push

# Health check
curl http://localhost:5000/health
```

## ⚙️ Configuration

The app uses environment variables stored in `.env` file (automatically created by setup script).

**Default .env:**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pdf_blender
NODE_ENV=development
PORT=5000
```

### Customizing Configuration

Edit `.env` file to:
- Change the port: `PORT=3000`
- Set production mode: `NODE_ENV=production`
- Update database URL for PostgreSQL

## 🗄️ Database

### Without Database (Default)
The app works perfectly without a database! All PDF processing works, but file metadata won't be persisted.

### With PostgreSQL

1. **Install PostgreSQL:**
   ```bash
   # macOS
   brew install postgresql

   # Linux (Ubuntu/Debian)
   sudo apt-get install postgresql
   ```

2. **Create database:**
   ```bash
   createdb pdf_blender
   ```

3. **Update .env:**
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pdf_blender
   ```

4. **Push schema:**
   ```bash
   npm run db:push
   ```

## 🔧 Tech Stack

**Frontend:**
- React 18 - UI library
- Vite - Build tool
- TypeScript - Type safety
- Tailwind CSS - Styling
- Radix UI - Component library
- React Hook Form - Form management

**Backend:**
- Express.js - Web framework
- TypeScript - Type safety
- Drizzle ORM - Database ORM
- Multer - File uploads
- pdf-lib - PDF processing

**DevOps:**
- Node.js 18+ - Runtime
- npm - Package manager
- Vite - Dev server

## 📦 File Upload & PDF Processing

### Upload Files
- Drag and drop interface
- File size limit: 50MB
- Supported: PDF files

### Process PDFs
- Merge multiple PDFs
- Extract pages
- Add metadata
- Optimize file size

## 🔐 Security

- Environment variables for sensitive data
- File size limits prevent abuse
- Input validation on all routes
- No hardcoded credentials

## 🚢 Deployment

### Production Build
```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Run Production Server
```bash
npm start
```

### Deploy to Cloud

**Deploy to Heroku:**
```bash
heroku create your-app-name
git push heroku main
```

**Deploy to Vercel:**
```bash
vercel
```

## 🐛 Troubleshooting

### Port 5000 Already in Use
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use a different port
PORT=3000 npm run dev
```

### npm Packages Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- App works fine without database (graceful fallback)

### Hot Reload Not Working
```bash
# Clear browser cache and restart
npm run dev
# Then hard refresh in browser (Cmd+Shift+R on Mac)
```

## 📊 System Requirements

**Minimum:**
- Node.js 16.x
- npm 7.x
- 500MB free disk space
- 2GB RAM

**Recommended:**
- Node.js 20 LTS
- npm 10.x
- 1GB free disk space
- 4GB RAM

## 📚 Learning Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support & Issues

- **Bug Report**: Open an issue on GitHub
- **Feature Request**: Open an issue with [FEATURE] label
- **Questions**: Open an issue with [QUESTION] label

## 🎯 Roadmap

- [ ] Advanced PDF editing
- [ ] Batch processing
- [ ] PDF watermarking
- [ ] Document signing
- [ ] API authentication
- [ ] Web-based editor

## 🌟 Features

### Current
✅ PDF upload & download  
✅ Merge multiple PDFs  
✅ Extract pages  
✅ Responsive design  
✅ Dark/Light theme support  
✅ No database required (works without)  
✅ File storage support  

### Planned
🔄 Advanced PDF editing  
🔄 Batch operations  
🔄 Cloud storage integration  

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

**Setup Time:** ~3 minutes | **No configuration needed!** 🎉

Made with ❤️ by Shubham Singh
