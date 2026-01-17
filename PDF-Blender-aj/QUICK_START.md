# PDF-Blender - Quick Reference Card

## 🚀 ONE-COMMAND SETUP

### macOS/Linux
```bash
./setup.sh
```

### Windows
```bash
setup.bat
```

---

## 📊 What the Setup Script Does

| Step | Action | Time |
|------|--------|------|
| 1 | Checks Node.js & npm | < 1s |
| 2 | Detects existing installation | < 1s |
| 3 | Creates .env configuration | < 1s |
| 4 | Installs npm dependencies | 1-3 min |
| 5 | Verifies all packages | < 1s |
| 6 | Starts dev server | Instant |

---

## 🎯 Common Scenarios

### First Time?
```bash
./setup.sh
# Select 'N' when asked about reinstall
```

### Want Fresh Install?
```bash
./setup.sh
# Select 'Y' when asked about reinstall
```

### Just Start Server (No Setup)?
```bash
npm run dev
```

### Build for Production?
```bash
npm run build
npm start
```

---

## 🔍 File Locations

| What | Where |
|------|-------|
| Frontend Code | `client/src/` |
| Backend Code | `server/` |
| Environment Config | `.env` |
| Database Schema | `shared/schema.ts` |
| API Routes | `shared/routes.ts` |
| Package Config | `package.json` |

---

## 🌐 Access Points

| Resource | URL | Purpose |
|----------|-----|---------|
| Main App | http://localhost:5000 | Web Interface |
| Health Check | http://localhost:5000/health | API Status |
| API Base | http://localhost:5000/api | API Endpoints |

---

## 🔧 Troubleshooting

### "Port 5000 already in use"
```bash
# Kill existing process
lsof -ti:5000 | xargs kill -9
# Or use different port
PORT=3000 npm run dev
```

### "Database connection error"
- Keep `.env` with default PostgreSQL value
- Or install PostgreSQL locally
- App works fine without database

### "npm: command not found"
- Reinstall Node.js from https://nodejs.org/
- Must include npm during installation

---

## 📦 What's Included

✅ React 18 Frontend with Vite  
✅ Express.js Backend  
✅ TypeScript Support  
✅ Tailwind CSS Styling  
✅ PDF Processing (pdf-lib)  
✅ File Upload (Multer)  
✅ Database Ready (Drizzle ORM)  
✅ Hot Module Reloading  

---

## 💾 Production Deployment

```bash
# 1. Build
npm run build

# 2. Start production server
npm start

# Optional: Set environment to production
export NODE_ENV=production
```

---

## 🔗 Useful Links

- **Node.js**: https://nodejs.org/
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/
- **Express**: https://expressjs.com/
- **Tailwind**: https://tailwindcss.com/

---

**Generated**: January 17, 2026  
**Project**: PDF-Blender  
**Version**: 1.0.0
