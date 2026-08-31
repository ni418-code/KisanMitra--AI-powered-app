import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI?.trim();

  if (isConnected) {
    return;
  }

  // MongoDB is optional for the hackathon/demo deployment because Kisan Mitra
  // has an in-memory data store fallback. Never keep credentials in source code.
  if (!uri) {
    console.log('[Kisan Mitra] MONGODB_URI is not configured; using the in-memory demo data store.');
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('[Kisan Mitra] Connected successfully to MongoDB Atlas database.');
  } catch (error: any) {
    // Do not block Render startup if Atlas is unavailable. The demo continues
    // with the in-memory data store and can be restarted/reconnected later.
    console.warn('[Kisan Mitra] MongoDB connection warning:', error?.message || error);
    console.log('[Kisan Mitra] Continuing with the in-memory demo data store.');
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
