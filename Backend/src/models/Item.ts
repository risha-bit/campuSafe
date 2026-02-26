import mongoose, { Document, Schema } from 'mongoose';

export interface IItem extends Document {
    name: string;
    location: string;
    date: string;
    status: 'Posted' | 'Claim Pending' | 'Approved' | 'READY_FOR_PICKUP' | 'Completed';
    category: string;
    description: string;
    secretQuestion1?: string;
    secretAnswer1?: string;
    secretQuestion2?: string;
    secretAnswer2?: string;
    secretQuestion3?: string;
    secretAnswer3?: string;
    claimantName?: string;
    claimantEmail?: string;
    claimantPhone?: string;
    claimAnswer1?: string;
    claimAnswer2?: string;
    claimAnswer3?: string;
    pickupCode?: string;
    pickupLocation?: string;
    postedBy?: string;
    image?: string;
}

const itemSchema = new Schema<IItem>({
    name: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    status: {
        type: String,
        enum: ['Posted', 'Claim Pending', 'Approved', 'READY_FOR_PICKUP', 'Completed'],
        default: 'Posted'
    },
    category: { type: String, required: true },
    description: { type: String, required: true },
    // Secret Questions and Answers
    secretQuestion1: { type: String },
    secretAnswer1: { type: String },
    secretQuestion2: { type: String },
    secretAnswer2: { type: String },
    secretQuestion3: { type: String },
    secretAnswer3: { type: String },
    // Claimant Details (If someone claims it)
    claimantName: { type: String },
    claimantEmail: { type: String },
    claimantPhone: { type: String },
    claimAnswer1: { type: String },
    claimAnswer2: { type: String },
    claimAnswer3: { type: String },
    // Pickup
    pickupCode: { type: String },
    pickupLocation: { type: String },
    // Reference to Finder/Poster
    postedBy: { type: String },
    image: { type: String }
}, { timestamps: true });

export default mongoose.model<IItem>('Item', itemSchema);
