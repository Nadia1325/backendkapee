# Deploying to Render

## Quick Deploy Steps

### 1. Push your code to GitHub
```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### 2. Create a new Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Use these settings:

**Basic Settings:**
- **Name**: `shop-backend` (or your preferred name)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Advanced Settings:**
- **Node Version**: `18` (or latest LTS)
- **Root Directory**: `backend` (if backend is in a subdirectory)

### 3. Set Environment Variables
In the Render dashboard, add these environment variables:

**Required:**
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key
```

**Optional (if using):**
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 4. Deploy
- Click "Create Web Service"
- Render will automatically build and deploy your app
- Your API will be available at: `https://your-app-name.onrender.com`

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [mongodb.com](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier is fine)
3. Create a database user
4. Add `0.0.0.0/0` to network access (for Render to connect)
5. Get connection string and set as `MONGODB_URI` environment variable

## Environment Variables Explained

- **NODE_ENV**: Set to `production` for production deployment
- **PORT**: Render uses port 10000 by default
- **MONGODB_URI**: Your MongoDB Atlas connection string
- **JWT_SECRET**: A secure random string for JWT token signing

## Troubleshooting

### Common Issues:

1. **"nodemon not found"**
   - Fixed by using `npm start` instead of `npm run dev` for production
   
2. **"Cannot connect to MongoDB"**
   - Check your MONGODB_URI environment variable
   - Ensure MongoDB Atlas allows connections from `0.0.0.0/0`
   
3. **"Port binding issues"**
   - Fixed by binding to `0.0.0.0` in production mode
   
4. **"Build fails"**
   - Check that all dependencies are in `dependencies` (not `devDependencies`)
   - Ensure TypeScript is included for the build process

### View Logs:
- Go to your service in Render Dashboard
- Click "Logs" to see real-time deployment and runtime logs

## API Endpoints After Deployment

Your deployed API will have these endpoints:
- `GET /api/products` - Get all products
- `GET /api/stats/dashboard` - Get dashboard statistics  
- `GET /api/home-images/active` - Get active home images
- `POST /api/auth/login` - User login
- And all other endpoints...

## Testing Your Deployed API

Test with curl or Postman:
```bash
curl https://your-app-name.onrender.com/api/products
```

## Frontend Deployment

Remember to update your frontend environment variables:
```
VITE_API_URL=https://your-app-name.onrender.com
```

Then deploy your frontend to Vercel, Netlify, or another static hosting service.