import React from "react";
import { cx } from "../utils/classnames";
import type { NetworkCoreMode } from "../networkCore";

const modeToIndex: Record<NetworkCoreMode, number> = {
  cloud: 0,
  local: 1,
  mesh: 2,
};

export function ThreeWayToggle(props: {
  value: NetworkCoreMode;
  onChange: (next: NetworkCoreMode) => void;
  items: Array<{ id: NetworkCoreMode; label: string }>;
  ariaLabel: string;
}) {
  const activeIndex = modeToIndex[props.value];

  return (
    <div className="relative w-full max-w-[420px]">
      <div className="relative flex rounded-full border border-[color:var(--border)] bg-[color:var(--surface-inset)] p-1">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-1 w-1/3 rounded-full bg-[color:var(--surface-elevated)] shadow-sm transition-[left] duration-300 ease-out"
          style={{
            left: `calc(${activeIndex * 33.333333}% + 4px)`,
            width: "calc(33.333333% - 8px)",
          }}
        />

        {props.items.map((item) => {
          const isActive = item.id === props.value;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => props.onChange(item.id)}
              className={cx(
                "relative z-10 flex-1 select-none rounded-full px-4 py-2 text-xs font-medium transition duration-200",
                isActive
                  ? "text-[color:var(--text-primary)]"
                  : "text-[color:var(--text-tertiary)] hover:text-[color:var(--text-secondary)]",
              )}
              aria-pressed={isActive}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <span className="sr-only">{props.ariaLabel}</span>
    </div>
  );
}
