# 🚀 Deployment Guide

## 📦 What to Deploy Where

### **Frontend (Netlify)**
- **Folder**: `client/dist` (after building)
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

### **Backend (Render)**
- **Folder**: `server/`
- **Build Command**: `npm install`
- **Start Command**: `node index.js`

---

## 🌐 Frontend Deployment (Netlify)

### **Option 1: Drag & Drop (Easiest)**

1. **Build the frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Go to Netlify:**
   - Visit [netlify.com](https://netlify.com)
   - Sign up/Login
   - Click "Add new site" → "Deploy manually"

3. **Drag the `dist` folder** from `client/dist` to Netlify

4. **Set Environment Variable:**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com`
   - Redeploy the site

### **Option 2: Connect to GitHub**

1. Push your code to GitHub
2. In Netlify: "Add new site" → "Import from Git"
3. Select your repository
4. **Build settings:**
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
5. **Environment variables:**
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com`

---

## 🖥️ Backend Deployment (Render)

### **Steps:**

1. **Push to GitHub** (if not already done):
   ```bash
   cd d:/Card
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/card-scanner.git
   git push -u origin main
   ```

2. **Go to Render:**
   - Visit [render.com](https://render.com)
   - Sign up/Login
   - Click "New +" → "Web Service"

3. **Connect Repository:**
   - Connect your GitHub account
   - Select your repository
   - Click "Connect"

4. **Configure Service:**
   - **Name**: `card-scanner-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: `Free`

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable":
   ```
   GOOGLE_SHEET_ID=1THB9P8baetK2lCaQtY4FvnWyBcvq421G1rol0-cydH0
   GOOGLE_CREDENTIALS={"type":"service_account",...}
   PORT=5000
   ```
   (Copy from your `server/.env` file)

6. **Deploy!**
   - Click "Create Web Service"
   - Wait for deployment (~5 minutes)
   - Copy your backend URL (e.g., `https://card-scanner-api.onrender.com`)

7. **Update Frontend:**
   - Go back to Netlify
   - Update `VITE_API_URL` to your Render backend URL
   - Redeploy

---

## ✅ Quick Deployment Checklist

### **Before Deploying:**
- [ ] Build frontend: `cd client && npm run build`
- [ ] Test locally: Both frontend and backend working
- [ ] Have Google Sheets credentials ready
- [ ] Create GitHub repository (for Render deployment)

### **Frontend (Netlify):**
- [ ] Deploy `client/dist` folder
- [ ] Set `VITE_API_URL` environment variable
- [ ] Test the deployed site

### **Backend (Render):**
- [ ] Connect GitHub repository
- [ ] Set root directory to `server`
- [ ] Add all environment variables (GOOGLE_SHEET_ID, GOOGLE_CREDENTIALS, PORT)
- [ ] Deploy and copy the URL
- [ ] Update frontend with backend URL

### **Final Steps:**
- [ ] Update Netlify with Render backend URL
- [ ] Test the full flow: Upload card → Check Google Sheet
- [ ] Share your app! 🎉

---

## 🔧 Troubleshooting

### **Frontend can't connect to backend:**
- Check `VITE_API_URL` is set correctly in Netlify
- Make sure backend URL includes `https://`
- Check CORS is enabled in backend (already done)

### **Backend deployment fails:**
- Check all environment variables are set
- Make sure `GOOGLE_CREDENTIALS` is on ONE line
- Check build logs in Render dashboard

### **Google Sheets not working:**
- Verify service account email has access to the sheet
- Check `GOOGLE_SHEET_ID` is correct
- Ensure `GOOGLE_CREDENTIALS` JSON is valid

---

## 📝 Important Notes

⚠️ **Free Tier Limitations:**
- **Render**: Backend sleeps after 15 min of inactivity (takes ~30s to wake up)
- **Netlify**: 100GB bandwidth/month, 300 build minutes/month

💡 **Tip**: For production, consider upgrading to paid tiers for better performance!

---

## 🎉 You're Done!

Your app is now live and accessible from anywhere! Share the Netlify URL with others to use your Visiting Card Scanner! 🚀
