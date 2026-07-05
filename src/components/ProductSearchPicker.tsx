import { useMemo, useState } from "react";

export type PickerItem = {
  id: string;
  name: string;
  meta: string;
};

type ProductSearchPickerProps = {
  items: PickerItem[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  variant: "demo" | "onboard";
};

function filterItems(items: PickerItem[], query: string): PickerItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(q) || item.meta.toLowerCase().includes(q),
  );
}

export function ProductSearchPicker({
  items,
  selected,
  onToggle,
  variant,
}: ProductSearchPickerProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => filterItems(items, query), [items, query]);
  const selectedInTab = useMemo(
    () => items.filter((item) => selected.has(item.id)),
    [items, selected],
  );

  const listClass = variant === "demo" ? "demo-list product-search-results" : "onboard-list product-search-results";
  const rowClass = variant === "demo" ? "demo-row" : "onboard-row";
  const nameClass = variant === "demo" ? "demo-row-name" : "onboard-row-name";
  const metaClass = variant === "demo" ? "demo-row-meta" : "onboard-row-meta";
  const stampClass = variant === "demo" ? "demo-stamp" : "onboard-stamp";
  const RowTag = variant === "demo" ? "div" : "button";

  const renderRow = (item: PickerItem, index?: number) => {
    const checked = selected.has(item.id);
    const rowProps =
      variant === "onboard"
        ? {
            type: "button" as const,
            onClick: () => onToggle(item.id),
            style: index !== undefined ? { animationDelay: `${0.08 + index * 0.06}s` } : undefined,
          }
        : {
            onClick: () => onToggle(item.id),
          };

    return (
      <RowTag
        key={item.id}
        className={rowClass + (checked ? " checked" : "")}
        {...rowProps}
      >
        <div>
          <div className={nameClass}>{item.name}</div>
          <div className={metaClass}>{item.meta}</div>
        </div>
        <div className={stampClass}>✓</div>
      </RowTag>
    );
  };

  return (
    <>
      <div className="product-search-wrap">
        <span className="product-search-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="search"
          className="product-search-input"
          placeholder="Search cards, banks, telecom plans…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search products"
        />
      </div>

      <div className={listClass}>
        {query.trim() ? (
          results.length > 0 ? (
            results.map((item, i) => renderRow(item, i))
          ) : (
            <p className="product-search-empty">No matches for &ldquo;{query.trim()}&rdquo;</p>
          )
        ) : selectedInTab.length > 0 ? (
          <>
            <p className="product-search-section-label">Selected in this category</p>
            {selectedInTab.map((item) => renderRow(item))}
            <p className="product-search-hint">Search to add more</p>
          </>
        ) : (
          <p className="product-search-hint">
            Search by card name, bank, issuer, or plan — results appear as you type.
          </p>
        )}
      </div>
    </>
  );
}
