import {
  amountPills,
  categoryPills,
  getAllRewards as getAllRewardsFromTable,
  getAmountMidpoint,
  getRewards as getRewardsFromTable,
  payerPills,
  txTypePills,
  type AmountRangeId,
  type Audience,
  type PaymentType,
  type RewardResult,
  type TxType,
} from '../utils/rewardSuggester';

export type { AmountRangeId, Audience, PaymentType, TxType };

export type RewardEntry = {
  name: string;
  paymentType: PaymentType;
  rate: string;
  ratePercent: number;
  howTo: string;
  brandColor: string;
  network: 'Visa' | 'Mastercard' | 'Rupay';
};

export type RankedReward = RewardEntry & {
  rank: number;
  estimatedReward: number;
  estimatedRewardLabel: string;
};

export type RewardSearch = {
  audience: Audience;
  txType: TxType;
  category: string;
  amountRange: AmountRangeId;
  savedAt: string;
};

export const STORAGE_KEY_REWARD_SEARCHES = 'br-reward-searches';

export const TX_TYPE_OPTIONS = txTypePills.map((pill) => ({
  id: pill.value,
  label: pill.label,
}));

export const CATEGORY_OPTIONS = Object.fromEntries(
  Object.entries(categoryPills).map(([tx, pills]) => [
    tx,
    pills.map((pill) => ({ id: pill.value, label: pill.label })),
  ]),
) as Record<TxType, { id: string; label: string }[]>;

export const AMOUNT_RANGE_OPTIONS = amountPills.map((pill) => ({
  id: pill.value,
  label: pill.label,
  midpoint: getAmountMidpoint(pill.value),
}));

export const PAYER_OPTIONS = payerPills.map((pill) => ({
  id: pill.value,
  label: pill.label,
}));

const ISSUER_BRAND_COLORS: Record<string, string> = {
  'HDFC Bank': '#004C8F',
  'Axis Bank': '#971237',
  'SBI Card': '#22409A',
  'ICICI Bank': '#F58220',
  'IDFC FIRST Bank': '#9B2335',
  'RBL Bank': '#2E3192',
  'American Express': '#006FCF',
  Google: '#4285F4',
  PhonePe: '#5F259F',
  NPCI: '#097939',
};

function parseEstimatedRewardNumber(label: string): number {
  if (label === 'Varies') return 0;
  const kMatch = label.match(/₹([\d.]+)K/i);
  if (kMatch) return Math.round(parseFloat(kMatch[1]) * 1000);
  const nMatch = label.match(/₹([\d,]+)/);
  if (nMatch) return parseInt(nMatch[1].replace(/,/g, ''), 10);
  return 0;
}

function toRankedReward(r: RewardResult): RankedReward {
  const rateMatch = r.rewardRate.match(/(\d+(?:\.\d+)?)/);
  const ratePercent = rateMatch ? parseFloat(rateMatch[1]) : 0;
  return {
    rank: r.rank,
    name: r.cardName,
    paymentType: r.paymentType,
    rate: r.rewardRate,
    ratePercent,
    howTo: r.howToGet,
    brandColor: ISSUER_BRAND_COLORS[r.issuer] ?? '#6B7280',
    network: 'Visa',
    estimatedReward: parseEstimatedRewardNumber(r.estimatedReward),
    estimatedRewardLabel: r.estimatedReward,
  };
}

export { getAmountMidpoint };

export function estimateReward(amount: number, ratePercent: number): number {
  return Math.round((amount * ratePercent) / 100);
}

export function getRewards(
  txType: TxType,
  category: string,
  amountRange: AmountRangeId,
  options?: { audience?: Audience; limit?: number },
): RankedReward[] {
  const audience = options?.audience ?? 'personal';
  const limit = options?.limit ?? 3;
  return getRewardsFromTable(txType, category, amountRange, audience, limit).map(toRankedReward);
}

export function getAllRewards(
  txType: TxType,
  category: string,
  amountRange: AmountRangeId,
  audience: Audience = 'personal',
): RankedReward[] {
  return getAllRewardsFromTable(txType, category, amountRange, audience).map(toRankedReward);
}

export function saveRewardSearch(search: Omit<RewardSearch, 'savedAt'>): void {
  if (typeof window === 'undefined') return;
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

export const RANK_LABELS = ['①', '②', '③', '④', '⑤'] as const;

export { EMPTY_COMBO_MESSAGE } from '../utils/rewardSuggester';
