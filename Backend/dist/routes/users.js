"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
const mockUsers = {};
// Get profile by email
router.get('/:email', async (req, res) => {
    try {
        const email = req.params.email;
        if (mongoose_1.default.connection.readyState !== 1) {
            console.warn("⚠️ Mock GET Profile (DB Offline)");
            if (!mockUsers[email]) {
                const newUser = { email: email, isProfileComplete: false, _id: "mock-id-" + Math.random() };
                mockUsers[email] = newUser;
                return res.status(200).json(newUser);
            }
            return res.status(200).json(mockUsers[email]);
        }
        const user = await User_1.default.findOne({ email: email });
        if (!user) {
            // First time login - auto create the user mock record with email
            const newUser = new User_1.default({ email: req.params.email, isProfileComplete: false });
            await newUser.save();
            return res.status(200).json(newUser);
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
});
// Update profile
router.put('/:email', async (req, res) => {
    try {
        const email = req.params.email;
        if (mongoose_1.default.connection.readyState !== 1) {
            console.warn("⚠️ Mock PUT Profile (DB Offline)");
            const existing = mockUsers[email] || {};
            mockUsers[email] = {
                ...existing,
                ...req.body,
                isProfileComplete: true,
                _id: existing._id || "mock-id-" + Math.random()
            };
            return res.status(200).json(mockUsers[email]);
        }
        const updatedUser = await User_1.default.findOneAndUpdate({ email: email }, { ...req.body, isProfileComplete: true }, { new: true, upsert: true });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});
exports.default = router;
