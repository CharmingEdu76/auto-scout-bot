import schedule from 'node-schedule';
import logger from './logger.js';
import prisma from './db.js';
import { scrapeListings } from './scraper.js';
import { analyzeListings, shouldNotify } from './analyzer.js';
import { sendNotifications } from './notifier.js';

export function startScheduler() {
  const cronPattern = process.env.SCHEDULER_INTERVAL || '0 */2 * * *';
  logger.info(`[SCHEDULER] Starting with pattern: ${cronPattern}`);

  schedule.scheduleJob(cronPattern, async () => {
    await runScanCycle();
  });
}

async function runScanCycle() {
  logger.info('[SCHEDULER] Starting scan cycle...');
  const start = Date.now();

  try {
    const users = await prisma.user.findMany({
      include: { preferences: true },
    });

    for (const user of users) {
      if (!user.preferences?.active) continue;

      await scanForUser(user.id, user.email, user.preferences);
    }

    const duration = ((Date.now() - start) / 1000).toFixed(2);
    logger.info(`[SCHEDULER] Scan completed in ${duration}s`);
  } catch (err) {
    logger.error('[SCHEDULER] Error:', err);
  }
}

async function scanForUser(userId: string, email: string, prefs: any) {
  try {
    logger.info(`[SCHEDULER] Scanning for ${email}...`);

    const filters = {
      brand: prefs.brand,
      minPrice: prefs.minPrice,
      maxPrice: prefs.maxPrice,
      maxMileage: prefs.maxMileage,
    };

    const listings = await scrapeListings(filters);
    logger.info(`[SCHEDULER] Found ${listings.length} listings`);

    for (const listing of listings) {
      await prisma.listing.upsert({
        where: { platform_externalId: { platform: listing.platform, externalId: listing.externalId } },
        update: { scrapedAt: new Date() },
        create: {
          ...listing,
          scrapedAt: new Date(),
        },
      });
    }

    const analyzed = await analyzeListings(listings);
    const goodDeals = analyzed.filter((a) => shouldNotify(a, prefs.minScoreThreshold));

    if (goodDeals.length > 0) {
      const sent = await sendNotifications(email, goodDeals, userId);
      logger.info(`[SCHEDULER] Sent ${sent} notifications to ${email}`);
    }
  } catch (err) {
    logger.error(`[SCHEDULER] Error for ${email}:`, err);
  }
}
