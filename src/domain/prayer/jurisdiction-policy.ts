import raw from '../../data/jurisdiction-methods.json';
import type { PrayerMethodId, HighLatitudeRuleId, PolarResolutionId } from './prayer-methods';

export type PrayerJurisdictionPolicy = {
  jurisdictionId: string;
  countryIsoA3?: string;
  name: string;
  methodId: PrayerMethodId;
  madhab?: 'shafi' | 'hanafi' | 'jafari';
  highLatitudeRule?: HighLatitudeRuleId;
  polarCircleResolution?: PolarResolutionId;
  midnightMode?: 'standard' | 'jafari' | 'method-default';
  maghribOffsetMinutes?: number;
  ishaOffsetMinutes?: number;
  fajrAngle?: number;
  ishaAngle?: number;
  source?: string;
  confidence?: 'official' | 'documented' | 'inferred' | 'fallback';
};

const DATA = raw as { defaultPolicy: PrayerJurisdictionPolicy; countryPolicies: Record<string, PrayerJurisdictionPolicy> };

export const policyForCountry = (isoA3?: string | null): PrayerJurisdictionPolicy => {
  if (isoA3 && DATA.countryPolicies[isoA3]) {
    return DATA.countryPolicies[isoA3];
  }
  return DATA.defaultPolicy;
};
