# CNER Lab - Vercel Deployment Guide

This project is now configured for deployment on Vercel as a full-stack application.

## 🚀 Deployment Steps

### 1. Prepare Your Repository

Ensure all changes are committed and pushed to your GitHub repository.

### 2. Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the root directory of this project

### 3. Configure Environment Variables

In your Vercel project settings, add these environment variables:

**Required Variables:**

- `DATABASE_URL` - Your MongoDB connection string
- `JWT_ACCESS_SECRET` - Secret for JWT access tokens
- `JWT_REFRESH_SECRET` - Secret for JWT refresh tokens
- `EMAIL_USER` - Your email for sending notifications
- `EMAIL_PASS` - Your email app password
- `FRONTEND_URL` - Your Vercel app URL (e.g., https://your-app.vercel.app)

### 4. Deploy

Vercel will automatically deploy your application. The build process will:

1. Install dependencies for both client and server
2. Build the React frontend
3. Compile the TypeScript backend
4. Deploy as serverless functions

## 📁 Project Structure for Vercel

```
├── vercel.json                 # Vercel configuration
├── .env.example               # Environment variables template
├── client/                    # React frontend
│   ├── package.json
│   ├── vite.config.ts        # Updated for Vercel
│   └── dist/                 # Build output
├── server/                    # Express backend
│   ├── package.json          # Updated with Vercel dependencies
│   ├── api/
│   │   └── index.ts          # Vercel serverless function
│   └── src/                  # Application code
```

## 🔧 Key Changes Made

1. **Vercel Configuration** (`vercel.json`)

   - Configured static build for React frontend
   - Set up serverless function for Express backend
   - Defined routing rules

2. **Frontend Updates**

   - Removed GitHub Pages configuration
   - Updated base URL in Vite config
   - Changed API baseURL to relative path

3. **Backend Updates**

   - Created Vercel serverless function wrapper
   - Added `@vercel/node` dependency
   - Updated build scripts

4. **Environment Variables**
   - Created `.env.example` template
   - Updated CORS configuration

## 🌐 URLs After Deployment

- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://your-app.vercel.app/api/v1/*`

## 🔄 Automatic Deployments

Vercel will automatically redeploy your application when you push changes to your main branch.

## 🐛 Troubleshooting

### Common Issues:

1. **Environment Variables**: Ensure all required env vars are set in Vercel dashboard
2. **Database Connection**: Make sure your MongoDB allows connections from Vercel's IP ranges
3. **CORS Issues**: Update `FRONTEND_URL` environment variable with your actual Vercel domain

### Logs:

Check deployment logs in Vercel dashboard under "Functions" tab for any errors.

## 📞 Support

For deployment issues, check:

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/community)
