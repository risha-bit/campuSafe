import express, { Request, Response, Router } from 'express';
import Item from '../models/Item';

const router: Router = express.Router();

// GET all items
router.get('/', async (req: Request, res: Response) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
});

// GET single item
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        res.status(200).json(item);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching item', error: error.message });
    }
});

// POST new item
router.post('/', async (req: Request, res: Response) => {
    try {
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating item', error: error.message });
    }
});

// PUT/Update Claim
router.put('/:id/claim', async (req: Request, res: Response) => {
    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            { ...req.body, status: 'Claim Pending' },
            { new: true }
        );
        res.status(200).json(item);
    } catch (error: any) {
        res.status(500).json({ message: 'Error claiming item', error: error.message });
    }
});

// PUT/Update Status
router.put('/:id/status', async (req: Request, res: Response) => {
    try {
        const { status, pickupCode, pickupLocation } = req.body;
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            { status, ...(pickupCode && { pickupCode }), ...(pickupLocation && { pickupLocation }) },
            { new: true }
        );
        res.status(200).json(item);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
});

export default router;
