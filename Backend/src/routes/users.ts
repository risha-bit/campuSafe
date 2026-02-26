import express, { Request, Response, Router } from 'express';
import User from '../models/User';

const router: Router = express.Router();

// Get profile by email
router.get('/:email', async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            // First time login - auto create the user mock record with email
            const newUser = new User({ email: req.params.email, isProfileComplete: false });
            await newUser.save();
            res.status(200).json(newUser);
            return;
        }
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
});

// Update profile
router.put('/:email', async (req: Request, res: Response) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: req.params.email },
            { ...req.body, isProfileComplete: true },
            { new: true, upsert: true }
        );
        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});

export default router;
