import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Moon, Scroll, Sparkles } from "lucide-react";
import { cx } from "../../utils/classnames";

export type ArcanaDockTab = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

export const sideDockIcons = {
  divinations: <Sparkles className="h-4 w-4" />,
  oracle: <Moon className="h-4 w-4" />,
  kabbalah: <Scroll className="h-4 w-4" />,
};

const DEFAULT_TABS: ArcanaDockTab[] = [
  { id: "divinations", label: "Divinations", icon: sideDockIcons.divinations },
  { id: "oracle", label: "Full Oracle", icon: sideDockIcons.oracle },
  { id: "kabbalah", label: "Practical Kabbalah", icon: sideDockIcons.kabbalah },
];

export function ArcanaSideDock(props: {
  tabs?: ArcanaDockTab[];
  divinations: React.ReactNode;
  oracle: React.ReactNode;
  kabbalah: React.ReactNode;
}) {
  const tabs = props.tabs?.length ? props.tabs : DEFAULT_TABS;
  const [open, setOpen] = useState(true);
  const [activeId, setActiveId] = useState<string>(tabs[0]?.id ?? "divinations");

  const active = tabs.find((p) => p.id === activeId) ?? tabs[0];

  const panelById: Record<string, React.ReactNode> = {
    divinations: props.divinations,
    oracle: props.oracle,
    kabbalah: props.kabbalah,
  };

  return (
    <aside
      className={cx(
        "allmagus-side-dock",
        open ? "allmagus-side-dock-open" : "allmagus-side-dock-collapsed",
      )}
      aria-label="Oracles and divinations"
    >
      <button
        type="button"
        className="allmagus-side-dock-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        title={open ? "Collapse tools" : "Open oracles & divinations"}
      >
        {open ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <nav className="allmagus-side-dock-tabs" aria-label="Tool sections">
        {tabs.map((panel) => (
          <button
            key={panel.id}
            type="button"
            className={cx(
              "allmagus-side-dock-tab",
              activeId === panel.id && "allmagus-side-dock-tab-active",
            )}
            onClick={() => {
              setActiveId(panel.id);
              setOpen(true);
            }}
            title={panel.label}
          >
            <span className="allmagus-side-dock-tab-icon">{panel.icon}</span>
            {open ? <span className="allmagus-side-dock-tab-label">{panel.label}</span> : null}
          </button>
        ))}
      </nav>

      {open && active ? (
        <div className="allmagus-side-dock-panel">
          <header className="allmagus-side-dock-panel-head">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--text-secondary)]">
              {active.label}
            </h2>
          </header>
          <div className="allmagus-side-dock-panel-body">
            {tabs.map((tab) => (
              <div key={tab.id} hidden={tab.id !== activeId}>
                {panelById[tab.id]}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
