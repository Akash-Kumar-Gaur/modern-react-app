import {
  benefitToDisplay,
  getProductMeta,
  products as catalogProducts,
  type Benefit as CatalogBenefit,
  type Product as CatalogProduct,
} from "../data/products";

export type Benefit = {
  cat: string;
  title: string;
  sub: string;
  val: string;
  color: string;
  description: string;
  claim: string;
  verified?: boolean;
};

export type Product = {
  id: string;
  name: string;
  meta: string;
  value: number;
  benefits: Benefit[];
};

export type ProductCategory = "cards" | "telecom" | "insurance";

export type FilterCategory =
  | "all"
  | "lounge"
  | "insurance"
  | "cashback"
  | "ott"
  | "discount"
  | "health"
  | "unused";

export type ResetPeriod = "yearly" | "quarterly" | "monthly" | "once" | "always";

export type DashboardBenefit = Benefit & {
  id: string;
  productId: string;
  productName: string;
  benefitIndex: number;
  resetPeriod: ResetPeriod;
  quotaTotal: number | null;
  isQuotaBased: boolean;
};

export const STORAGE_KEYS = {
  selectedProducts: "rr-selected-products",
  benefitUsage: "rr-benefit-usage",
  loaded: "rr-loaded",
} as const;

function mapResetPeriod(period: CatalogBenefit["resetPeriod"]): ResetPeriod {
  switch (period) {
    case "year":
      return "yearly";
    case "quarter":
      return "quarterly";
    case "month":
      return "monthly";
    case "once":
      return "once";
    case "per-recharge":
      return "yearly";
    default:
      return "always";
  }
}

function mapBenefit(b: CatalogBenefit): Benefit {
  const display = benefitToDisplay(b);
  return {
    cat: display.cat,
    title: display.title,
    sub: display.sub,
    val: display.val,
    color: display.color,
    description: b.description,
    claim: b.howToClaim,
    verified: b.verified,
  };
}

function mapProduct(p: CatalogProduct): Product {
  return {
    id: p.id,
    name: p.name,
    meta: getProductMeta(p),
    value: p.annualValueEstimate,
    benefits: p.benefits.map(mapBenefit),
  };
}

function isCardProduct(p: CatalogProduct): boolean {
  return p.type === "credit-card" || p.type === "debit-card";
}

function isTelecomProduct(p: CatalogProduct): boolean {
  return p.type === "telecom";
}

function isInsuranceProduct(p: CatalogProduct): boolean {
  return (
    p.type === "health-insurance" ||
    p.type === "motor-insurance" ||
    p.type === "term-insurance"
  );
}

export const demoData: Record<ProductCategory, Product[]> = {
  cards: catalogProducts.filter(isCardProduct).map(mapProduct),
  telecom: catalogProducts.filter(isTelecomProduct).map(mapProduct),
  insurance: catalogProducts.filter(isInsuranceProduct).map(mapProduct),
};

export function getAllProducts(): Product[] {
  return [...demoData.cards, ...demoData.telecom, ...demoData.insurance];
}

export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}

export function buildBenefitId(productId: string, benefitIndex: number): string {
  return `${productId}-${benefitIndex}`;
}

export function inferResetPeriod(sub: string, val: string): ResetPeriod {
  const s = sub.toLowerCase();
  if (s.includes("quarter")) return "quarterly";
  if (s.includes("month")) return "monthly";
  if (s.includes("year") || s.includes("yr") || s.includes("annual")) return "yearly";
  if (val.includes("/")) return "yearly";
  return "always";
}

export function getCurrentPeriodKey(period: ResetPeriod): string {
  const now = new Date();
  const year = now.getFullYear();
  if (period === "yearly") return String(year);
  if (period === "quarterly") return `${year}-Q${Math.floor(now.getMonth() / 3) + 1}`;
  if (period === "monthly") return `${year}-M${now.getMonth() + 1}`;
  return "once";
}

export function parseQuota(val: string): { total: number | null; isQuotaBased: boolean } {
  if (val === "∞" || val === "✓" || val.includes("%")) {
    return { total: null, isQuotaBased: false };
  }
  const match = val.match(/(\d+)\s*\/\s*(\d+)/);
  if (match) {
    return { total: parseInt(match[2], 10), isQuotaBased: true };
  }
  return { total: null, isQuotaBased: false };
}

export function getUsageStorageKey(benefitId: string, periodKey: string): string {
  return `${benefitId}:${periodKey}`;
}

export function readUsageMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.benefitUsage);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export function writeUsageMap(map: Record<string, number>): void {
  localStorage.setItem(STORAGE_KEYS.benefitUsage, JSON.stringify(map));
}

export function getBenefitUsageCount(benefit: DashboardBenefit, map: Record<string, number>): number {
  if (!benefit.isQuotaBased) return 0;
  const periodKey = getCurrentPeriodKey(benefit.resetPeriod);
  const key = getUsageStorageKey(benefit.id, periodKey);
  return map[key] ?? 0;
}

export function getSelectedProductIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.selectedProducts);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function setSelectedProductIds(ids: string[]): void {
  localStorage.setItem(STORAGE_KEYS.selectedProducts, JSON.stringify(ids));
}

export function buildDashboardBenefits(productIds: string[]): DashboardBenefit[] {
  const selected = catalogProducts.filter((p) => productIds.includes(p.id));
  return selected.flatMap((product) =>
    product.benefits.map((benefit, benefitIndex) => {
      const mapped = mapBenefit(benefit);
      const { total, isQuotaBased } = parseQuota(mapped.val);
      return {
        ...mapped,
        id: buildBenefitId(product.id, benefitIndex),
        productId: product.id,
        productName: product.name,
        benefitIndex,
        resetPeriod: mapResetPeriod(benefit.resetPeriod),
        quotaTotal: benefit.quota ?? total,
        isQuotaBased: benefit.quota !== null || isQuotaBased,
      };
    }),
  );
}

export function getBenefitFilterCategories(cat: string): FilterCategory[] {
  const c = cat.toUpperCase();
  const categories: FilterCategory[] = [];
  if (c.includes("LOUNGE")) categories.push("lounge");
  if (c.includes("COVER") || c.includes("NCB") || c.includes("ASSIST")) categories.push("insurance");
  if (c.includes("CASHBACK")) categories.push("cashback");
  if (c.includes("OTT") || c.includes("MUSIC") || c.includes("CLOUD")) categories.push("ott");
  if (c.includes("BOGO") || c.includes("GOLF") || c.includes("DISCOUNT")) categories.push("discount");
  if (c.includes("HEALTH") || c.includes("CONSULT")) categories.push("health");
  return categories.length ? categories : ["all"];
}

export function getResetPeriodLabel(period: ResetPeriod): string {
  switch (period) {
    case "yearly":
      return "Resets every year";
    case "quarterly":
      return "Resets every quarter";
    case "monthly":
      return "Resets every month";
    case "once":
      return "One-time benefit";
    default:
      return "Always active";
  }
}

export function getResetPeriodIcon(period: ResetPeriod): string {
  switch (period) {
    case "yearly":
      return "📅";
    case "quarterly":
      return "🔄";
    case "monthly":
      return "📆";
    case "once":
      return "🎫";
    default:
      return "✓";
  }
}

export function estimateProductValue(productIds: string[]): number {
  return catalogProducts
    .filter((p) => productIds.includes(p.id))
    .reduce((sum, p) => sum + p.annualValueEstimate, 0);
}

export function getCtaDestination(): "/onboarding" | "/dashboard" {
  const selected = getSelectedProductIds();
  return selected.length > 0 ? "/dashboard" : "/onboarding";
}
