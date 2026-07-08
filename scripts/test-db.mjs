import dns from 'node:dns';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.local' });

// Force Node to use stable public DNS
dns.setServers(['8.8.8.8', '1.1.1.1']);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is missing');
    process.exit(1);
}

try {
    console.log('Testing MongoDB DNS SRV...');

    const srvRecords = await dns.promises.resolveSrv(
        '_mongodb._tcp.cluster264.hvpuxoz.mongodb.net'
    );

    console.log('DNS SRV records found:', srvRecords.length);

    await mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
    });

    console.log('Database connected successfully');

    await mongoose.disconnect();
    process.exit(0);
} catch (error) {
    console.error('ERROR: Database connection failed');
    console.error(error);
    process.exit(1);
}