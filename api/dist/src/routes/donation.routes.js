"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/donation.routes.ts
const express_1 = require("express");
const donation_controller_1 = require("../controllers/donation.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/donations', donation_controller_1.createDonation);
router.post('/donations/confirm', donation_controller_1.confirmDonation);
router.get('/donations', auth_1.protect, donation_controller_1.getDonations);
exports.default = router;
