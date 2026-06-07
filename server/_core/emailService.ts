import { notifyOwner } from "./notification";

/**
 * Email service for sending notifications to users
 * Currently uses the notifyOwner helper to send emails
 * In production, integrate with a real email service (SendGrid, Mailgun, etc.)
 */

export interface EmailTemplate {
  subject: string;
  content: string;
  recipientEmail?: string;
}

/**
 * Send signup confirmation email
 */
export async function sendSignupConfirmationEmail(
  userEmail: string,
  userName: string
): Promise<void> {
  const template: EmailTemplate = {
    subject: "Bienvenue chez JET Services !",
    content: `
Bonjour ${userName},

Bienvenue chez JET Services ! Votre compte a été créé avec succès.

Vous pouvez maintenant vous connecter à votre tableau de bord pour :
- Suivre vos dossiers d'études
- Gérer vos documents
- Communiquer avec nos conseillers

Lien de connexion : /login

Si vous avez des questions, n'hésitez pas à nous contacter.

Cordialement,
L'équipe JET Services
    `,
    recipientEmail: userEmail,
  };

  // In production, send to actual email service
  // For now, notify owner
  await notifyOwner({
    title: "Nouvelle inscription",
    content: `${userName} (${userEmail}) s'est inscrit avec succès`,
  });
}

/**
 * Send dossier update notification email
 */
export async function sendDossierUpdateEmail(
  userEmail: string,
  userName: string,
  dossierType: string,
  status: string
): Promise<void> {
  const template: EmailTemplate = {
    subject: `Mise à jour de votre dossier ${dossierType}`,
    content: `
Bonjour ${userName},

Votre dossier "${dossierType}" a été mis à jour.

Nouveau statut : ${status}

Consultez votre tableau de bord pour plus de détails.

Lien : /student-dashboard

Cordialement,
L'équipe JET Services
    `,
    recipientEmail: userEmail,
  };

  // In production, send to actual email service
  // For now, notify owner
  await notifyOwner({
    title: "Mise à jour de dossier",
    content: `Le dossier "${dossierType}" de ${userName} a été mis à jour avec le statut: ${status}`,
  });
}

/**
 * Send message notification email
 */
export async function sendMessageNotificationEmail(
  userEmail: string,
  userName: string,
  senderName: string
): Promise<void> {
  const template: EmailTemplate = {
    subject: `Nouveau message de ${senderName}`,
    content: `
Bonjour ${userName},

Vous avez reçu un nouveau message de ${senderName}.

Consultez votre tableau de bord pour lire le message.

Lien : /student-dashboard

Cordialement,
L'équipe JET Services
    `,
    recipientEmail: userEmail,
  };

  // In production, send to actual email service
  // For now, notify owner
  await notifyOwner({
    title: "Nouveau message",
    content: `${userName} a reçu un message de ${senderName}`,
  });
}

/**
 * Send appointment confirmation email
 */
export async function sendAppointmentConfirmationEmail(
  userEmail: string,
  userName: string,
  consultantName: string,
  appointmentDate: Date
): Promise<void> {
  const formattedDate = appointmentDate.toLocaleString("fr-FR");

  const template: EmailTemplate = {
    subject: "Confirmation de rendez-vous",
    content: `
Bonjour ${userName},

Votre rendez-vous avec ${consultantName} est confirmé.

Date et heure : ${formattedDate}

Consultez votre tableau de bord pour plus de détails.

Lien : /student-dashboard

Cordialement,
L'équipe JET Services
    `,
    recipientEmail: userEmail,
  };

  // In production, send to actual email service
  // For now, notify owner
  await notifyOwner({
    title: "Rendez-vous confirmé",
    content: `Rendez-vous confirmé pour ${userName} avec ${consultantName} le ${formattedDate}`,
  });
}
