import express, { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';

const router: Router = express.Router();

const mockUsers: Record<string, any> = {};

// Get profile by email
router.get('/:email', async (req: Request, res: Response) => {
    try {
        const email = req.params.email as string;
        if (mongoose.connection.readyState !== 1) {
            console.warn("⚠️ Mock GET Profile (DB Offline)");
            if (!mockUsers[email]) {
                const newUser = { email: email, isProfileComplete: false, _id: "mock-id-" + Math.random() };
                mockUsers[email] = newUser;
                return res.status(200).json(newUser);
            }
            return res.status(200).json(mockUsers[email]);
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            // First time login - auto create the user mock record with email
            const newUser = new User({ email: req.params.email, isProfileComplete: false });
            await newUser.save();
            return res.status(200).json(newUser);
        }
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
});

// Update profile
router.put('/:email', async (req: Request, res: Response) => {
    try {
        const email = req.params.email as string;
        if (mongoose.connection.readyState !== 1) {
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
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            { ...req.body, isProfileComplete: true },
            { new: true, upsert: true }
        );
        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});

export default router;
