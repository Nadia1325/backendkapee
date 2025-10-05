import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    console.log("🔄 Connecting to MongoDB...");
    
    await mongoose.connect(mongoUri, {
      // Modern mongoose connection options
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    console.log("✅ MongoDB connected successfully!");
    console.log(`📊 Database: ${mongoose.connection.db?.databaseName}`);
    
  } catch (error: any) {
    console.error("❌ MongoDB connection failed:");
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error("\n🔍 Troubleshooting steps:");
      console.error("1. Check if your IP address is whitelisted in MongoDB Atlas");
      console.error("2. Go to https://cloud.mongodb.com → Network Access → Add IP Address");
      console.error("3. Add your current IP or 0.0.0.0/0 for development");
      console.error("4. Verify your username and password are correct");
      console.error("5. Make sure your cluster is running\n");
    }
    
    console.error("Error details:", error.message);
    
    if (process.env.NODE_ENV === 'development') {
      console.log("\n💡 For local development, you can also use local MongoDB:");
      console.log("1. Install MongoDB Community Edition");
      console.log("2. Update .env: MONGO_URI=mongodb://127.0.0.1:27017/productsdb\n");
      
      // Don't exit in development, let the app run without DB for frontend testing
      console.log("⚠️  Continuing without database connection for development...");
      return;
    }
    
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('📴 MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

export default connectDB;
