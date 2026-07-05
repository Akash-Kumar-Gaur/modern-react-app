import {
  getRewardSuggestions,
  type AmountRangeId as ProductAmountRangeId,
  type RewardSuggestion,
} from "../data/products";

export type TxType =
  | "offline"
  | "online"
  | "fuel"
  | "travel"
  | "dining"
  | "pharmacy"
  | "hospital";

export type Audience = "personal" | "business";

export type AmountRangeId = ProductAmountRangeId;

export type PaymentType = "Credit Card" | "Debit Card" | "UPI";

export type RewardEntry = {
  name: string;
  paymentType: PaymentType;
  rate: string;
  ratePercent: number;
  howTo: string;
  brandColor: string;
  network: "Visa" | "Mastercard" | "Rupay";
};

export type RankedReward = RewardEntry & {
  rank: number;
  estimatedReward: number;
};

export type RewardSearch = {
  audience: Audience;
  txType: TxType;
  category: string;
  amountRange: AmountRangeId;
  savedAt: string;
};

export const STORAGE_KEY_REWARD_SEARCHES = "br-reward-searches";

export const TX_TYPE_OPTIONS: { id: TxType; label: string }[] = [
  { id: "offline", label: "🏪 Offline" },
  { id: "online", label: "🌐 Online" },
  { id: "fuel", label: "⛽ Fuel" },
  { id: "travel", label: "✈️ Travel" },
  { id: "dining", label: "🍽️ Dining" },
  { id: "pharmacy", label: "💊 Pharmacy" },
  { id: "hospital", label: "🏥 Hospital" },
];

export const CATEGORY_OPTIONS: Record<TxType, { id: string; label: string }[]> = {
  offline: [
    { id: "grocery", label: "Grocery" },
    { id: "gold-jewellery", label: "Gold/Jewellery" },
    { id: "electronics", label: "Electronics" },
    { id: "clothing", label: "Clothing" },
    { id: "general", label: "General" },
  ],
  online: [
    { id: "amazon", label: "Amazon" },
    { id: "flipkart", label: "Flipkart" },
    { id: "swiggy-zomato", label: "Swiggy/Zomato" },
    { id: "travel-booking", label: "Travel booking" },
    { id: "subscription", label: "Subscription" },
    { id: "general-ecommerce", label: "General ecommerce" },
  ],
  fuel: [
    { id: "petrol", label: "Petrol" },
    { id: "diesel", label: "Diesel" },
    { id: "cng", label: "CNG" },
    { id: "ev-charging", label: "EV Charging" },
  ],
  travel: [
    { id: "flights", label: "Flights" },
    { id: "hotels", label: "Hotels" },
    { id: "international", label: "International" },
    { id: "train-bus", label: "Train/Bus" },
  ],
  dining: [
    { id: "restaurant", label: "Restaurant" },
    { id: "cafe", label: "Cafe" },
    { id: "food-delivery", label: "Food delivery" },
  ],
  pharmacy: [
    { id: "medicine", label: "Medicine" },
    { id: "health-products", label: "Health products" },
  ],
  hospital: [
    { id: "opd", label: "OPD" },
    { id: "surgery", label: "Surgery/Hospitalization" },
    { id: "diagnostic", label: "Diagnostic lab" },
  ],
};

export const AMOUNT_RANGE_OPTIONS: { id: AmountRangeId; label: string; midpoint: number }[] = [
  { id: "under-500", label: "Under ₹500", midpoint: 300 },
  { id: "500-2000", label: "₹500–2,000", midpoint: 1250 },
  { id: "2000-10000", label: "₹2,000–10,000", midpoint: 6000 },
  { id: "10000-50000", label: "₹10,000–50,000", midpoint: 30000 },
  { id: "50000-plus", label: "₹50,000+", midpoint: 75000 },
];

function toRankedReward(s: RewardSuggestion): RankedReward {
  const network = (["Visa", "Mastercard", "Rupay"].includes(s.network)
    ? s.network
    : "Visa") as RankedReward["network"];
  return {
    rank: s.rank,
    name: s.name,
    paymentType: s.paymentType,
    rate: s.rate,
    ratePercent: s.ratePercent,
    howTo: s.howTo,
    brandColor: s.brandColor,
    network,
    estimatedReward: s.estimatedReward,
  };
}

export function getAmountMidpoint(amountRange: AmountRangeId): number {
  return AMOUNT_RANGE_OPTIONS.find((r) => r.id === amountRange)?.midpoint ?? 6000;
}

export function estimateReward(amount: number, ratePercent: number): number {
  return Math.round((amount * ratePercent) / 100);
}

export function getRewards(
  txType: TxType,
  category: string,
  amountRange: AmountRangeId,
  options?: { audience?: Audience; limit?: number },
): RankedReward[] {
  const audience = options?.audience ?? "personal";
  const limit = options?.limit ?? 3;
  return getRewardSuggestions(txType, category, amountRange, audience, limit).map(toRankedReward);
}

export function getAllRewards(
  txType: TxType,
  category: string,
  amountRange: AmountRangeId,
  audience: Audience = "personal",
): RankedReward[] {
  return getRewards(txType, category, amountRange, { audience, limit: 99 });
}

export function saveRewardSearch(search: Omit<RewardSearch, "savedAt">): void {
  if (typeof window === "undefined") return;
  const entry: RewardSearch = { ...search, savedAt: new Date().toISOString() };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REWARD_SEARCHES);
    const list: RewardSearch[] = raw ? (JSON.parse(raw) as RewardSearch[]) : [];
    const next = [entry, ...list].slice(0, 10);
    localStorage.setItem(STORAGE_KEY_REWARD_SEARCHES, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export const RANK_LABELS = ["①", "②", "③", "④", "⑤"] as const;
