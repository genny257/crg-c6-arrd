import * as nodemailer from 'nodemailer';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

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

export const EmailService = {
  async sendEmail(options: MailOptions): Promise<void> {
    try {
      const info = await transporter.sendMail({
        from: `"Votre Organisation" <${process.env.EMAIL_FROM}>`,
        ...options,
      });
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email.');
    }
  },
  
  async sendSponsorshipConfirmation(partnerEmail: string, companyName: string): Promise<void> {
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
