# scripts/fetch-card-benefits.mjs

Scrapes official public bank benefit pages and writes verified
benefit data to src/data/products.ts.

## Run
npm run fetch-benefits

## How it works
1. Fetches each card's official bank page (public, no login needed)
2. Strips HTML to plain text
3. Runs regex parsers for each benefit type:
   - Lounge access (domestic + international, detects spend conditions)
   - Cashback rates (with caps)
   - Insurance covers (with activation conditions)
   - Reward points
   - Fuel surcharge waivers
   - Movie ticket discounts
4. Writes structured TypeScript to src/data/products.ts

## Cache
Pages are cached in scripts/.cache/ for 24 hours.
Delete this folder to force a fresh fetch.

## After running
Review src/data/products.ts before committing.
The parser catches standard patterns — unusual card terms
may need manual correction. Check any benefit marked
conditions: '' for cards you personally hold.

## Adding more cards
Add entries to the SOURCES array at the top of the script.
Each entry needs: id, name, issuer, network, annualFee, urls[], fallbackUrls[] (optional)

If the primary URL returns empty or fewer than 500 characters of text,
the script tries each fallback URL in order. Network errors are retried
once after 2 seconds (HTTP 403/429 are not retried).

After each run, a summary report shows per-card fetch status, character
count, and parsed benefit count — use it to spot cards needing manual entry.
