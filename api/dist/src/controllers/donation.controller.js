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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDonations = exports.confirmDonation = exports.createDonation = void 0;
const stripe_1 = __importDefault(require("stripe"));
const donationService = __importStar(require("../services/donation.service"));
const client_1 = require("@prisma/client");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-06-20',
});
const createDonation = async (req, res) => {
    try {
        const { amount, name, email, method, type } = req.body;
        // 1. Save the donation to your database with status 'PENDING'
        const donation = await donationService.createDonation({
            ...req.body,
            status: client_1.DonationStatus.PENDING,
        });
        // 2. Create a Payment Intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Amount in cents
            currency: 'eur', // Change to your currency
            metadata: {
                name,
                email,
                donationId: donation.id // Pass your internal donation ID to Stripe
            },
        });
        // 3. Return the client secret to the frontend
        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
            donationId: donation.id
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating donation', error: error.message });
    }
};
exports.createDonation = createDonation;
const confirmDonation = async (req, res) => {
    try {
        const { donationId } = req.body;
        if (!donationId) {
            return res.status(400).json({ message: 'Donation ID is required.' });
        }
        const updatedDonation = await donationService.updateDonationStatus(donationId, client_1.DonationStatus.CONFIRMED);
        // TODO: Trigger sending a receipt email here in a future step
        res.status(200).json({
            message: 'Donation confirmed successfully.',
            donation: updatedDonation
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error confirming donation', error: error.message });
    }
};
exports.confirmDonation = confirmDonation;
const getDonations = async (req, res) => {
    try {
        const donations = await donationService.getAllDonations();
        res.json(donations);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching donations', error });
    }
};
exports.getDonations = getDonations;
