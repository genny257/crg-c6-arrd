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
exports.EmailService = void 0;
const nodemailer = __importStar(require("nodemailer"));
// We assume EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, and EMAIL_FROM are in .env
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: (process.env.EMAIL_PORT === '465'), // `secure:true` is recommended for port 465
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your App Password
    },
});
exports.EmailService = {
    async sendEmail(options) {
        try {
            const info = await transporter.sendMail({
                from: `"Votre Organisation" <${process.env.EMAIL_FROM}>`,
                ...options,
            });
            console.log('Message sent: %s', info.messageId);
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email.');
        }
    },
    async sendSponsorshipConfirmation(partnerEmail, companyName) {
        const subject = "Confirmation de votre demande de partenariat";
        const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #004a99; border-bottom: 2px solid #eee; padding-bottom: 10px;">
          Confirmation de votre demande de mécénat
        </h2>
        <p>Cher partenaire de <strong>${companyName}</strong>,</p>
        <p>Nous avons bien reçu votre demande de mécénat et nous vous remercions de l'intérêt que vous portez à notre mission.</p>
        <p>Votre proposition a été transmise à notre équipe chargée des partenariats. Nous l'étudierons avec la plus grande attention et reviendrons vers vous dans les plus brefs délais.</p>
        <p>Nous sommes honorés de la confiance que vous nous accordez.</p>
        <br/>
        <p>Cordialement,</p>
        <p><strong>L'équipe de [Nom de votre organisation]</strong></p>
      </div>
    `;
        await this.sendEmail({ to: partnerEmail, subject, html });
    }
};
