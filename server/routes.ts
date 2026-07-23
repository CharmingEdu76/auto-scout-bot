import { Router } from 'express';
import prisma from './db';
import logger from './logger';

const router = Router();

router.post('/auth/register', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        preferences: { create: { minScoreThreshold: 15, active: true } },
      },
      include: { preferences: true },
    });

    logger.info(`[API] User registered: ${email}`);
    res.json({ success: true, user });
  } catch (err) {
    logger.error('[API] Register error:', err);
    res.status(500).json({ error: 'Failed to register' });
  }
});

router.get('/preferences/:userId', async (req, res) => {
  try {
    const prefs = await prisma.userPreference.findUnique({
      where: { userId: req.params.userId },
    });
    if (!prefs) return res.status(404).json({ error: 'Not found' });
    res.json(prefs);
  } catch (err) {
    logger.error('[API] Get prefs error:', err);
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

router.post('/preferences/:userId', async (req, res) => {
  try {
    const { brand, model, minPrice, maxPrice, minYear, maxYear, maxMileage, minScoreThreshold, active } = req.body;

    const prefs = await prisma.userPreference.update({
      where: { userId: req.params.userId },
      data: {
        brand: brand || null,
        model: model || null,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        minYear: minYear || null,
        maxYear: maxYear || null,
        maxMileage: maxMileage || null,
        minScoreThreshold: minScoreThreshold ?? 15,
        active: active ?? true,
      },
    });

    logger.info(`[API] Prefs updated for ${req.params.userId}`);
    res.json({ success: true, prefs });
  } catch (err) {
    logger.error('[API] Update prefs error:', err);
    res.status(500).json({ error: 'Failed to update' });
  }
});

router.get('/listings', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const listings = await prisma.listing.findMany({
      orderBy: { analyzedScore: 'desc' },
      take: limit,
    });
    res.json(listings);
  } catch (err) {
    logger.error('[API] Get listings error:', err);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

router.get('/notifications/:userId', async (req, res) => {
  try {
    const notifs = await prisma.notificationSent.findMany({
      where: { userId: req.params.userId },
      include: { listing: true },
      orderBy: { sentAt: 'desc' },
      take: 20,
    });
    res.json(notifs);
  } catch (err) {
    logger.error('[API] Get notifs error:', err);
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

router.get('/stats/:userId', async (req, res) => {
  try {
    const [notifCount, listingCount, topDeals] = await Promise.all([
      prisma.notificationSent.count({ where: { userId: req.params.userId } }),
      prisma.listing.count(),
      prisma.listing.findMany({
        where: { analyzedScore: { gt: 15 } },
        orderBy: { analyzedScore: 'desc' },
        take: 5,
      }),
    ]);

    res.json({ notificationsSent: notifCount, totalListings: listingCount, topDeals });
  } catch (err) {
    logger.error('[API] Get stats error:', err);
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

router.post('/test-scan/:userId', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      include: { preferences: true },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Simulated test listings
    const testListings = [
      {
        platform: 'test',
        externalId: `test-${Date.now()}-1`,
        title: '🧪 Test: BMW 3er 320i (2015)',
        price: 18500,
        mileage: 85000,
        year: 2015,
        brand: 'BMW',
        model: '3er',
        condition: 'used',
        location: 'Berlin',
        sellerContact: { name: 'Test Seller' },
        images: ['https://via.placeholder.com/300x200'],
        url: 'https://test.example.com/listing1',
      },
    ];

    // Save to DB
    for (const listing of testListings) {
      await prisma.listing.upsert({
        where: { platform_externalId: { platform: listing.platform, externalId: listing.externalId } },
        update: { scrapedAt: new Date() },
        create: { ...listing, scrapedAt: new Date(), analyzedScore: 25.5 },
      });
    }

    // Simulate notification
    const dbListing = await prisma.listing.findUnique({
      where: { platform_externalId: { platform: 'test', externalId: testListings[0].externalId } },
    });

    if (dbListing) {
      await prisma.notificationSent.create({
        data: { userId: req.params.userId, listingId: dbListing.id },
      });
    }

    logger.info('[API] Test scan triggered for user', req.params.userId);
    res.json({ success: true, message: 'Test notification created! Check Benachrichtigungen tab.' });
  } catch (err) {
    logger.error('[API] Test scan error:', err);
    res.status(500).json({ error: 'Test failed' });
  }
});

export default router;
