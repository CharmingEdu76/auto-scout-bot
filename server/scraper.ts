const logger = require('./logger.js').default;

export interface ScrapedListing {
  platform: string;
  externalId: string;
  title: string;
  price: number;
  mileage: number;
  year: number;
  brand: string;
  model: string;
  condition: string;
  location: string;
  sellerContact: Record<string, any>;
  images: string[];
  url: string;
}

const mockListings: ScrapedListing[] = [
  {
    platform: 'mobile-de',
    externalId: 'mock-001',
    title: 'BMW 3er 320i (2015)',
    price: 18500,
    mileage: 85000,
    year: 2015,
    brand: 'BMW',
    model: '3er',
    condition: 'used',
    location: 'Berlin',
    sellerContact: { name: 'Max Mustermann', phone: '+49123456789' },
    images: ['https://via.placeholder.com/300x200'],
    url: 'https://mobile.de/listing/mock-001',
  },
  {
    platform: 'autoscout24',
    externalId: 'mock-002',
    title: 'VW Golf 7 1.6 TDI (2018)',
    price: 22000,
    mileage: 65000,
    year: 2018,
    brand: 'VW',
    model: 'Golf',
    condition: 'used',
    location: 'Munich',
    sellerContact: { name: 'Dealer AG' },
    images: ['https://via.placeholder.com/300x200'],
    url: 'https://autoscout24.de/listing/mock-002',
  },
  {
    platform: 'auto-uncle',
    externalId: 'mock-003',
    title: 'Audi A4 2.0 TDI (2016)',
    price: 24500,
    mileage: 110000,
    year: 2016,
    brand: 'Audi',
    model: 'A4',
    condition: 'used',
    location: 'Frankfurt',
    sellerContact: { name: 'Private' },
    images: ['https://via.placeholder.com/300x200'],
    url: 'https://autouncle.de/listing/mock-003',
  },
];

async function scrapeListings(filters: Record<string, any>): Promise<ScrapedListing[]> {
  logger.info(`[SCRAPER] Scraping with filters:`, filters);

  return mockListings.filter((listing) => {
    if (filters.brand && listing.brand.toLowerCase() !== filters.brand.toLowerCase()) {
      return false;
    }
    if (filters.minPrice && listing.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && listing.price > filters.maxPrice) {
      return false;
    }
    if (filters.maxMileage && listing.mileage > filters.maxMileage) {
      return false;
    }
    return true;
  });
}

module.exports = { scrapeListings, ScrapedListing };
