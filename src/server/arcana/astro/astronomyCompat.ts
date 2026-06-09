/**
 * astronomy-engine ESM interop: namespace imports break under tsx;
 * default import re-exports named APIs for the rest of the astro module.
 */
import astronomy from "astronomy-engine";

export const {
  Body,
  SiderealTime,
  MakeTime,
  GeoVector,
  Ecliptic,
  Illumination,
  Observer,
  SearchRiseSet,
} = astronomy;

export type AstroTime = InstanceType<typeof astronomy.AstroTime>;
