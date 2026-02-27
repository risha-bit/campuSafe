"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
// import { MongoMemoryServer } from 'mongodb-memory-server';
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const items_1 = __importDefault(require("./routes/items"));
const users_1 = __importDefault(require("./routes/users"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// Routes
app.use('/api/items', items_1.default);
app.use('/api/users', users_1.default);
// Basic Route
app.get('/', (req, res) => {
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
        await mongoose_1.default.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('\n=======================================');
        console.error('⚠️ MongoDB connection failed!');
        console.error('The rest of the app will run in offline/mock mode for testing.');
        console.error('=======================================\n');
    }
    finally {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
};
startServer();
