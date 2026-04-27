import data from '../../data/jurisdiction-methods.json';
import type { PrayerMethodId } from './prayer-methods';
import { lookupCountryIsoA3 } from '../geo/country-lookup';

export type PrayerJurisdictionPolicy = {
  jurisdictionId: string;
  countryIsoA3?: string;
  name: string;
  methodId: PrayerMethodId;
  madhab?: 'shafi' | 'hanafi' | 'jafari';
  highLatitudeRule?: 'middle-of-night' | 'seventh-of-night' | 'twilight-angle' | 'recommended';
  polarCircleResolution?: 'aqrab-yaum' | 'aqrab-balad' | 'unresolved';
  midnightMode?: 'standard' | 'jafari' | 'method-default';
  maghribOffsetMinutes?: number;
  ishaOffsetMinutes?: number;
  fajrAngle?: number;
  ishaAngle?: number;
  source?: string;
  confidence?: 'official' | 'documented' | 'inferred' | 'fallback';
};

const policies = data as PrayerJurisdictionPolicy[];

const fallbackPolicy: PrayerJurisdictionPolicy = {
  jurisdictionId: 'GLOBAL_FALLBACK',
  name: 'Global fallback',
  methodId: 'mwl',
  source: 'fallback',
  confidence: 'fallback',
};

const index = new Map(policies.map((p) => [p.countryIsoA3, p]));

export function resolveJurisdictionPolicy(lat: number, lon: number): PrayerJurisdictionPolicy {
  const iso3 = lookupCountryIsoA3(lat, lon);
  if (iso3 && index.get(iso3)) {
    return index.get(iso3) as PrayerJurisdictionPolicy;
  }
  return fallbackPolicy;
}
