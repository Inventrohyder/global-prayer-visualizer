import data from '../../data/jurisdiction-methods.json';
import { PRAYER_METHODS, type HighLatitudeRuleId, type PolarResolutionId, type PrayerMethodId } from './prayer-methods';

export type PrayerJurisdictionPolicy = {
  jurisdictionId: string;
  countryIsoA3?: string;
  name: string;
  methodId: PrayerMethodId;
  madhab?: 'shafi' | 'hanafi' | 'jafari';
  highLatitudeRule?: HighLatitudeRuleId;
  polarCircleResolution?: PolarResolutionId;
  midnightMode?: 'standard' | 'jafari' | 'method-default';
  source?: string;
  confidence?: 'official' | 'documented' | 'inferred' | 'fallback';
};

const FALLBACK: PrayerJurisdictionPolicy = {
  jurisdictionId:'fallback-global', name:'Fallback Global', methodId:'mwl', confidence:'fallback', source:'Default fallback'
};

const entries = data as PrayerJurisdictionPolicy[];
const byIso = new Map(entries.map((e) => [e.countryIsoA3, e] as const));

export function resolveJurisdictionPolicy(countryIsoA3?: string): PrayerJurisdictionPolicy {
  if (!countryIsoA3) return FALLBACK;
  return byIso.get(countryIsoA3) ?? FALLBACK;
}

export function resolveMethodFromPolicy(p: PrayerJurisdictionPolicy) {
  const m = PRAYER_METHODS[p.methodId];
  return { ...m, highLatitudeRule: p.highLatitudeRule === 'recommended' || !p.highLatitudeRule ? m.highLatitudeRule : p.highLatitudeRule,
    polarResolution: p.polarCircleResolution ?? m.polarResolution,
    midnightMode: p.midnightMode === 'method-default' || !p.midnightMode ? m.midnightMode : p.midnightMode };
}
