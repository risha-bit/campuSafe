import express, { Request, Response, Application } from 'express';
import mongoose from 'mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server';
import cors from 'cors';
import dotenv from 'dotenv';
import itemRoutes from './routes/items';
import userRoutes from './routes/users';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);

// Basic Route
app.get('/', (req: Request, res: Response) => {
    res.send('CampuSafe API is running');
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campusafe';

const startServer = async () => {
    try {
        let uri = MONGO_URI;
        if (uri.includes('127.0.0.1') || uri.includes('localhost')) {
            console.log('Skipping MongoMemoryServer (broken DNS on proxy). Using local URI directly.');
        }
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('\n=======================================');
        console.error('⚠️ MongoDB connection failed!');
        console.error('The rest of the app will run in offline/mock mode for testing.');
        console.error('=======================================\n');
    } finally {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
};

startServer();
