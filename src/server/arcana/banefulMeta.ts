/** Backlash, alternatives, and planetary timing for baneful corpus entries. */
export const BANEFUL_METADATA: Record<
  string,
  { backlashText: string; alternativesText: string; planetaryTiming: string }
> = {
  arc_pgm_defixio: {
    backlashText:
      "Historical accounts warn of chthonic retaliation if offerings are omitted or the rite is performed without proper dismissal. Psychologically, obsession with enemy targets correlates with paranoia and social isolation. Legally, curse tablets discovered in archaeological context are studied as artifacts — modern harassment or stalking laws may apply to targeting living persons.",
    alternativesText:
      "• **Mirror Return** (arc_reversal_mirror) — reflect hostile energy without direct attack\n• **LBRP + cord-cutting** (arc_lbrp, arc_cord_cutting) — cleanse and sever attachment\n• **Hot Foot's gentler cousin**: documented 'Get Away' oils used for departure without harm\n• **Petro justice rites** under qualified oungan/manbo for community-level resolution",
    planetaryTiming:
      "Saturn day (Saturday), Saturn hour. Moon waning or dark. Mars hour acceptable in some PGM variants for accelerated binding. Avoid Jupiter day if seeking mercy. Circle not always used in PGM — bothros at crossroads preferred.",
  },
  arc_hoodoo_hotfoot: {
    backlashText:
      "Conjure tradition holds that foot-track magic can 'walk back' if the worker's intent is impure or protection is not maintained. Community backlash, family estrangement, and guilt cycles are commonly reported in ethnographic interviews. Physical handling of graveyard dirt carries health risks.",
    alternativesText:
      "• **Freezer spell** (documented variant) — stall rather than harm\n• **Mirror Return** for sent-back work\n• **Cord-cutting + LBRP** for emotional release without targeting\n• **Civil/legal remedies** — restraining orders where applicable",
    planetaryTiming:
      "Tuesday (Mars) or Saturday (Saturn) at sunset. Mars hour for drive-force; Saturn hour for lasting banishment. No circle in hoodoo — work at crossroads or client's property line.",
  },
  arc_grand_grimoire: {
    backlashText:
      "Grimoire literature universally warns of spirit deception, pact backlash, and madness from Lucifuge operations. Historians note the text as literary transgression fantasy — practitioners in accounts often report sleep paralysis, terror, and religious crisis.",
    alternativesText:
      "• **Solomonic seals without pact** (arc_goetia_seal) — hierarchical spirit work with circle protection\n• **Chaos sigil** for desire without entity contact\n• **NLP six-step reframe** for obsession with power\n• **Hermetic planetary magic** (Agrippa) without demonic pact frame",
    planetaryTiming:
      "Three days of fasting per manuscript. Operation at midnight, Monday (Moon) or Tuesday (Mars) depending on edition. Full Solomonic circle, triangle of art, and black-handled knife required in historical text.",
  },
  arc_chaos_war_sigil: {
    backlashText:
      "Chaos magic community documents rebound when war sigils are charged with pure malice rather than lawful self-defense. Obsession with enemy imagery amplifies conflict. Psychologically correlates with rage fixation.",
    alternativesText:
      "• **Standard chaos sigil** (arc_chaos_sigil) for desire without war frame\n• **Mirror Return** + LBRP\n• **Cord-cutting** without targeting\n• **Martial arts / legal self-defense** for physical threats",
    planetaryTiming:
      "Mars day/hour for conflict resolution sigils; Saturn for binding without escalation. Charge in gnosis. Disposal within 72 hours recommended in Carroll lineage.",
  },
  arc_key_solomon_death: {
    backlashText:
      "Medieval manuscript margins warn of Saturnian melancholy, spirit assault, and 'rebound' if the figure is incorrectly named or buried on church ground. Kieckhefer documents church prosecution of poppet magic as maleficium. Psychological fixation on enemy death is clinically associated with rage disorders.",
    alternativesText:
      "• **Binding without destruction** — PGM binding (arc_pgm_defixio) as tongue/hand binding only\n• **Hot Foot** for removal rather than death\n• **Mirror Return + reversal bath**\n• **Defensive Wiccan circle** and ongoing shielding\n• **Professional mediation or legal action**",
    planetaryTiming:
      "Saturn day, Saturn hour — essential in Solomonic death curses. Moon in Scorpio or Capricorn preferred. Construct circle with Saturn intelligence names. Bury figure at crossroads at midnight; never on consecrated ground per manuscript.",
  },
};

export const DEFAULT_PEACEFUL_META = {
  backlashText: "",
  alternativesText: "",
  planetaryTiming: "Consult tradition-specific timing in full text. Generally: match planetary day/hour to working's nature.",
};
