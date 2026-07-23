# Auto-Scout Bot 🚗

Ein 24/7 Bot zum Finden von guten Auto-Deals auf deutschen Plattformen (Mobile.de, Autoscout24, AutoUncle, eBay).

## Setup (5 Minuten)

### 1. Datenbank starten
```bash
docker-compose up -d
sleep 10
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. Datenbank initialisieren
```bash
npx prisma db push
```

### 4. .env erstellen
```bash
cp .env.example .env
```

Für lokale Tests brauchst du SMTP nicht zu konfigurieren (läuft im Mock-Modus).

### 5. App starten
```bash
npm run dev
```

Das startet:
- **Server**: http://localhost:3000 (Backend API)
- **Frontend**: http://localhost:5173 (React Dashboard)

## API Endpoints

```
POST   /api/auth/register              - User registrieren
GET    /api/preferences/:userId        - Filter abrufen
POST   /api/preferences/:userId        - Filter speichern
GET    /api/listings                   - Alle Angebote
GET    /api/notifications/:userId      - Benachrichtigungsverlauf
GET    /api/stats/:userId              - Dashboard-Statistiken
```

## Frontend Features

✅ **Dashboard** - Übersicht über Scans & Benachrichtigungen  
✅ **Einstellungen** - Filter konfigurieren (Marke, Preis, Laufleistung, etc.)  
✅ **Benachrichtigungen** - Verlauf aller gefundenen Deals  

## Wie es funktioniert

1. **Scraper** - Fetcht Auto-Listings (aktuell: Mock-Daten)
2. **Analyzer** - Berechnet fairen Marktpreis & Value-Score
3. **Scheduler** - Läuft automatisch alle 5 Minuten (im Dev: schneller zum Testen)
4. **Notifier** - Sendet Email-Alerts bei guten Deals

## Für Production: Email aktivieren

Bearbeite `.env` mit deinen Gmail-Daten:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=dein-email@gmail.com
SMTP_PASS=dein-app-passwort
```

Google App-Passwort:
1. Gehe zu https://myaccount.google.com/security
2. Aktiviere 2-Faktor-Authentifizierung
3. Generiere ein "App-Passwort" für "Mail"
4. Verwende dieses Passwort in `.env`

## Database Viewer

Um die Datenbank visuell zu durchsuchen:
```bash
npx prisma studio
```

Öffnet UI auf http://localhost:5555

## Deployen auf Hostinger VPS

### 1. Build für Production
```bash
npm run build
```

Erzeugt:
- `dist/server/` - Backend
- `dist/client/` - Frontend (Static Files)

### 2. Auf VPS hochladen

```bash
# SSH ins VPS
ssh user@your-vps-ip

# Node.js installieren (falls noch nicht)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql postgresql-contrib

# App hochladen
scp -r dist/ package.json .env user@your-vps-ip:/home/user/auto-scout-bot/

# Datenbank setuppen
sudo -u postgres createdb auto_scout_bot
sudo -u postgres createuser auto_scout --password
# Password: development_password (oder ändern in .env)
```

### 3. Mit PM2 starten (Auto-Restart)

```bash
# PM2 installieren
npm install -g pm2

# App starten
pm2 start dist/server/index.js --name "auto-scout-bot"

# Auto-Restart bei Reboot
pm2 startup
pm2 save

# Logs anschauen
pm2 logs auto-scout-bot
```

### 4. Nginx Reverse Proxy (optional)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Phase 2: Echte Scraper (später)

Die aktuellen Scraper nutzen Mock-Daten. Um echte Websites zu scrapen:

1. **Option A**: Puppeteer in echtem Node.js Environment (VPS)
2. **Option B**: Externe Scraping-API (ScrapingBee, Bright Data) via HTTP

Momentan ideal: Mock-Daten lokal testen, dann echte Scraper später bauen.

## Troubleshooting

**Postgres Connection Error?**
```bash
# Checken ob Docker läuft
docker ps

# Restart wenn nötig
docker-compose restart
```

**Port 3000 already in use?**
```bash
PORT=3001 npm run dev
```

**Prisma Migration Error?**
```bash
npx prisma migrate dev --name fix
```

## Scripts

```bash
npm run dev              # Dev mit Auto-Reload
npm run build            # Production Build
npm run start            # Run Production Build
npm run db:push          # Datenbank synchen
npm run prisma:studio    # Datenbank UI öffnen
```

## Support

Issues? Schau mal in:
- `.env` - Alle Konfigurationen richtig?
- Datenbank lädt mit `docker-compose ps`
- Logs mit `npm run dev` (sehr ausführlich)

Viel Erfolg! 🚀
