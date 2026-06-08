import sgMail from "@sendgrid/mail";

/**
 * Initialize SendGrid with API key from environment
 * Set SENDGRID_API_KEY environment variable to enable email sending
 */
function initializeSendGrid() {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (apiKey) {
    sgMail.setApiKey(apiKey);
  }
}

initializeSendGrid();

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

/**
 * Send an email using SendGrid
 * Returns true if email was sent successfully, false if SendGrid is not configured
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.warn(
        "SendGrid API key not configured. Email not sent. Set SENDGRID_API_KEY to enable email sending."
      );
      return false;
    }

    const msg = {
      to: options.to,
      from: options.from || process.env.SENDGRID_FROM_EMAIL || "noreply@jetservices.com",
      replyTo: options.replyTo || process.env.SENDGRID_REPLY_TO || "support@jetservices.com",
      subject: options.subject,
      html: options.html,
    };

    await sgMail.send(msg);
    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

/**
 * Email templates for common use cases
 */
export const emailTemplates = {
  /**
   * Invitation email template
   */
  invitation: (data: {
    email: string;
    role: string;
    invitationLink: string;
    expiresAt: Date;
  }) => ({
    subject: "Invitation à rejoindre JET Services",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Bienvenue sur JET Services</h2>
        <p>Vous avez été invité à rejoindre JET Services en tant que <strong>${
          data.role === "admin"
            ? "Administrateur"
            : data.role === "conseiller"
            ? "Conseiller"
            : "Partenaire"
        }</strong>.</p>
        
        <p>Cliquez sur le lien ci-dessous pour créer votre compte :</p>
        <p>
          <a href="${data.invitationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Accepter l'invitation
          </a>
        </p>
        
        <p style="color: #666; font-size: 12px;">
          Ce lien expire le ${data.expiresAt.toLocaleString("fr-FR")}
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          Si vous n'avez pas demandé cette invitation, veuillez ignorer cet email.
        </p>
      </div>
    `,
  }),

  /**
   * Password reset email template
   */
  passwordReset: (data: { email: string; resetLink: string; expiresAt: Date }) => ({
    subject: "Réinitialiser votre mot de passe - JET Services",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Réinitialisation de mot de passe</h2>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        
        <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
        <p>
          <a href="${data.resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        
        <p style="color: #666; font-size: 12px;">
          Ce lien expire le ${data.expiresAt.toLocaleString("fr-FR")}
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email ou contacter le support.
        </p>
      </div>
    `,
  }),

  /**
   * Signup confirmation email template
   */
  signupConfirmation: (data: { name: string; email: string }) => ({
    subject: "Bienvenue sur JET Services",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Bienvenue ${data.name} !</h2>
        <p>Votre compte a été créé avec succès sur JET Services.</p>
        
        <p>Vous pouvez maintenant vous connecter avec :</p>
        <ul>
          <li>Email : ${data.email}</li>
          <li>Mot de passe : celui que vous avez défini lors de l'inscription</li>
        </ul>
        
        <p>
          <a href="${process.env.VITE_APP_URL || "http://localhost:3000"}/login" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Se connecter
          </a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          Si vous avez des questions, contactez notre support à support@jetservices.com
        </p>
      </div>
    `,
  }),

  /**
   * Dossier status update email template
   */
  dossierStatusUpdate: (data: {
    studentName: string;
    dossierType: string;
    newStatus: string;
    updateMessage?: string;
  }) => ({
    subject: `Mise à jour de votre dossier - ${data.dossierType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Mise à jour de votre dossier</h2>
        <p>Bonjour ${data.studentName},</p>
        
        <p>Votre dossier <strong>${data.dossierType}</strong> a été mis à jour.</p>
        <p><strong>Nouveau statut :</strong> ${data.newStatus}</p>
        
        ${data.updateMessage ? `<p>${data.updateMessage}</p>` : ""}
        
        <p>
          <a href="${process.env.VITE_APP_URL || "http://localhost:3000"}/student-dashboard" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Voir mes dossiers
          </a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          Si vous avez des questions, contactez votre conseiller ou support@jetservices.com
        </p>
      </div>
    `,
  }),

  /**
   * Appointment confirmation email template
   */
  appointmentConfirmation: (data: {
    studentName: string;
    appointmentDate: Date;
    appointmentTime: string;
    counsellorName: string;
  }) => ({
    subject: "Confirmation de votre rendez-vous - JET Services",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Confirmation de rendez-vous</h2>
        <p>Bonjour ${data.studentName},</p>
        
        <p>Votre rendez-vous a été confirmé :</p>
        <ul>
          <li><strong>Date :</strong> ${data.appointmentDate.toLocaleString("fr-FR")}</li>
          <li><strong>Heure :</strong> ${data.appointmentTime}</li>
          <li><strong>Conseiller :</strong> ${data.counsellorName}</li>
        </ul>
        
        <p>Veuillez arriver 5 minutes avant l'heure prévue.</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          Pour annuler ou reporter votre rendez-vous, veuillez contacter votre conseiller.
        </p>
      </div>
    `,
  }),
};
