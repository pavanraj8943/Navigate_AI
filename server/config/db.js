const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        let mongoURI = process.env.MONGO_URI;

        // If no URI provided or connection refused, fallback to in-memory
        if (!mongoURI) {
            console.log('No MONGO_URI found in .env, starting in-memory MongoDB...');
            const mongoServer = await MongoMemoryServer.create();
            mongoURI = mongoServer.getUri();
            console.log(`In-memory MongoDB started at ${mongoURI}`);
        }

        const conn = await mongoose.connect(mongoURI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // If initial connection fails and we weren't already trying memory server
        if (!process.env.MONGO_URI || error.message.includes('ECONNREFUSED')) {
            try {
                console.log('Connection failed, attempting fallback to in-memory MongoDB...');
                const mongoServer = await MongoMemoryServer.create();
                const mongoURI = mongoServer.getUri();
                const conn = await mongoose.connect(mongoURI);
                console.log(`Fallback MongoDB Connected: ${conn.connection.host}`);
            } catch (fallbackError) {
                console.error(`Fallback Error: ${fallbackError.message}`);
                process.exit(1);
            }
        } else {
            process.exit(1);
        }
    }
};

module.exports = connectDB;
