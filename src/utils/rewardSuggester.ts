export type PaymentType = 'Credit Card' | 'Debit Card' | 'UPI';

export type TxType =
  | 'offline'
  | 'online'
  | 'fuel'
  | 'travel'
  | 'dining'
  | 'pharmacy'
  | 'hospital';

export type Audience = 'personal' | 'business';

export type AmountRangeId =
  | 'under-500'
  | '500-2000'
  | '2000-10000'
  | '10000-50000'
  | '50000-plus';

export interface RewardResult {
  rank: number;
  cardName: string;
  paymentType: PaymentType;
  rewardRate: string;
  estimatedReward: string;
  howToGet: string;
  issuer: string;
}

export const txTypePills: { label: string; value: TxType }[] = [
  { label: '🏪 Offline', value: 'offline' },
  { label: '🌐 Online', value: 'online' },
  { label: '⛽ Fuel', value: 'fuel' },
  { label: '✈️ Travel', value: 'travel' },
  { label: '🍽️ Dining', value: 'dining' },
  { label: '💊 Pharmacy', value: 'pharmacy' },
  { label: '🏥 Hospital', value: 'hospital' },
];

export const categoryPills: Record<TxType, { label: string; value: string }[]> = {
  offline: [
    { label: 'Grocery', value: 'grocery' },
    { label: 'Gold / Jewellery', value: 'gold' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'General', value: 'general' },
  ],
  online: [
    { label: 'Amazon', value: 'amazon' },
    { label: 'Flipkart', value: 'flipkart' },
    { label: 'Swiggy / Zomato', value: 'food-delivery' },
    { label: 'Travel booking', value: 'travel-booking' },
    { label: 'Subscription', value: 'subscription' },
    { label: 'General ecommerce', value: 'general-online' },
  ],
  fuel: [
    { label: 'Petrol', value: 'petrol' },
    { label: 'Diesel', value: 'diesel' },
    { label: 'CNG', value: 'cng' },
    { label: 'EV Charging', value: 'ev' },
  ],
  travel: [
    { label: 'Flights', value: 'flights' },
    { label: 'Hotels', value: 'hotels' },
    { label: 'International', value: 'international' },
    { label: 'Train / Bus', value: 'train' },
  ],
  dining: [
    { label: 'Restaurant', value: 'restaurant' },
    { label: 'Café', value: 'cafe' },
    { label: 'Food delivery', value: 'food-delivery' },
  ],
  pharmacy: [
    { label: 'Medicine', value: 'medicine' },
    { label: 'Health products', value: 'health-products' },
  ],
  hospital: [
    { label: 'OPD', value: 'opd' },
    { label: 'Surgery / Hospitalization', value: 'surgery' },
    { label: 'Diagnostic lab', value: 'diagnostic' },
  ],
};

export const amountPills: { label: string; value: AmountRangeId }[] = [
  { label: 'Under ₹500', value: 'under-500' },
  { label: '₹500 – 2,000', value: '500-2000' },
  { label: '₹2,000 – 10,000', value: '2000-10000' },
  { label: '₹10,000 – 50,000', value: '10000-50000' },
  { label: '₹50,000+', value: '50000-plus' },
];

export const payerPills: { label: string; value: Audience }[] = [
  { label: 'Personal', value: 'personal' },
  { label: 'Business', value: 'business' },
];

export const EMPTY_COMBO_MESSAGE =
  'No specific recommendation for this combination — use a card with the highest general cashback rate like SBI Cashback or HDFC Regalia.';

export function normalizeKey(s: string): string {
  return s
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✈⛽🌐🏪💊🏥🍽]/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
}

export function getAmountMidpoint(amountRange: string): number {
  const amt = normalizeKey(amountRange);
  const midpoints: Record<string, number> = {
    'under-500': 300,
    '500-2000': 1250,
    '2000-10000': 6000,
    '10000-50000': 30000,
    '50000-plus': 75000,
  };
  return midpoints[amt] ?? 5000;
}

export function calcReward(rate: number, amount: number): string {
  const reward = Math.round((rate / 100) * amount);
  return reward >= 1000
    ? `≈ ₹${(reward / 1000).toFixed(1)}K back`
    : `≈ ₹${reward} back`;
}

const REWARD_TABLE: Record<string, RewardResult[]> = {
  'online:amazon': [
    { rank: 1, cardName: 'Amazon Pay ICICI Credit Card', issuer: 'ICICI Bank', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: '5% cashback for Prime members, 3% for non-Prime. No cap. Credited to Amazon Pay balance.' },
    { rank: 2, cardName: 'HDFC Millennia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: '5% cashback on Amazon. Capped at ₹1,000/month across all partner apps.' },
    { rank: 3, cardName: 'Google Pay UPI', issuer: 'Google', paymentType: 'UPI', rewardRate: '~1%', estimatedReward: '', howToGet: 'Occasional scratch card rewards. Not guaranteed — lottery model.' },
  ],
  'online:flipkart': [
    { rank: 1, cardName: 'Axis Flipkart Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: '5% cashback on Flipkart and Cleartrip. 7.5% on Myntra. No cap.' },
    { rank: 2, cardName: 'SBI Cashback Credit Card', issuer: 'SBI Card', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: '5% on all online spends including Flipkart. Capped at ₹5,000/month.' },
    { rank: 3, cardName: 'HDFC Millennia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: '5% on Flipkart. Capped at ₹1,000/month combined across partners.' },
  ],
  'online:food-delivery': [
    { rank: 1, cardName: 'Axis Ace Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: '5% cashback on Swiggy and Zomato. No upper cap on this category.' },
    { rank: 2, cardName: 'HDFC Millennia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: '5% on Swiggy/Zomato. Capped at ₹1,000/month combined.' },
    { rank: 3, cardName: 'Axis Flipkart Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '4%', estimatedReward: '', howToGet: '4% cashback on Swiggy via preferred partner rate.' },
  ],
  'online:travel-booking': [
    { rank: 1, cardName: 'Axis Magnus Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '~5%', estimatedReward: '', howToGet: '5X EDGE points on Travel EDGE portal. 1 EDGE Mile = ₹1 for flights. Requires ₹50K/quarter spend for lounge access.' },
    { rank: 2, cardName: 'HDFC Diners Black Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '3.3%', estimatedReward: '', howToGet: '5 reward points per ₹150. 10X on SmartBuy travel bookings.' },
    { rank: 3, cardName: 'IDFC FIRST Wealth Credit Card', issuer: 'IDFC FIRST Bank', paymentType: 'Credit Card', rewardRate: '~2.5%', estimatedReward: '', howToGet: '10X points on travel spends. 1 point = ₹0.25. Points never expire.' },
  ],
  'online:subscription': [
    { rank: 1, cardName: 'Amazon Pay ICICI Credit Card', issuer: 'ICICI Bank', paymentType: 'Credit Card', rewardRate: '2%', estimatedReward: '', howToGet: '2% cashback on 200+ partner merchants including streaming services.' },
    { rank: 2, cardName: 'SBI Cashback Credit Card', issuer: 'SBI Card', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: '5% on all online spends including subscriptions. Capped ₹5,000/month.' },
    { rank: 3, cardName: 'HDFC Millennia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '1%', estimatedReward: '', howToGet: '1% cashback on spends not in partner category.' },
  ],
  'online:general-online': [
    { rank: 1, cardName: 'SBI Cashback Credit Card', issuer: 'SBI Card', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: '5% on ALL online spends — widest coverage. Capped ₹5,000/month.' },
    { rank: 2, cardName: 'Axis Ace Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '2%', estimatedReward: '', howToGet: '2% cashback on all other online spends not in 5%/4% categories.' },
    { rank: 3, cardName: 'Amazon Pay ICICI Credit Card', issuer: 'ICICI Bank', paymentType: 'Credit Card', rewardRate: '1%', estimatedReward: '', howToGet: '1% cashback on all spends not in Amazon/partner category.' },
  ],
  'offline:grocery': [
    { rank: 1, cardName: 'RBL Shoprite Credit Card', issuer: 'RBL Bank', paymentType: 'Credit Card', rewardRate: '5% (Saturdays)', estimatedReward: '', howToGet: '20X reward points at grocery stores on Saturdays only. 2X on weekdays.' },
    { rank: 2, cardName: 'HDFC Regalia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '~2%', estimatedReward: '', howToGet: '4 reward points per ₹150. Requires ₹1L quarterly spend for lounge unlock.' },
    { rank: 3, cardName: 'SBI Card ELITE', issuer: 'SBI Card', paymentType: 'Credit Card', rewardRate: '~1.25%', estimatedReward: '', howToGet: '5X points on grocery. 1 point = ₹0.25.' },
  ],
  'offline:gold': [
    { rank: 1, cardName: 'HDFC Regalia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '~2%', estimatedReward: '', howToGet: '4 reward points per ₹150 on gold/jewellery purchases.' },
    { rank: 2, cardName: 'Axis Magnus Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '0%', estimatedReward: '', howToGet: 'NOTE: Axis Magnus explicitly excludes Gold & Jewellery from reward points. Use a different card for gold purchases.' },
    { rank: 3, cardName: 'HDFC Millennia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '~0.5%', estimatedReward: '', howToGet: '1% cashback on offline spends. Jewellery may be excluded — verify with HDFC.' },
  ],
  'offline:electronics': [
    { rank: 1, cardName: 'SBI Cashback Credit Card', issuer: 'SBI Card', paymentType: 'Credit Card', rewardRate: '1%', estimatedReward: '', howToGet: '1% on offline spends. Consider buying electronics online for 5% rate instead.' },
    { rank: 2, cardName: 'HDFC Regalia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '~2%', estimatedReward: '', howToGet: '4 reward points per ₹150 on retail.' },
    { rank: 3, cardName: 'Axis Magnus Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '~3%', estimatedReward: '', howToGet: '6 EDGE Miles per ₹200 on offline spends. Best for large purchases.' },
  ],
  'offline:clothing': [
    { rank: 1, cardName: 'Axis Flipkart Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '7.5% (Myntra)', estimatedReward: '', howToGet: '7.5% cashback on Myntra. Consider buying clothing online via Myntra for maximum reward.' },
    { rank: 2, cardName: 'HDFC Millennia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '5% (Myntra online)', estimatedReward: '', howToGet: '5% on Myntra online. 1% on other offline clothing.' },
    { rank: 3, cardName: 'SBI Card ELITE', issuer: 'SBI Card', paymentType: 'Credit Card', rewardRate: '~1.25%', estimatedReward: '', howToGet: '5X points on departmental stores. 1 point = ₹0.25.' },
  ],
  'offline:general': [
    { rank: 1, cardName: 'Axis Magnus Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '~3%', estimatedReward: '', howToGet: '6 EDGE Miles per ₹200 offline. Best value for high-ticket offline purchases.' },
    { rank: 2, cardName: 'HDFC Regalia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '~2%', estimatedReward: '', howToGet: '4 reward points per ₹150 on all retail. Requires ₹1L/quarter for full benefits.' },
    { rank: 3, cardName: 'IDFC FIRST Wealth Credit Card', issuer: 'IDFC FIRST Bank', paymentType: 'Credit Card', rewardRate: '~0.75%', estimatedReward: '', howToGet: '3X points on regular spends. Zero annual fee — good backup card for general use.' },
  ],
  'fuel:petrol': [
    { rank: 1, cardName: 'BPCL SBI Credit Card', issuer: 'SBI Card', paymentType: 'Credit Card', rewardRate: '4.25%', estimatedReward: '', howToGet: '13X reward points at BPCL pumps + 1% surcharge waiver = 4.25% effective value. Capped at 1,300 pts/month.' },
    { rank: 2, cardName: 'HDFC Regalia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '1%', estimatedReward: '', howToGet: '1% fuel surcharge waiver on transactions ₹400–₹5,000.' },
    { rank: 3, cardName: 'Axis Ace Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '1%', estimatedReward: '', howToGet: '1% fuel surcharge waiver. No additional cashback on fuel.' },
  ],
  'fuel:diesel': [
    { rank: 1, cardName: 'BPCL SBI Credit Card', issuer: 'SBI Card', paymentType: 'Credit Card', rewardRate: '4.25%', estimatedReward: '', howToGet: '4.25% effective value at BPCL pumps for diesel too.' },
    { rank: 2, cardName: 'HDFC Regalia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '1%', estimatedReward: '', howToGet: '1% surcharge waiver.' },
    { rank: 3, cardName: 'HDFC Millennia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '1%', estimatedReward: '', howToGet: '1% fuel surcharge waiver.' },
  ],
  'fuel:cng': [
    { rank: 1, cardName: 'SBI Cashback Credit Card', issuer: 'SBI Card', paymentType: 'Credit Card', rewardRate: '1%', estimatedReward: '', howToGet: 'CNG not eligible for fuel-specific rewards on most cards. 1% offline cashback on SBI Cashback.' },
    { rank: 2, cardName: 'HDFC Regalia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '~2%', estimatedReward: '', howToGet: '4 reward points per ₹150 as general retail spend.' },
    { rank: 3, cardName: 'PhonePe UPI', issuer: 'PhonePe', paymentType: 'UPI', rewardRate: 'Varies', estimatedReward: '', howToGet: 'Occasional CNG-specific offers on PhonePe. Check PhonePe offers tab before paying.' },
  ],
  'fuel:ev': [
    { rank: 1, cardName: 'SBI Cashback Credit Card', issuer: 'SBI Card', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: 'EV charging via apps/online qualifies as online spend — 5% cashback.' },
    { rank: 2, cardName: 'Axis Ace Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '4%', estimatedReward: '', howToGet: 'Pay EV charging via Google Pay bill payment — 4% cashback.' },
    { rank: 3, cardName: 'Amazon Pay ICICI Credit Card', issuer: 'ICICI Bank', paymentType: 'Credit Card', rewardRate: '2%', estimatedReward: '', howToGet: '2% at partner EV charging networks linked to Amazon Pay.' },
  ],
  'travel:flights': [
    { rank: 1, cardName: 'Axis Magnus Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '~5%', estimatedReward: '', howToGet: '5X EDGE Miles on Travel EDGE portal. 1 Mile = ₹1 for flight redemption.' },
    { rank: 2, cardName: 'HDFC Diners Black Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '3.3%', estimatedReward: '', howToGet: '5 points per ₹150. 10X on SmartBuy for flights. Discontinued but existing cardholders keep benefits.' },
    { rank: 3, cardName: 'IDFC FIRST Wealth Credit Card', issuer: 'IDFC FIRST Bank', paymentType: 'Credit Card', rewardRate: '~2.5%', estimatedReward: '', howToGet: '10X on travel. 20% bonus on flight bookings via IDFC app. Zero annual fee.' },
  ],
  'travel:hotels': [
    { rank: 1, cardName: 'HDFC Regalia Gold Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '~2%', estimatedReward: '', howToGet: 'Complimentary MMT Black Gold + Swiggy One membership. 4 pts/₹150.' },
    { rank: 2, cardName: 'Axis Magnus Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '~5%', estimatedReward: '', howToGet: '15% discount at Trident/Oberoi hotels. EDGE Miles on hotel bookings via Travel EDGE.' },
    { rank: 3, cardName: 'HDFC Diners Black Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '3.3%', estimatedReward: '', howToGet: 'Club Marriott membership + 10X points on SmartBuy hotel bookings.' },
  ],
  'travel:international': [
    { rank: 1, cardName: 'Axis Magnus Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '~5%', estimatedReward: '', howToGet: '12 EDGE Miles per ₹200 online. Low 2% forex markup. Unlimited international lounge access.' },
    { rank: 2, cardName: 'HDFC Diners Black Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '3.3%', estimatedReward: '', howToGet: 'Low 2% forex markup. Unlimited international lounge via Diners Club.' },
    { rank: 3, cardName: 'IDFC FIRST Wealth Credit Card', issuer: 'IDFC FIRST Bank', paymentType: 'Credit Card', rewardRate: '~2.5%', estimatedReward: '', howToGet: 'Only 1.5% forex markup — lowest among featured cards. 10X on international spends.' },
  ],
  'travel:train': [
    { rank: 1, cardName: 'SBI Cashback Credit Card', issuer: 'SBI Card', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: '5% on IRCTC online bookings as general online spend.' },
    { rank: 2, cardName: 'Amazon Pay ICICI Credit Card', issuer: 'ICICI Bank', paymentType: 'Credit Card', rewardRate: '2%', estimatedReward: '', howToGet: '2% via Amazon Pay if booking through a partner travel platform.' },
    { rank: 3, cardName: 'BHIM UPI', issuer: 'NPCI', paymentType: 'UPI', rewardRate: '0%', estimatedReward: '', howToGet: 'No cashback but zero charges. Safe for IRCTC bookings.' },
  ],
  'dining:restaurant': [
    { rank: 1, cardName: 'SBI Card ELITE', issuer: 'SBI Card', paymentType: 'Credit Card', rewardRate: '~1.25%', estimatedReward: '', howToGet: '5X reward points on dining. 1 point = ₹0.25. Plus up to 25% discount at partner restaurants (Amex variant).' },
    { rank: 2, cardName: 'Axis Magnus Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '~3% + discount', estimatedReward: '', howToGet: '15% off at 4,000+ restaurants via Dining Delights. Plus EDGE Miles on spend.' },
    { rank: 3, cardName: 'IDFC FIRST Wealth Credit Card', issuer: 'IDFC FIRST Bank', paymentType: 'Credit Card', rewardRate: '~2.5%', estimatedReward: '', howToGet: '10X points on dining. Zero annual fee.' },
  ],
  'dining:cafe': [
    { rank: 1, cardName: 'SBI Cashback Credit Card', issuer: 'SBI Card', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: 'If paying via café app or website — 5% online cashback.' },
    { rank: 2, cardName: 'Axis Ace Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '2%', estimatedReward: '', howToGet: '2% on all offline spends at cafes.' },
    { rank: 3, cardName: 'HDFC Regalia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '~2%', estimatedReward: '', howToGet: '4 reward points per ₹150 on dining.' },
  ],
  'dining:food-delivery': [
    { rank: 1, cardName: 'Axis Ace Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: '5% cashback on Swiggy and Zomato. No cap on this category.' },
    { rank: 2, cardName: 'HDFC Millennia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: '5% on Swiggy/Zomato. Capped ₹1,000/month combined.' },
    { rank: 3, cardName: 'Axis Flipkart Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '4%', estimatedReward: '', howToGet: '4% on Swiggy deliveries as preferred partner.' },
  ],
  'pharmacy:medicine': [
    { rank: 1, cardName: 'SBI Cashback Credit Card', issuer: 'SBI Card', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: '5% on online medicine orders (1mg, Netmeds, PharmEasy).' },
    { rank: 2, cardName: 'Amazon Pay ICICI Credit Card', issuer: 'ICICI Bank', paymentType: 'Credit Card', rewardRate: '2%', estimatedReward: '', howToGet: '2% on 1mg via Amazon Pay partner merchants.' },
    { rank: 3, cardName: 'HDFC Millennia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: '5% on Netmeds if listed as partner. Verify in HDFC portal.' },
  ],
  'pharmacy:health-products': [
    { rank: 1, cardName: 'SBI Cashback Credit Card', issuer: 'SBI Card', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: '5% on all online health product purchases.' },
    { rank: 2, cardName: 'Axis Ace Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '2%', estimatedReward: '', howToGet: '2% on all other online spends.' },
    { rank: 3, cardName: 'HDFC Regalia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '~2%', estimatedReward: '', howToGet: '4 points per ₹150 on retail.' },
  ],
  'hospital:opd': [
    { rank: 1, cardName: 'SBI Cashback Credit Card', issuer: 'SBI Card', paymentType: 'Credit Card', rewardRate: '1%', estimatedReward: '', howToGet: '1% offline cashback at hospitals/clinics.' },
    { rank: 2, cardName: 'HDFC Regalia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '~2%', estimatedReward: '', howToGet: '4 reward points per ₹150.' },
    { rank: 3, cardName: 'PhonePe UPI', issuer: 'PhonePe', paymentType: 'UPI', rewardRate: 'Varies', estimatedReward: '', howToGet: 'Check PhonePe health offers tab for hospital-specific cashback deals.' },
  ],
  'hospital:surgery': [
    { rank: 1, cardName: 'Axis Magnus Credit Card', issuer: 'Axis Bank', paymentType: 'Credit Card', rewardRate: '~3%', estimatedReward: '', howToGet: '6 EDGE Miles per ₹200 on high-value hospital bills. Best for large amounts.' },
    { rank: 2, cardName: 'HDFC Diners Black Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '3.3%', estimatedReward: '', howToGet: '5 points per ₹150 on hospital bills. Note: insurance spends capped at 5,000 pts/month.' },
    { rank: 3, cardName: 'HDFC Regalia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '~2%', estimatedReward: '', howToGet: '4 reward points per ₹150 on hospital bills.' },
  ],
  'hospital:diagnostic': [
    { rank: 1, cardName: 'SBI Cashback Credit Card', issuer: 'SBI Card', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: '5% if booked via online health platforms (1mg, Practo lab tests).' },
    { rank: 2, cardName: 'Amazon Pay ICICI Credit Card', issuer: 'ICICI Bank', paymentType: 'Credit Card', rewardRate: '2%', estimatedReward: '', howToGet: '2% on 1mg via Amazon Pay.' },
    { rank: 3, cardName: 'HDFC Millennia Credit Card', issuer: 'HDFC Bank', paymentType: 'Credit Card', rewardRate: '5%', estimatedReward: '', howToGet: '5% if lab is listed as a partner app. Verify eligibility.' },
  ],
};

function enrichResults(results: RewardResult[], amountRange: string): RewardResult[] {
  const amount = getAmountMidpoint(amountRange);
  return results.map((r) => {
    const rateMatch = r.rewardRate.match(/(\d+(?:\.\d+)?)/);
    const rate = rateMatch ? parseFloat(rateMatch[1]) : 1;
    const estimatedReward =
      r.rewardRate === 'Varies' || r.rewardRate === '0%'
        ? 'Varies'
        : calcReward(rate, amount);
    return { ...r, estimatedReward };
  });
}

export function getRewards(
  txType: string,
  category: string,
  amountRange: string,
  payerType = 'personal',
  maxResults = 3,
): RewardResult[] {
  void payerType;
  const tx = normalizeKey(txType);
  const cat = normalizeKey(category);
  const amt = normalizeKey(amountRange);
  void amt;

  const key = `${tx}:${cat}`;
  const results = REWARD_TABLE[key];
  if (!results) return [];

  return enrichResults(results, amountRange).slice(0, maxResults);
}

export function getAllRewards(
  txType: string,
  category: string,
  amountRange: string,
  payerType = 'personal',
): RewardResult[] {
  return getRewards(txType, category, amountRange, payerType, 99);
}
