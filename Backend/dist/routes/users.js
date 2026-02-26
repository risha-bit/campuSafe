"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
// Get profile by email
router.get('/:email', async (req, res) => {
    try {
        const user = await User_1.default.findOne({ email: req.params.email });
        if (!user) {
            // First time login - auto create the user mock record with email
            const newUser = new User_1.default({ email: req.params.email, isProfileComplete: false });
            await newUser.save();
            res.status(200).json(newUser);
            return;
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
        const updatedUser = await User_1.default.findOneAndUpdate({ email: req.params.email }, { ...req.body, isProfileComplete: true }, { new: true, upsert: true });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});
exports.default = router;
