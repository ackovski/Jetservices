import { SENDGRID_API_KEY } from "./env";

/**
 * SendGrid Email Service
 * Handles transactional emails for invitations, password resets, and confirmations
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // If no API key, log and return false (graceful degradation)
  if (!SENDGRID_API_KEY) {
    console.warn("[SendGrid] No API key configured. Email not sent:", {
      to: options.to,
      subject: options.subject,
    });
    return false;
  }

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: options.to }],
            subject: options.subject,
          },
        ],
        from: {
          email: options.from || "noreply@jetservices.com",
          name: "JET Services",
        },
        content: [
          {
            type: "text/html",
            value: options.html,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[SendGrid] Error sending email:", error);
      return false;
    }

    console.log("[SendGrid] Email sent successfully to:", options.to);
    return true;
  } catch (error) {
    console.error("[SendGrid] Exception:", error);
    return false;
  }
}

/**
 * Email Templates
 */

export function getInvitationEmailTemplate(
  inviteeName: string,
  role: string,
  acceptUrl: string,
  expiresAt: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienvenue à JET Services</h1>
          </div>
          <div class="content">
            <p>Bonjour ${inviteeName},</p>
            <p>Vous avez été invité(e) à rejoindre JET Services en tant que <strong>${role}</strong>.</p>
            <p>Cliquez sur le lien ci-dessous pour accepter votre invitation et créer votre compte :</p>
            <a href="${acceptUrl}" class="button">Accepter l'invitation</a>
            <p><strong>Important :</strong> Ce lien expire le ${expiresAt}</p>
            <p>Si vous n'avez pas demandé cette invitation, veuillez ignorer cet email.</p>
          </div>
          <div class="footer">
            <p>© 2026 JET Services. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getPasswordResetEmailTemplate(
  userName: string,
  resetUrl: string,
  expiresAt: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Réinitialisation de Mot de Passe</h1>
          </div>
          <div class="content">
            <p>Bonjour ${userName},</p>
            <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
            <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
            <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
            <p><strong>Important :</strong> Ce lien expire le ${expiresAt}</p>
            <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email et votre mot de passe restera inchangé.</p>
          </div>
          <div class="footer">
            <p>© 2026 JET Services. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getSignupConfirmationEmailTemplate(
  userName: string,
  loginUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienvenue à JET Services !</h1>
          </div>
          <div class="content">
            <p>Bonjour ${userName},</p>
            <p>Votre inscription a été confirmée avec succès !</p>
            <p>Vous pouvez maintenant accéder à votre compte :</p>
            <a href="${loginUrl}" class="button">Accéder à mon compte</a>
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
          </div>
          <div class="footer">
            <p>© 2026 JET Services. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
