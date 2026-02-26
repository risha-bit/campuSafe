"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Item_1 = __importDefault(require("../models/Item"));
const router = express_1.default.Router();
// GET all items
router.get('/', async (req, res) => {
    try {
        const items = await Item_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(items);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
});
// GET single item
router.get('/:id', async (req, res) => {
    try {
        const item = await Item_1.default.findById(req.params.id);
        if (!item) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        res.status(200).json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching item', error: error.message });
    }
});
// POST new item
router.post('/', async (req, res) => {
    try {
        const newItem = new Item_1.default(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating item', error: error.message });
    }
});
// PUT/Update Claim
router.put('/:id/claim', async (req, res) => {
    try {
        const item = await Item_1.default.findByIdAndUpdate(req.params.id, { ...req.body, status: 'Claim Pending' }, { new: true });
        res.status(200).json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Error claiming item', error: error.message });
    }
});
// PUT/Update Status
router.put('/:id/status', async (req, res) => {
    try {
        const { status, pickupCode } = req.body;
        const item = await Item_1.default.findByIdAndUpdate(req.params.id, { status, ...(pickupCode && { pickupCode }) }, { new: true });
        res.status(200).json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
});
exports.default = router;
