"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const itemSchema = new mongoose_1.Schema({
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
exports.default = mongoose_1.default.model('Item', itemSchema);
