import mongoose from 'mongoose';
import { config } from '../config/config.js';


export async function connectMongo() {
try {
await mongoose.connect(config.MONGO_URI);
console.log('✅ MongoDB conectado');
} catch (err) {
console.error('❌ Error conectando a MongoDB:', err.message);
process.exit(1);
}
}