# PDF-Blender - Quick Start Guide

## 🚀 Quick Setup

The easiest way to get started is to run the automated setup script:

```bash
./setup.sh
```

This script will:
- ✅ Check for required dependencies (Node.js, npm)
- ✅ Create/verify `.env` configuration file
- ✅ Install npm dependencies
- ✅ Start the development server on port 5000
- ✅ Handle reinstallation if needed

### First Time Setup
```bash
./setup.sh
```

### Subsequent Runs
```bash
./setup.sh
```

When prompted about existing installation, choose:
- **N** (default) - Keep existing setup and just start the server
- **Y** - Clean reinstall from scratch

## 📋 Manual Setup (Alternative)

If you prefer manual setup:

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the project root:
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pdf_blender
PORT=5000
NODE_ENV=development
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:5000**

## 🔧 Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run type checking
npm check

# Start production server
npm start

# Push database schema
npm run db:push
```

## 📁 Project Structure

```
PDF-Blender/
├── client/              # React frontend
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── components/
│   └── index.html
├── server/              # Express backend
│   ├── index.ts
│   ├── db.ts
│   ├── routes.ts
│   └── storage.ts
├── shared/              # Shared types & routes
│   ├── schema.ts
│   └── routes.ts
├── uploads/             # User uploaded files
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env                 # Environment variables
└── setup.sh             # Automated setup script
```

## 🔑 Key Features

- **Full-stack TypeScript**: Type-safe development across frontend and backend
- **React + Vite**: Fast development with HMR (Hot Module Replacement)
- **Express Server**: RESTful API backend
- **Drizzle ORM**: Database abstraction layer
- **PDF Processing**: pdf-lib for PDF manipulation
- **File Upload**: Multer for handling file uploads
- **Tailwind CSS**: Utility-first CSS framework
- **UI Components**: Radix UI components with beautiful design

## 🗄️ Database Setup

The app works without a database for basic functionality. To enable full features:

### Using PostgreSQL

1. Install PostgreSQL if you don't have it
2. Create a database:
   ```bash
   createdb pdf_blender
   ```

3. Update `.env` with your database URL:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/pdf_blender
   ```

4. Push the schema:
   ```bash
   npm run db:push
   ```

## 🌐 Accessing the Application

- **Development**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health
- **API Docs**: Check `/shared/routes.ts` for available endpoints

## 🐛 Troubleshooting

### Port 5000 already in use
```bash
# On macOS/Linux, kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use a different port
PORT=3000 npm run dev
```

### Database connection errors
- Make sure PostgreSQL is running
- Verify DATABASE_URL in `.env` is correct
- The app will work without a database for UI testing

### Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Vite HMR issues
- Clear browser cache (Cmd+Shift+R on macOS)
- Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again

## 📦 Deployment

### Production Build
```bash
npm run build
npm start
```

The build will be optimized and ready for deployment.

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Push and create a pull request

## 📝 License

MIT License - See LICENSE file for details

## 💡 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

**For support or issues, please check the project repository or create an issue.**
