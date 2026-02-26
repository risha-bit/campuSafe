import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    name?: string;
    usn?: string;
    branch?: string;
    course?: string;
    year?: number;
    profilePhoto?: string;
    postsCount: number;
    claimsCount: number;
    isProfileComplete: boolean;
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    usn: { type: String },
    branch: { type: String },
    course: { type: String },
    year: { type: Number },
    profilePhoto: { type: String },
    postsCount: { type: Number, default: 0 },
    claimsCount: { type: Number, default: 0 },
    isProfileComplete: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);
