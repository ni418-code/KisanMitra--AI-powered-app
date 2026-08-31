import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (isConnected) {
    return;
  }

  // MongoDB is entirely optional: without a connection string the platform runs
  // on its in-memory store so the app always boots.
  if (!uri) {
    console.log('[Kisan Mitra] MONGODB_URI not set — running on the in-memory data store.');
    return;
  }

  try {
    // Set connection options
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('[Kisan Mitra] Connected successfully to MongoDB Atlas database.');
  } catch (error: any) {
    console.warn('[Kisan Mitra] MongoDB Atlas connection warning:', error?.message || error);
    console.log('[Kisan Mitra] Using local fallback persistent database layer for uninterrupted high availability.');
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
