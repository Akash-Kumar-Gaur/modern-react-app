export type Benefit = {
  cat: string;
  title: string;
  sub: string;
  val: string;
  color: string;
  description: string;
  claim: string;
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
  selectedProducts: "br-selected-products",
  benefitUsage: "br-benefit-usage",
  loaded: "br-loaded",
} as const;

export const demoData: Record<ProductCategory, Product[]> = {
  cards: [
    {
      id: "regalia",
      name: "HDFC Regalia",
      meta: "HDFC Bank · 3 benefits",
      value: 6400,
      benefits: [
        {
          cat: "✈ LOUNGE",
          title: "8 Domestic Lounge Visits",
          sub: "resets yearly",
          val: "8/8",
          color: "#2F7A6D",
          description:
            "Eight complimentary domestic airport lounge visits per calendar year for primary and add-on cardholders at participating lounges across India.",
          claim:
            "Show your HDFC Regalia at the lounge reception. Visits are tracked against your card account. Add-on cardholders share the same annual pool.",
        },
        {
          cat: "🛡 COVER",
          title: "₹1 Cr Air Accident Cover",
          sub: "always active",
          val: "✓",
          color: "#2F7A6D",
          description:
            "Air accident insurance of ₹1 crore is automatically active when you purchase air tickets using this card.",
          claim:
            "Coverage activates on eligible ticket purchases. Keep booking confirmations. Contact HDFC Card services for claim intimation within the policy window.",
        },
        {
          cat: "🛡 COVER",
          title: "₹15L Overseas Hospitalization",
          sub: "travel benefit",
          val: "✓",
          color: "#2F7A6D",
          description:
            "Emergency overseas hospitalization cover up to ₹15 lakh when travelling abroad on trips booked with the card.",
          claim:
            "Retain travel and medical documents. Notify the insurer helpline before or as soon as possible after hospitalization.",
        },
      ],
    },
    {
      id: "elite",
      name: "SBI Card ELITE",
      meta: "SBI Card · 2 benefits",
      value: 5200,
      benefits: [
        {
          cat: "✈ LOUNGE",
          title: "Unlimited Domestic Lounge",
          sub: "resets quarterly",
          val: "∞",
          color: "#2F7A6D",
          description:
            "Unlimited domestic lounge access at partner lounges, subject to fair usage and quarterly eligibility checks.",
          claim:
            "Present your SBI Card ELITE at participating lounges. Ensure your card account is in good standing for the current quarter.",
        },
        {
          cat: "🎟 BOGO",
          title: "2 Free Movie Tickets / month",
          sub: "BookMyShow",
          val: "2/2",
          color: "#C89B3C",
          description:
            "Two complimentary movie tickets per month via BookMyShow, up to a monthly cap defined in the card benefits guide.",
          claim:
            "Redeem through the BookMyShow offer section linked to SBI Card. Apply the benefit before checkout. Unused tickets do not roll over.",
        },
      ],
    },
    {
      id: "amazonpay",
      name: "Amazon Pay ICICI",
      meta: "ICICI Bank · 1 benefit",
      value: 3600,
      benefits: [
        {
          cat: "💰 CASHBACK",
          title: "5% Back on Amazon",
          sub: "Prime members, uncapped",
          val: "5%",
          color: "#C89B3C",
          description:
            "5% unlimited cashback on Amazon.in for Prime members paying with Amazon Pay ICICI Credit Card.",
          claim:
            "Link the card in Amazon Pay. Ensure Prime membership is active. Cashback posts to your Amazon Pay balance after statement cycle.",
        },
      ],
    },
    {
      id: "magnus",
      name: "Axis Magnus Credit Card",
      meta: "Axis Bank · 2 benefits",
      value: 5800,
      benefits: [
        {
          cat: "✈ LOUNGE",
          title: "Unlimited Domestic + International Lounge",
          sub: "primary + add-on cardholders",
          val: "∞",
          color: "#2F7A6D",
          description:
            "Unlimited lounge visits at domestic and select international lounges for primary and add-on Magnus cardholders.",
          claim:
            "Swipe or tap your Magnus card at lounge reception. International lounges may require Priority Pass linkage — check Axis Magnus benefits portal.",
        },
        {
          cat: "⛳ GOLF",
          title: "4 Complimentary Golf Games / quarter",
          sub: "select courses",
          val: "4/4",
          color: "#C89B3C",
          description:
            "Four complimentary golf games per quarter at partner courses listed in the Axis Magnus golf program.",
          claim:
            "Book through the Axis Magnus concierge or golf portal. Quota resets every calendar quarter. Carry your card for verification at the course.",
        },
      ],
    },
    {
      id: "millennia",
      name: "HDFC Millennia Debit Card",
      meta: "HDFC Bank · 2 benefits",
      value: 3200,
      benefits: [
        {
          cat: "🛡 COVER",
          title: "₹10L Accidental Death Cover",
          sub: "air, road, rail",
          val: "✓",
          color: "#2F7A6D",
          description:
            "Accidental death cover of ₹10 lakh on air, road, and rail travel when tickets are purchased using the debit card.",
          claim:
            "Coverage is automatic on eligible travel spends. Nominee should contact HDFC Bank with incident details and ticket proofs to initiate claim.",
        },
        {
          cat: "💰 CASHBACK",
          title: "5% Back on Partner Apps",
          sub: "Amazon, Flipkart, Swiggy",
          val: "5%",
          color: "#C89B3C",
          description:
            "5% cashback on select partner merchants including Amazon, Flipkart, and Swiggy, subject to monthly caps in the benefits guide.",
          claim:
            "Pay with your Millennia debit card on partner apps. Cashback credits per HDFC's monthly cashback schedule.",
        },
      ],
    },
  ],
  telecom: [
    {
      id: "jio999",
      name: "Jio ₹999 / 84 days",
      meta: "Jio · 2 benefits",
      value: 1400,
      benefits: [
        {
          cat: "🎬 OTT",
          title: "Free JioHotstar",
          sub: "activate in MyJio",
          val: "✓",
          color: "#E2593A",
          description:
            "JioHotstar subscription bundled with the plan — must be manually activated in the MyJio app.",
          claim:
            "Open MyJio → Plan benefits → Activate JioHotstar. Link your mobile number. Activation is one-time per recharge cycle.",
        },
        {
          cat: "☁ CLOUD",
          title: "50GB JioCloud",
          sub: "auto-linked",
          val: "✓",
          color: "#E2593A",
          description:
            "50GB JioCloud storage auto-linked to your Jio number for backups and media sync.",
          claim:
            "Download JioCloud app and sign in with your Jio number. Storage renews with each eligible recharge.",
        },
      ],
    },
    {
      id: "airtel999",
      name: "Airtel ₹999 / 84 days",
      meta: "Airtel · 2 benefits",
      value: 1300,
      benefits: [
        {
          cat: "🎬 OTT",
          title: "Apollo Circle + OTT trials",
          sub: "redeem in Airtel Thanks",
          val: "✓",
          color: "#E2593A",
          description:
            "Apollo Circle membership plus OTT trial subscriptions available through Airtel Thanks rewards.",
          claim:
            "Open Airtel Thanks app → Rewards → Claim bundled OTT and Apollo offers before they expire this cycle.",
        },
        {
          cat: "🎵 MUSIC",
          title: "Wynk Music Premium",
          sub: "auto-linked",
          val: "✓",
          color: "#E2593A",
          description:
            "Wynk Music Premium streaming bundled and auto-linked to your Airtel number.",
          claim:
            "Install Wynk Music and log in with your Airtel number. Premium activates within 24 hours of recharge.",
        },
      ],
    },
  ],
  insurance: [
    {
      id: "health",
      name: "Comprehensive Health Policy",
      meta: "Most insurers · 2 benefits",
      value: 4500,
      benefits: [
        {
          cat: "🩺 HEALTH",
          title: "Free Annual Checkup",
          sub: "per insured adult",
          val: "1/1",
          color: "#C89B3C",
          description:
            "One complimentary annual health checkup per insured adult at network diagnostic centres.",
          claim:
            "Book via insurer app or helpline. Choose a network lab. Carry policy card and photo ID. Valid once per policy year per adult.",
        },
        {
          cat: "📞 CONSULT",
          title: "4 Free Teleconsults / yr",
          sub: "via insurer app",
          val: "4/4",
          color: "#C89B3C",
          description:
            "Four complimentary teleconsultations per year with empanelled doctors through the insurer's digital platform.",
          claim:
            "Open insurer app → Wellness → Book teleconsult. Sessions deduct from annual quota. Unused consults expire at policy renewal.",
        },
      ],
    },
    {
      id: "motor",
      name: "Comprehensive Motor Policy",
      meta: "Most insurers · 2 benefits",
      value: 2500,
      benefits: [
        {
          cat: "🚗 ASSIST",
          title: "Free Roadside Assistance",
          sub: "towing, fuel, flat tyre",
          val: "✓",
          color: "#2F7A6D",
          description:
            "24×7 roadside assistance including towing, fuel delivery, and flat-tyre support on covered breakdowns.",
          claim:
            "Call the RSA helpline on your policy document. Share vehicle location and policy number. Service subject to fair usage limits.",
        },
        {
          cat: "🛡 NCB",
          title: "No Claim Bonus Protection",
          sub: "preserves up to 50% discount",
          val: "✓",
          color: "#C89B3C",
          description:
            "NCB protection add-on preserves your no-claim bonus discount after one eligible claim during the policy period.",
          claim:
            "Ensure NCB protection is listed on your policy schedule. Inform insurer at claim time to apply protection per terms.",
        },
      ],
    },
  ],
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
  const products = getAllProducts().filter((p) => productIds.includes(p.id));
  return products.flatMap((product) =>
    product.benefits.map((benefit, benefitIndex) => {
      const { total, isQuotaBased } = parseQuota(benefit.val);
      return {
        ...benefit,
        id: buildBenefitId(product.id, benefitIndex),
        productId: product.id,
        productName: product.name,
        benefitIndex,
        resetPeriod: inferResetPeriod(benefit.sub, benefit.val),
        quotaTotal: total,
        isQuotaBased,
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
  return getAllProducts()
    .filter((p) => productIds.includes(p.id))
    .reduce((sum, p) => sum + p.value, 0);
}

export function getCtaDestination(): "/onboarding" | "/dashboard" {
  const selected = getSelectedProductIds();
  return selected.length > 0 ? "/dashboard" : "/onboarding";
}
