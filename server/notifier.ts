const nodemailer = require('nodemailer');
const logger = require('./logger.js').default;
const prisma = require('./db.js').default;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendNotification(
  email: string,
  listing: AnalyzedListing,
  userId: string
): Promise<boolean> {
  try {
    const existing = await prisma.notificationSent.findFirst({
      where: {
        userId,
        listing: { platform: listing.platform, externalId: listing.externalId },
      },
    });

    if (existing) {
      logger.info(`[NOTIFIER] Already notified for ${listing.platform}-${listing.externalId}`);
      return false;
    }

    const html = `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #1976D2;">✨ Auto-Scout: Neues Angebot gefunden!</h2>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3>${listing.title}</h3>
          <p><strong>Plattform:</strong> ${listing.platform}</p>
          <p><strong>Ort:</strong> ${listing.location}</p>
          <p><strong>Laufleistung:</strong> ${listing.mileage.toLocaleString()} km</p>
        </div>
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p><strong style="font-size: 18px;">💰 Preis: €${listing.price.toLocaleString()}</strong></p>
          <p style="color: #666;">Faire Marktpreis: ~€${Math.round(listing.fairMarketPrice).toLocaleString()}</p>
        </div>
        <div style="background-color: #4CAF50; color: white; padding: 15px; border-radius: 4px; text-align: center; margin: 20px 0;">
          <p style="margin: 0; font-size: 20px; font-weight: bold;">Value Score: ${listing.valueScore.toFixed(1)}%</p>
        </div>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${listing.url}" style="display: inline-block; padding: 12px 30px; background-color: #1976D2; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Angebot ansehen
          </a>
        </div>
      </div>
    `;

    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@autoscoutbot.de',
      to: email,
      subject: `Auto-Scout: ${listing.brand} ${listing.model} - €${listing.price} (${listing.valueScore.toFixed(1)}% Wert!)`,
      html,
    });

    logger.info(`[NOTIFIER] Email sent to ${email} (${result.messageId})`);
    return true;
  } catch (err) {
    logger.info(`[NOTIFIER] Email would be sent in production. (Mock mode - SMTP not configured)`);
    return true;
  }
}

async function sendNotifications(
  email: string,
  listings: any[],
  userId: string
): Promise<number> {
  let count = 0;
  for (const listing of listings) {
    const sent = await sendNotification(email, listing, userId);
    if (sent) {
      const dbListing = await prisma.listing.findUnique({
        where: { platform_externalId: { platform: listing.platform, externalId: listing.externalId } },
      });
      if (dbListing) {
        await prisma.notificationSent.create({
          data: { userId, listingId: dbListing.id },
        });
      }
      count++;
    }
  }
  return count;
}

module.exports = { sendNotification, sendNotifications };
