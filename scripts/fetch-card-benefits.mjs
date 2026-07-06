import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, '../src/data/products.ts');
const CACHE_DIR = join(__dirname, '../scripts/.cache');

// ─────────────────────────────────────────────
// SOURCE REGISTRY
// All official bank benefit pages — public, no login
// ─────────────────────────────────────────────
const SOURCES = [
  // HDFC
  {
    id: 'hdfc-regalia',
    name: 'HDFC Regalia Credit Card',
    issuer: 'HDFC Bank',
    network: 'Visa',
    annualFee: 2500,
    urls: ['https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia'],
    fallbackUrls: [],
  },
  {
    id: 'hdfc-regalia-gold',
    name: 'HDFC Regalia Gold Credit Card',
    issuer: 'HDFC Bank',
    network: 'Visa',
    annualFee: 2500,
    urls: ['https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'],
    fallbackUrls: [],
  },
  {
    id: 'hdfc-diners-black',
    name: 'HDFC Diners Black Credit Card',
    issuer: 'HDFC Bank',
    network: 'Diners',
    annualFee: 10000,
    urls: ['https://www.hdfcbank.com/personal/pay/cards/credit-cards/diners-black-credit-card'],
    fallbackUrls: [],
  },
  {
    id: 'hdfc-millennia',
    name: 'HDFC Millennia Credit Card',
    issuer: 'HDFC Bank',
    network: 'Mastercard',
    annualFee: 1000,
    urls: ['https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card'],
    fallbackUrls: [],
  },
  {
    id: 'hdfc-moneyback-plus',
    name: 'HDFC MoneyBack+ Credit Card',
    issuer: 'HDFC Bank',
    network: 'Mastercard',
    annualFee: 500,
    urls: ['https://www.hdfcbank.com/personal/pay/cards/credit-cards/moneyback-plus-credit-card'],
    fallbackUrls: ['https://v.hdfcbank.com/htdocs/common/credit-cards/cc_moneyback.html'],
  },
  {
    id: 'hdfc-tata-neu-plus',
    name: 'HDFC Tata Neu Plus Credit Card',
    issuer: 'HDFC Bank',
    network: 'Rupay',
    annualFee: 499,
    urls: ['https://www.hdfcbank.com/personal/pay/cards/credit-cards/tata-neu-plus-hdfc-bank-credit-card'],
    fallbackUrls: [],
  },
  {
    id: 'hdfc-infinia',
    name: 'HDFC Infinia Credit Card',
    issuer: 'HDFC Bank',
    network: 'Visa',
    annualFee: 12500,
    urls: ['https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'],
    fallbackUrls: [],
  },
  {
    id: 'hdfc-millennia-debit',
    name: 'HDFC Millennia Debit Card',
    issuer: 'HDFC Bank',
    network: 'Mastercard',
    annualFee: 0,
    type: 'debit-card',
    urls: ['https://www.hdfcbank.com/personal/pay/cards/debit-cards/millennia-debit-card'],
    fallbackUrls: [],
  },
  // SBI
  {
    id: 'sbi-elite',
    name: 'SBI Card ELITE',
    issuer: 'SBI Card',
    network: 'Mastercard',
    annualFee: 4999,
    urls: ['https://www.sbicard.com/en/personal/credit-cards/travel/sbi-card-elite.page'],
    fallbackUrls: [],
  },
  {
    id: 'sbi-simply-click',
    name: 'SBI SimplyCLICK Credit Card',
    issuer: 'SBI Card',
    network: 'Visa',
    annualFee: 499,
    urls: ['https://www.sbicard.com/en/personal/credit-cards/rewards/simplyclick-sbi-card.page'],
    fallbackUrls: [],
  },
  {
    id: 'sbi-bpcl',
    name: 'BPCL SBI Credit Card',
    issuer: 'SBI Card',
    network: 'Visa',
    annualFee: 499,
    urls: ['https://www.sbicard.com/en/personal/credit-cards/fuel/bpcl-sbi-card.page'],
    fallbackUrls: [],
  },
  {
    id: 'sbi-cashback',
    name: 'SBI Cashback Credit Card',
    issuer: 'SBI Card',
    network: 'Visa',
    annualFee: 999,
    urls: ['https://www.sbicard.com/en/personal/credit-cards/cashback/cashback-sbi-card.page'],
    fallbackUrls: ['https://www.sbicard.com/sbi-card-en/assets/docs/pdf/cashback-mitc.pdf'],
  },
  {
    id: 'sbi-gold-debit',
    name: 'SBI Gold Debit Card',
    issuer: 'SBI',
    network: 'Mastercard',
    annualFee: 0,
    type: 'debit-card',
    urls: ['https://www.onlinesbi.sbi/sbicollect/icollecthome.htm'],
    fallbackUrls: ['https://www.sbi.co.in/web/personal-banking/accounts/debit-card'],
  },
  // Axis
  {
    id: 'axis-magnus',
    name: 'Axis Magnus Credit Card',
    issuer: 'Axis Bank',
    network: 'Visa',
    annualFee: 12500,
    urls: ['https://www.axisbank.com/retail/cards/credit-card/magnus-credit-card'],
    fallbackUrls: [],
  },
  {
    id: 'axis-ace',
    name: 'Axis Ace Credit Card',
    issuer: 'Axis Bank',
    network: 'Visa',
    annualFee: 499,
    urls: ['https://www.axisbank.com/retail/cards/credit-card/ace-credit-card'],
    fallbackUrls: [],
  },
  {
    id: 'axis-flipkart',
    name: 'Axis Flipkart Credit Card',
    issuer: 'Axis Bank',
    network: 'Visa',
    annualFee: 500,
    urls: ['https://www.axisbank.com/retail/cards/credit-card/flipkart-axis-bank-credit-card'],
    fallbackUrls: [],
  },
  {
    id: 'axis-vistara-infin',
    name: 'Axis Vistara Infinite Credit Card',
    issuer: 'Axis Bank',
    network: 'Visa',
    annualFee: 10000,
    urls: ['https://www.axisbank.com/retail/cards/credit-card/vistara-infinite-credit-card'],
    fallbackUrls: [],
  },
  {
    id: 'axis-vistara',
    name: 'Axis Vistara Credit Card',
    issuer: 'Axis Bank',
    network: 'Visa',
    annualFee: 1500,
    urls: ['https://www.axisbank.com/retail/cards/credit-card/vistara-credit-card'],
    fallbackUrls: [],
  },
  // ICICI
  {
    id: 'icici-amazon-pay',
    name: 'Amazon Pay ICICI Credit Card',
    issuer: 'ICICI Bank',
    network: 'Visa',
    annualFee: 0,
    urls: ['https://www.icicibank.com/personal-banking/cards/credit-card/amazon-pay-credit-card'],
    fallbackUrls: [],
  },
  {
    id: 'icici-coral',
    name: 'ICICI Coral Credit Card',
    issuer: 'ICICI Bank',
    network: 'Visa',
    annualFee: 500,
    urls: ['https://www.icicibank.com/personal-banking/cards/credit-card/coral-credit-card'],
    fallbackUrls: [],
  },
  {
    id: 'icici-sapphiro',
    name: 'ICICI Sapphiro Credit Card',
    issuer: 'ICICI Bank',
    network: 'Visa',
    annualFee: 3500,
    urls: ['https://www.icicibank.com/personal-banking/cards/credit-card/sapphiro-credit-card'],
    fallbackUrls: ['https://www.icicibank.com/personal-banking/cards/credit-card/sapphiro-credit-card/features'],
  },
  // Kotak
  {
    id: 'kotak-royale',
    name: 'Kotak Royale Signature',
    issuer: 'Kotak Bank',
    network: 'Visa',
    annualFee: 999,
    urls: ['https://www.kotak.com/en/personal-banking/cards/credit-cards/royale-signature-credit-card.html'],
    fallbackUrls: [],
  },
  {
    id: 'kotak-811',
    name: 'Kotak 811 Dream Different Card',
    issuer: 'Kotak Bank',
    network: 'Visa',
    annualFee: 0,
    urls: ['https://www.kotak.com/en/personal-banking/cards/credit-cards/811-dream-different-credit-card.html'],
    fallbackUrls: [],
  },
  // Yes Bank
  {
    id: 'yes-first-preferred',
    name: 'YES First Preferred Credit Card',
    issuer: 'Yes Bank',
    network: 'Mastercard',
    annualFee: 999,
    urls: ['https://www.yesbank.in/personal-banking/yes-individual/loans-and-cards/credit-cards/yes-first-preferred-credit-card'],
    fallbackUrls: ['https://www.yesbank.in/personal-banking/yes-individual/loans-and-cards/credit-cards/yes-first-preferred-credit-card/features-and-benefits'],
  },
  // IndusInd
  {
    id: 'indusind-legend',
    name: 'IndusInd Legend Credit Card',
    issuer: 'IndusInd Bank',
    network: 'Visa',
    annualFee: 9999,
    urls: ['https://www.indusind.com/in/en/personal/cards/credit-cards/legend-credit-card.html'],
    fallbackUrls: ['https://www.indusind.com/in/en/personal/cards/credit-cards/legend-credit-card/features.html'],
  },
  // RBL
  {
    id: 'rbl-shoprite',
    name: 'RBL Shoprite Credit Card',
    issuer: 'RBL Bank',
    network: 'Mastercard',
    annualFee: 500,
    urls: ['https://www.rblbank.com/personal/cards/credit-cards/shoprite'],
    fallbackUrls: [],
  },
  // Standard Chartered
  {
    id: 'standard-chartered-manhattan',
    name: 'Standard Chartered Manhattan Credit Card',
    issuer: 'Standard Chartered',
    network: 'Mastercard',
    annualFee: 999,
    urls: ['https://www.sc.com/in/credit-cards/standard-chartered-manhattan-credit-card/'],
    fallbackUrls: ['https://www.sc.com/in/credit-cards/manhattan/'],
  },
  // IDFC
  {
    id: 'idfc-wealth',
    name: 'IDFC FIRST Wealth Credit Card',
    issuer: 'IDFC FIRST Bank',
    network: 'Visa',
    annualFee: 0,
    urls: ['https://www.idfcfirstbank.com/credit-card/wealth-credit-card'],
    fallbackUrls: ['https://www.idfcfirstbank.com/credit-card/wealth-credit-card/features'],
  },
  // American Express
  {
    id: 'amex-gold',
    name: 'American Express Gold Charge Card',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 4500,
    urls: ['https://www.americanexpress.com/in/credit-cards/gold-card/'],
    fallbackUrls: [],
  },
];

// ─────────────────────────────────────────────
// FETCH HELPERS
// ─────────────────────────────────────────────
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-IN,en;q=0.9',
  'Cache-Control': 'no-cache',
};

async function fetchTextLive(url, isRetry = false) {
  console.log(`  [fetch${isRetry ? ' (retry)' : ''}] ${url}`);
  try {
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(18000),
      redirect: 'follow',
    });
    if (!res.ok) {
      console.warn(`  [warn]  HTTP ${res.status} for ${url}`);
      return '';
    }
    const html = await res.text();
    const text = stripHtml(html);

    try {
      const { mkdirSync } = await import('fs');
      mkdirSync(CACHE_DIR, { recursive: true });
      const cacheFile = join(CACHE_DIR, Buffer.from(url).toString('base64').slice(0, 80) + '.txt');
      writeFileSync(cacheFile, text, 'utf8');
    } catch {}

    return text;
  } catch (e) {
    if (!isRetry) {
      console.warn(`  [warn]  Network error for ${url}: ${e.message} — retrying in 2s`);
      await new Promise((r) => setTimeout(r, 2000));
      return fetchTextLive(url, true);
    }
    console.warn(`  [warn]  Fetch failed for ${url}: ${e.message}`);
    return '';
  }
}

async function fetchText(url) {
  const cacheFile = join(CACHE_DIR, Buffer.from(url).toString('base64').slice(0, 80) + '.txt');

  // Use cached version if fetched in last 24 hours
  if (existsSync(cacheFile)) {
    const stat = (await import('fs')).statSync(cacheFile);
    const ageHours = (Date.now() - stat.mtimeMs) / 3600000;
    if (ageHours < 24) {
      console.log(`  [cache] ${url}`);
      return readFileSync(cacheFile, 'utf8');
    }
  }

  return fetchTextLive(url);
}

async function fetchWithFallbacks(urls) {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const text = await fetchText(url);
    if (text && text.length > 500) {
      return {
        text,
        url,
        usedFallback: i > 0,
        charCount: text.length,
      };
    }
    if (i < urls.length - 1) {
      await new Promise((r) => setTimeout(r, 800));
    }
  }
  return { text: '', url: null, usedFallback: false, charCount: 0 };
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&#8377;/g, '₹')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// ─────────────────────────────────────────────
// BENEFIT PARSERS
// Each parser looks for known patterns in the stripped page text
// Returns array of Benefit objects
// ─────────────────────────────────────────────

function parseLounge(text, cardId) {
  const benefits = [];
  const today = new Date().toISOString().split('T')[0];

  // Domestic lounge patterns
  const domPatterns = [
    /(\d+)\s*complimentary\s*(?:domestic\s*)?(?:airport\s*)?lounge\s*(?:visits?|access)\s*(?:per\s*)?(?:quarter|quarterly)/i,
    /(\d+)\s*(?:free|complimentary)\s*lounge\s*(?:visits?|access)\s*(?:every|per)\s*(?:calendar\s*)?quarter/i,
    /lounge\s*(?:visits?|access)[^.]*?(\d+)[^.]*?(?:quarter|quarterly)/i,
  ];

  let domVisits = null;
  let domCondition = '';

  for (const pat of domPatterns) {
    const m = text.match(pat);
    if (m) {
      domVisits = parseInt(m[1]);
      // Look for spend condition near this match
      const idx = text.indexOf(m[0]);
      const surrounding = text.slice(Math.max(0, idx - 200), idx + 300);
      const spendMatch = surrounding.match(/(?:minimum|min\.?|on\s*spend(?:s)?\s*of)\s*[₹Rs.]*\s*([\d,]+)\s*(?:lakh|L|lakhs)?/i);
      if (spendMatch) {
        const amt = spendMatch[1].replace(/,/g, '');
        domCondition = `Requires minimum spend of ₹${parseInt(amt).toLocaleString('en-IN')} in the preceding quarter to qualify.`;
      }
      break;
    }
  }

  // Check for "unlimited" domestic lounge
  if (!domVisits && /unlimited\s*(?:domestic\s*)?(?:airport\s*)?lounge/i.test(text)) {
    benefits.push({
      id: `${cardId}-lounge-dom`,
      title: 'Unlimited Domestic Airport Lounge Access',
      category: 'lounge',
      description: 'Unlimited complimentary domestic airport lounge visits.',
      value: 'Unlimited',
      quota: null,
      resetPeriod: 'year',
      howToClaim: 'Show your card at the lounge entrance. Check eligible lounges via Visa/Mastercard/card network lounge locator.',
      accentColor: '#2F7A6D',
      verified: true,
      source: '',
      lastVerified: today,
      conditions: '',
    });
  } else if (domVisits) {
    benefits.push({
      id: `${cardId}-lounge-dom`,
      title: `Domestic Airport Lounge Access`,
      category: 'lounge',
      description: `${domVisits} complimentary domestic airport lounge visits per quarter.${domCondition ? ' ' + domCondition : ''}`,
      value: `${domVisits} visits/quarter`,
      quota: domVisits,
      resetPeriod: 'quarter',
      howToClaim: 'Show your card at the lounge entrance. Check eligible lounges on your card network lounge locator app.',
      accentColor: '#2F7A6D',
      verified: true,
      source: '',
      lastVerified: today,
      conditions: domCondition,
    });
  }

  // International / Priority Pass
  const intlPatterns = [
    /(\d+)\s*complimentary\s*(?:international\s*)?(?:lounge|Priority\s*Pass)\s*(?:visits?|access)\s*(?:per\s*)?(?:year|annually|calendar\s*year)/i,
    /Priority\s*Pass[^.]*?(\d+)\s*(?:complimentary|free)\s*(?:lounge\s*)?(?:visits?|access)/i,
  ];

  for (const pat of intlPatterns) {
    const m = text.match(pat);
    if (m) {
      const visits = parseInt(m[1]);
      benefits.push({
        id: `${cardId}-lounge-intl`,
        title: 'International Lounge via Priority Pass',
        category: 'lounge',
        description: `${visits} complimentary international airport lounge visits per year via Priority Pass. Priority Pass membership must be activated separately via your bank portal.`,
        value: `${visits} visits/year`,
        quota: visits,
        resetPeriod: 'year',
        howToClaim: 'Activate Priority Pass membership on your bank portal first. Then show Priority Pass card at international lounges.',
        accentColor: '#2F7A6D',
        verified: true,
        source: '',
        lastVerified: today,
        conditions: 'Activate Priority Pass membership before use.',
      });
      break;
    }
  }

  return benefits;
}

function parseCashback(text, cardId) {
  const benefits = [];
  const today = new Date().toISOString().split('T')[0];

  // Pattern: X% cashback on [merchant]
  const cbPatterns = [
    /(\d+(?:\.\d+)?)\s*%\s*cash\s*back\s*on\s*([A-Za-z0-9\s/&,]+?)(?:\s*\(|\.|\n|,\s*(?:and|or|\d))/gi,
    /(\d+(?:\.\d+)?)\s*%\s*(?:value\s*back|cashback|cash\s*back)\s*(?:on|at)\s*([A-Za-z0-9\s/&,]+?)(?:\.|,|\n)/gi,
  ];

  const seen = new Set();
  for (const pat of cbPatterns) {
    let m;
    while ((m = pat.exec(text)) !== null) {
      const rate = m[1];
      const merchant = m[2].trim().slice(0, 40);
      const key = `${rate}-${merchant.toLowerCase()}`;
      if (seen.has(key) || parseFloat(rate) < 1 || parseFloat(rate) > 30) continue;
      seen.add(key);

      // Look for cap
      const surrounding = text.slice(Math.max(0, m.index - 100), m.index + 200);
      const capMatch = surrounding.match(/(?:cap(?:ped)?|maximum|max\.?)\s*(?:of\s*)?[₹Rs.]*\s*([\d,]+)\s*(?:per\s*month|monthly|per\s*quarter)?/i);
      const cap = capMatch ? `Capped at ₹${parseInt(capMatch[1].replace(/,/g, '')).toLocaleString('en-IN')}` : '';

      benefits.push({
        id: `${cardId}-cb-${seen.size}`,
        title: `${rate}% Cashback on ${merchant}`,
        category: 'cashback',
        description: `${rate}% cashback on ${merchant} spends.${cap ? ' ' + cap + '.' : ''}`,
        value: `${rate}% back`,
        quota: null,
        resetPeriod: 'month',
        howToClaim: 'Cashback credited automatically to your card account or as reward points. Check statement for credit.',
        accentColor: '#C89B3C',
        verified: true,
        source: '',
        lastVerified: today,
        conditions: cap,
      });

      if (benefits.length >= 4) break; // cap per card to avoid noise
    }
    if (benefits.length >= 4) break;
  }

  return benefits;
}

function parseInsurance(text, cardId) {
  const benefits = [];
  const today = new Date().toISOString().split('T')[0];

  const insurancePatterns = [
    { regex: /air\s*accident(?:al)?\s*(?:death\s*)?(?:insurance|cover)[^.]*?(?:₹|Rs\.?)\s*([\d,]+)\s*(?:crore|lakh|lakhs?|L)/i, title: 'Air Accident Insurance Cover' },
    { regex: /personal\s*accident[^.]*?(?:₹|Rs\.?)\s*([\d,]+)\s*(?:crore|lakh|lakhs?|L)/i, title: 'Personal Accident Cover' },
    { regex: /(?:overseas?|travel|emergency)\s*(?:hospitali[sz]ation|medical)[^.]*?(?:₹|Rs\.?)\s*([\d,]+)\s*(?:crore|lakh|lakhs?|L)/i, title: 'Emergency Overseas Hospitalization Cover' },
    { regex: /purchase\s*protection[^.]*?(?:₹|Rs\.?)\s*([\d,]+)/i, title: 'Purchase Protection Cover' },
    { regex: /(?:lost\s*card|card\s*loss)\s*liability[^.]*?(?:₹|Rs\.?)\s*([\d,]+)/i, title: 'Lost Card Liability Cover' },
  ];

  for (const { regex, title } of insurancePatterns) {
    const m = text.match(regex);
    if (m) {
      const rawAmt = m[1].replace(/,/g, '');
      const isCrore = regex.source.includes('crore') || m[0].toLowerCase().includes('crore');
      const isLakh = m[0].toLowerCase().includes('lakh') || m[0].toLowerCase().includes(' l');
      const displayAmt = isCrore ? `₹${rawAmt} crore` : isLakh ? `₹${parseInt(rawAmt).toLocaleString('en-IN')} lakh` : `₹${parseInt(rawAmt).toLocaleString('en-IN')}`;

      benefits.push({
        id: `${cardId}-ins-${benefits.length + 1}`,
        title,
        category: 'insurance',
        description: `${title} of ${displayAmt}. Card must typically be used at least once in the preceding 45–90 days for cover to be active — check your card T&Cs.`,
        value: displayAmt + ' cover',
        quota: null,
        resetPeriod: 'year',
        howToClaim: 'Nominee or cardholder contacts the bank and insurance partner. Keep card active (at least one transaction in 45–90 days before claim). Raise claim with supporting documents within the stated window.',
        accentColor: '#2F7A6D',
        verified: true,
        source: '',
        lastVerified: today,
        conditions: 'Card must be active (recent transaction) for cover to apply. Verify exact activation conditions in your card T&Cs.',
      });
    }
  }

  return benefits;
}

function parseRewardPoints(text, cardId) {
  const benefits = [];
  const today = new Date().toISOString().split('T')[0];

  // X reward points per ₹Y
  const rpMatch = text.match(/(\d+)\s*(?:reward\s*)?points?\s*(?:on\s*every|per|for\s*every)\s*[₹Rs.]*\s*([\d,]+)\s*(?:spent|spend|retail\s*spend)?/i);
  if (rpMatch) {
    const pts = rpMatch[1];
    const per = rpMatch[2].replace(/,/g, '');

    // Also look for bonus multiplier
    const bonusMatch = text.match(/(\d+)X\s*(?:reward\s*)?points?\s*on\s*([A-Za-z\s/&,]+?)(?:\.|,|\n)/i);

    benefits.push({
      id: `${cardId}-rewards`,
      title: bonusMatch ? `${bonusMatch[1]}X Reward Points on ${bonusMatch[2].trim().slice(0, 30)}` : `${pts} Reward Points per ₹${parseInt(per).toLocaleString('en-IN')} Spent`,
      category: 'cashback',
      description: `Earn ${pts} reward points for every ₹${parseInt(per).toLocaleString('en-IN')} spent.${bonusMatch ? ` Get ${bonusMatch[1]}X points on ${bonusMatch[2].trim()}.` : ''} Check point redemption value and expiry on your bank portal.`,
      value: `${pts} pts / ₹${parseInt(per).toLocaleString('en-IN')}`,
      quota: null,
      resetPeriod: 'year',
      howToClaim: 'Reward points are credited automatically. Redeem via net banking, card portal, or partner merchant checkout.',
      accentColor: '#C89B3C',
      verified: true,
      source: '',
      lastVerified: today,
      conditions: 'Reward points may expire. Check validity and redemption rate on your card portal.',
    });
  }

  return benefits;
}

function parseFuel(text, cardId) {
  const benefits = [];
  const today = new Date().toISOString().split('T')[0];

  if (/fuel\s*surcharge\s*waiver/i.test(text)) {
    const pctMatch = text.match(/(\d+(?:\.\d+)?)\s*%\s*fuel\s*surcharge\s*waiver/i);
    const txnMatch = text.match(/(?:minimum|min\.?)\s*transaction\s*of\s*[₹Rs.]*\s*([\d,]+)\s*and\s*(?:maximum|max\.?)\s*(?:transaction\s*of\s*)?[₹Rs.]*\s*([\d,]+)/i);

    benefits.push({
      id: `${cardId}-fuel`,
      title: 'Fuel Surcharge Waiver',
      category: 'fuel',
      description: `${pctMatch ? pctMatch[1] + '% ' : ''}fuel surcharge waiver at fuel stations across India.${txnMatch ? ` On transactions between ₹${parseInt(txnMatch[1]).toLocaleString('en-IN')} and ₹${parseInt(txnMatch[2]).toLocaleString('en-IN')}.` : ''}`,
      value: `${pctMatch ? pctMatch[1] + '% ' : ''}surcharge waiver`,
      quota: null,
      resetPeriod: 'month',
      howToClaim: 'Pay fuel bill using this card. Waiver applied automatically at POS.',
      accentColor: '#C89B3C',
      verified: true,
      source: '',
      lastVerified: today,
      conditions: txnMatch ? `Valid on transactions between ₹${txnMatch[1]} and ₹${txnMatch[2]}.` : '',
    });
  }

  return benefits;
}

function parseMovieDiscounts(text, cardId) {
  const benefits = [];
  const today = new Date().toISOString().split('T')[0];

  const movieMatch = text.match(/(\d+)\s*(?:free|complimentary)\s*movie\s*ticket[^.]*?(?:per\s*month|monthly)/i)
    || text.match(/buy\s*1\s*get\s*1\s*(?:free)?\s*(?:movie|on\s*BookMyShow)/i);

  if (movieMatch) {
    const count = movieMatch[1] ? parseInt(movieMatch[1]) : 2;
    const capMatch = text.match(/(?:up\s*to|max\.?|worth)\s*[₹Rs.]*\s*([\d,]+)\s*(?:per\s*ticket|each)/i);

    benefits.push({
      id: `${cardId}-movie`,
      title: `${count} Free Movie Tickets per Month`,
      category: 'discount',
      description: `${count} complimentary movie tickets per month via BookMyShow.${capMatch ? ` Capped at ₹${parseInt(capMatch[1]).toLocaleString('en-IN')} per ticket.` : ''}`,
      value: `${count} tickets/month`,
      quota: count,
      resetPeriod: 'month',
      howToClaim: 'Pay on BookMyShow using this card. Discount applied at checkout. Check eligible films and screens in BookMyShow offer section.',
      accentColor: '#E2593A',
      verified: true,
      source: '',
      lastVerified: today,
      conditions: capMatch ? `Maximum ₹${capMatch[1]} discount per ticket.` : '',
    });
  }

  return benefits;
}

// ─────────────────────────────────────────────
// MAIN PARSER — runs all parsers on page text
// ─────────────────────────────────────────────
function parseAllBenefits(text, card) {
  const all = [
    ...parseLounge(text, card.id),
    ...parseCashback(text, card.id),
    ...parseInsurance(text, card.id),
    ...parseRewardPoints(text, card.id),
    ...parseFuel(text, card.id),
    ...parseMovieDiscounts(text, card.id),
  ];

  // Stamp each benefit with the source URL and normalize for Product/Benefit interfaces
  return all.map((b) => normalizeBenefit({ ...b, source: card.urls[0] }));
}

function normalizeBenefit(b) {
  const { conditions, ...rest } = b;
  let description = rest.description || '';
  if (conditions && String(conditions).trim()) {
    description = `${description.trim()}${description.endsWith('.') ? '' : '.'} ${conditions}`.trim();
  }
  return {
    id: rest.id,
    title: rest.title,
    category: rest.category,
    description,
    value: rest.value,
    quota: rest.quota ?? null,
    resetPeriod: rest.resetPeriod,
    howToClaim: rest.howToClaim,
    accentColor: rest.accentColor,
    verified: rest.verified ?? true,
    source: rest.source || undefined,
    lastVerified: rest.lastVerified || undefined,
  };
}

// ─────────────────────────────────────────────
// PRODUCTS.TS WRITER
// ─────────────────────────────────────────────
function toTS(products) {
  const today = new Date().toISOString().split('T')[0];

  return `/**
 * AUTO-GENERATED by scripts/fetch-card-benefits.mjs
 * Last run: ${today}
 *
 * Benefits are scraped from official issuer pages and parsed automatically.
 * Conditions (spend thresholds, caps, activation requirements) are folded
 * into descriptions where detected on the source page.
 *
 * Card benefits change frequently. Always verify current terms directly
 * with your card issuer before making financial decisions.
 *
 * Rewards Radar / Red Evolve Technologies Pvt. Ltd. is not affiliated
 * with any bank, card network, telecom operator, or insurer.
 */

export const DATA_DISCLAIMER =
  'Benefit information is scraped from official issuer pages and parsed automatically. Terms change frequently — always verify with your card issuer before relying on this data. Last database update: ${today}.';

export type ResetPeriod = 'month' | 'quarter' | 'year' | 'once' | 'per-recharge';
export type BenefitCategory =
  | 'lounge'
  | 'insurance'
  | 'cashback'
  | 'ott'
  | 'discount'
  | 'health'
  | 'golf'
  | 'fuel'
  | 'dining'
  | 'travel'
  | 'other';
export type ProductType =
  | 'credit-card'
  | 'debit-card'
  | 'upi'
  | 'telecom'
  | 'health-insurance'
  | 'motor-insurance'
  | 'term-insurance';

export interface Benefit {
  id: string;
  title: string;
  category: BenefitCategory;
  description: string;
  value: string;
  quota: number | null;
  resetPeriod: ResetPeriod;
  howToClaim: string;
  accentColor: string;
  verified?: boolean;
  source?: string;
  lastVerified?: string;
}

export interface RewardLogic {
  categories: string[];
  rewardRate: string;
  rewardType: 'cashback' | 'points' | 'miles' | 'voucher';
  pointValue?: string;
  onlineBonusRate?: string;
  offlineBonusRate?: string;
  fuelRate?: string;
  diningRate?: string;
  travelRate?: string;
  groceryRate?: string;
}

export interface Product {
  id: string;
  type: ProductType;
  issuer: string;
  name: string;
  network?: 'Visa' | 'Mastercard' | 'Rupay' | 'Amex' | 'Diners';
  annualFee?: number;
  joiningFee?: number;
  annualValueEstimate: number;
  benefits: Benefit[];
  rewardLogic?: RewardLogic;
}

export const products: Product[] = ${JSON.stringify(products, null, 2)};

export function getProductsByType(type: ProductType): Product[] {
  return products.filter((p) => p.type === type);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
`;
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log('\n🔍 Benefit Radar — Card Benefits Scraper');
  console.log('─'.repeat(50));

  const { mkdirSync } = await import('fs');
  mkdirSync(CACHE_DIR, { recursive: true });

  const results = [];
  const reports = [];
  let totalBenefits = 0;

  for (const card of SOURCES) {
    console.log(`\n📄 ${card.name}`);

    const allUrls = [...card.urls, ...(card.fallbackUrls || [])];
    const { text: combinedText, url: fetchedUrl, usedFallback, charCount } =
      await fetchWithFallbacks(allUrls);

    if (!combinedText.trim()) {
      console.log('  ⚠  No content fetched — skipping');
      reports.push({
        id: card.id,
        name: card.name,
        status: 'failed',
        charCount: 0,
        benefitCount: 0,
        url: null,
      });
      continue;
    }

    if (usedFallback) {
      console.log(`  ↪  Used fallback URL: ${fetchedUrl}`);
    }

    const cardWithSource = { ...card, urls: [fetchedUrl || card.urls[0]] };
    const benefits = parseAllBenefits(combinedText, cardWithSource);
    console.log(`  ✓  Found ${benefits.length} benefit(s): ${benefits.map((b) => b.category).join(', ') || 'none'}`);
    totalBenefits += benefits.length;

    reports.push({
      id: card.id,
      name: card.name,
      status: usedFallback ? 'fallback' : 'success',
      charCount,
      benefitCount: benefits.length,
      url: fetchedUrl,
    });

    // Estimate annual value from benefits
    const annualValueEstimate = benefits.reduce((sum, b) => {
      if (b.category === 'lounge') {
        const visits = b.quota ? (b.resetPeriod === 'quarter' ? b.quota * 4 : b.quota) : 8;
        return sum + visits * 800;
      }
      return sum;
    }, 0);

    results.push({
      id: card.id,
      type: card.type || 'credit-card',
      issuer: card.issuer,
      name: card.name,
      network: card.network,
      annualFee: card.annualFee,
      annualValueEstimate,
      benefits,
    });

    // Polite delay between cards
    await new Promise((r) => setTimeout(r, 1200));
  }

  // Write output
  const ts = toTS(results);
  writeFileSync(OUT_PATH, ts, 'utf8');

  console.log('\n─'.repeat(50));
  console.log(`✅ Done. ${results.length} cards, ${totalBenefits} benefits written to src/data/products.ts`);
  console.log(`📁 Page cache saved in scripts/.cache/ (reused for 24h)`);

  console.log('\n📊 Fetch Summary');
  console.log('─'.repeat(70));
  for (const r of reports) {
    if (r.status === 'success') {
      console.log(`✅ ${r.name}: ${r.charCount.toLocaleString()} chars, ${r.benefitCount} benefit(s) parsed`);
    } else if (r.status === 'fallback') {
      console.log(
        `⚠️  ${r.name}: used fallback (${r.url}), ${r.charCount.toLocaleString()} chars, ${r.benefitCount} benefit(s) parsed`,
      );
    } else {
      console.log(`❌ ${r.name}: failed (all URLs returned empty or < 500 chars)`);
    }
  }

  const failed = reports.filter((r) => r.status === 'failed');
  const zeroBenefits = reports.filter((r) => r.status !== 'failed' && r.benefitCount === 0);
  if (failed.length > 0 || zeroBenefits.length > 0) {
    console.log('\n⚠  Cards needing manual data entry:');
    for (const r of failed) console.log(`   • ${r.id} — fetch failed`);
    for (const r of zeroBenefits) console.log(`   • ${r.id} — fetched but 0 benefits parsed`);
  }

  console.log('\n⚠  Review the output before committing — parser catches most');
  console.log('   standard patterns but edge cases need manual review.');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
