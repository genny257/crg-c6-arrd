import * as nodemailer from 'nodemailer';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

// We assume EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, and EMAIL_FROM are in .env
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: (process.env.EMAIL_PORT === '465'), // `secure:true` is recommended for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const EmailService = {
  async sendEmail(options: MailOptions): Promise<void> {
    try {
      const info = await transporter.sendMail({
        from: `"Croix-Rouge Gabonaise" <${process.env.EMAIL_FROM}>`,
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
        <h2 style="color: #B71C1C; border-bottom: 2px solid #eee; padding-bottom: 10px;">
          Confirmation de votre demande de mécénat
        </h2>
        <p>Cher partenaire de <strong>${companyName}</strong>,</p>
        <p>Nous avons bien reçu votre demande de mécénat et nous vous remercions de l'intérêt que vous portez à notre mission.</p>
        <p>Votre proposition a été transmise à notre équipe chargée des partenariats. Nous l'étudierons avec la plus grande attention et reviendrons vers vous dans les plus brefs délais.</p>
        <p>Nous sommes honorés de la confiance que vous nous accordez.</p>
        <br/>
        <p>Cordialement,</p>
        <p><strong>L'équipe de la Croix-Rouge Gabonaise (Comité du 6ème Arr.)</strong></p>
      </div>
    `;
    
    await this.sendEmail({ to: partnerEmail, subject, html });
  },

  async sendContactFormEmail(name: string, fromEmail: string, subject: string, message: string): Promise<void> {
    const to = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;
    if (!to) {
        console.error("No recipient email address configured for contact form.");
        throw new Error("Server configuration error: recipient email missing.");
    }
    
    const emailSubject = `Nouveau message de contact : ${subject}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #B71C1C; border-bottom: 2px solid #eee; padding-bottom: 10px;">
          Nouveau Message via le Formulaire de Contact
        </h2>
        <p>Vous avez reçu un nouveau message de :</p>
        <ul>
          <li><strong>Nom :</strong> ${name}</li>
          <li><strong>Email :</strong> ${fromEmail}</li>
          <li><strong>Sujet :</strong> ${subject}</li>
        </ul>
        <h3 style="color: #333; margin-top: 20px;">Message :</h3>
        <div style="background-color: #f9f9f9; border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        <br/>
        <p>Vous pouvez répondre directement à cette personne à l'adresse <a href="mailto:${fromEmail}">${fromEmail}</a>.</p>
      </div>
    `;
    
    await this.sendEmail({ to, subject: emailSubject, html, replyTo: fromEmail });
  },

  async sendDonationInstructions(donorEmail: string, donorName: string, amount: number): Promise<void> {
    const subject = "Instructions pour finaliser votre don";
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #B71C1C; border-bottom: 2px solid #eee; padding-bottom: 10px;">
          Merci pour votre généreux don, ${donorName} !
        </h2>
        <p>Nous avons bien enregistré votre promesse de don d'un montant de <strong>${amount.toLocaleString('fr-FR')} FCFA</strong>.</p>
        <p>Pour finaliser votre contribution, veuillez suivre les étapes ci-dessous :</p>
        <div style="background-color: #f9f9f9; border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <h3 style="color: #333; margin-top: 0;">Paiement par Mobile Money</h3>
          <p>
            Veuillez effectuer votre virement au numéro suivant :<br>
            <strong>(Insérez votre numéro Mobile Money ici)</strong>
          </p>
          <p>
            <strong>Nom du bénéficiaire :</strong> Croix-Rouge Gabonaise - Comité 6e Arr.
          </p>
          <p>
            <strong>Motif du virement :</strong> Don de ${donorName}
          </p>
        </div>
        <p style="margin-top: 20px;">
          Une fois le virement effectué, votre don sera marqué comme "Confirmé" dans nos systèmes. Vous recevrez un reçu officiel par e-mail peu de temps après.
        </p>
        <p>Votre soutien est précieux et nous permet de poursuivre nos actions sur le terrain.</p>
        <br/>
        <p>Cordialement,</p>
        <p><strong>L'équipe de la Croix-Rouge Gabonaise (Comité du 6ème Arr.)</strong></p>
      </div>
    `;

    await this.sendEmail({ to: donorEmail, subject, html });
  }
};
