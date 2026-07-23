import prisma from './db.js';
import logger from './logger.js';
import { ScrapedListing } from './scraper.js';

export interface AnalyzedListing extends ScrapedListing {
  valueScore: number;
  fairMarketPrice: number;
}

export async function analyzeListing(listing: ScrapedListing): Promise<AnalyzedListing> {
  const comparables = await prisma.listing.findMany({
    where: {
      brand: listing.brand,
      model: listing.model,
      year: { gte: listing.year - 2, lte: listing.year + 2 },
      mileage: { gte: listing.mileage - 30000, lte: listing.mileage + 30000 },
    },
    select: { price: true },
    take: 20,
  });

  let fairMarketPrice = listing.price;
  if (comparables.length > 0) {
    const prices = comparables.map((c) => c.price).sort((a, b) => a - b);
    const mid = Math.floor(prices.length / 2);
    fairMarketPrice = prices.length % 2 === 0 ? (prices[mid - 1] + prices[mid]) / 2 : prices[mid];
  }

  const valueScore = ((fairMarketPrice - listing.price) / fairMarketPrice) * 100;

  logger.info(
    `[ANALYZER] ${listing.brand} ${listing.model}: Score=${valueScore.toFixed(1)}%, Fair=€${Math.round(fairMarketPrice)}, Listed=€${listing.price}`
  );

  return { ...listing, valueScore, fairMarketPrice };
}

export async function analyzeListings(listings: ScrapedListing[]): Promise<AnalyzedListing[]> {
  return Promise.all(listings.map((listing) => analyzeListing(listing)));
}

export function shouldNotify(analyzed: AnalyzedListing, threshold: number): boolean {
  return analyzed.valueScore >= threshold;
}
