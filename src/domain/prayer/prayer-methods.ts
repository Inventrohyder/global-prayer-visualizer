import { CalculationMethod, Madhab, PolarCircleResolution, type CalculationParameters } from 'adhan';

export type PrayerMethodId =
  | 'MWL' | 'ISNA' | 'EGYPT' | 'UMM_AL_QURA' | 'KARACHI' | 'TEHRAN' | 'JAFARI'
  | 'GULF' | 'KUWAIT' | 'QATAR' | 'SINGAPORE' | 'FRANCE' | 'TURKEY' | 'RUSSIA'
  | 'DUBAI' | 'MALAYSIA' | 'TUNISIA' | 'ALGERIA' | 'INDONESIA' | 'MOROCCO' | 'PORTUGAL' | 'JORDAN';

export type HighLatitudeRuleId = 'middle-of-night' | 'seventh-of-night' | 'twilight-angle' | 'recommended';
export type PolarResolutionId = 'aqrab-yaum' | 'aqrab-balad' | 'unresolved';

export type PrayerMethodProfile = {
  id: PrayerMethodId;
  name: string;
  source: string;
  highLatitudeRecommendation: HighLatitudeRuleId;
  polarResolutionDefault: PolarResolutionId;
  midnightMode: 'standard' | 'jafari';
  createParams: () => CalculationParameters;
};

const withDefaults = (params: CalculationParameters): CalculationParameters => {
  params.polarCircleResolution = PolarCircleResolution.AqrabYaum;
  return params;
};
const customAngles = (fajr: number, isha: number): CalculationParameters => {
  const p = CalculationMethod.Other();
  p.fajrAngle = fajr;
  p.ishaAngle = isha;
  return withDefaults(p);
};

export const PRAYER_METHODS: Record<PrayerMethodId, PrayerMethodProfile> = {
  MWL: { id: 'MWL', name: 'Muslim World League', source: 'adhan-js methods + project mapping', highLatitudeRecommendation: 'recommended', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => withDefaults(CalculationMethod.MuslimWorldLeague()) },
  ISNA: { id: 'ISNA', name: 'ISNA', source: 'adhan-js methods + project mapping', highLatitudeRecommendation: 'middle-of-night', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => withDefaults(CalculationMethod.NorthAmerica()) },
  EGYPT: { id: 'EGYPT', name: 'Egyptian General Authority of Survey', source: 'adhan-js methods + project mapping', highLatitudeRecommendation: 'twilight-angle', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => withDefaults(CalculationMethod.Egyptian()) },
  UMM_AL_QURA: { id: 'UMM_AL_QURA', name: 'Umm Al-Qura University, Makkah', source: 'adhan-js methods + project mapping', highLatitudeRecommendation: 'seventh-of-night', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => withDefaults(CalculationMethod.UmmAlQura()) },
  KARACHI: { id: 'KARACHI', name: 'University of Islamic Sciences, Karachi', source: 'adhan-js methods + project mapping', highLatitudeRecommendation: 'middle-of-night', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => withDefaults(CalculationMethod.Karachi()) },
  TEHRAN: { id: 'TEHRAN', name: 'Institute of Geophysics, University of Tehran', source: 'adhan-js methods + project mapping', highLatitudeRecommendation: 'twilight-angle', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'jafari', createParams: () => withDefaults(CalculationMethod.Tehran()) },
  JAFARI: { id: 'JAFARI', name: 'Shia Ithna-Ashari / Jafari', source: 'adhan-js methods + project mapping', highLatitudeRecommendation: 'twilight-angle', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'jafari', createParams: () => withDefaults(CalculationMethod.Other()) },
  GULF: { id: 'GULF', name: 'Gulf Region', source: 'regional override', highLatitudeRecommendation: 'recommended', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => customAngles(18, 90) },
  KUWAIT: { id: 'KUWAIT', name: 'Kuwait', source: 'regional override', highLatitudeRecommendation: 'recommended', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => withDefaults(CalculationMethod.Kuwait()) },
  QATAR: { id: 'QATAR', name: 'Qatar', source: 'regional override', highLatitudeRecommendation: 'recommended', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => withDefaults(CalculationMethod.Qatar()) },
  SINGAPORE: { id: 'SINGAPORE', name: 'Singapore', source: 'regional override', highLatitudeRecommendation: 'recommended', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => withDefaults(CalculationMethod.Singapore()) },
  FRANCE: { id: 'FRANCE', name: 'France', source: 'regional override', highLatitudeRecommendation: 'middle-of-night', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => withDefaults(CalculationMethod.Other()) },
  TURKEY: { id: 'TURKEY', name: 'Turkey', source: 'regional override', highLatitudeRecommendation: 'seventh-of-night', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => withDefaults(CalculationMethod.Turkey()) },
  RUSSIA: { id: 'RUSSIA', name: 'Russia', source: 'regional override', highLatitudeRecommendation: 'middle-of-night', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => withDefaults(CalculationMethod.Other()) },
  DUBAI: { id: 'DUBAI', name: 'Dubai', source: 'regional override', highLatitudeRecommendation: 'recommended', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => withDefaults(CalculationMethod.Dubai()) },
  MALAYSIA: { id: 'MALAYSIA', name: 'Malaysia / JAKIM', source: 'regional override', highLatitudeRecommendation: 'recommended', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => withDefaults(CalculationMethod.Other()) },
  TUNISIA: { id: 'TUNISIA', name: 'Tunisia', source: 'regional override', highLatitudeRecommendation: 'twilight-angle', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => withDefaults(CalculationMethod.Other()) },
  ALGERIA: { id: 'ALGERIA', name: 'Algeria', source: 'regional override', highLatitudeRecommendation: 'twilight-angle', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => withDefaults(CalculationMethod.Other()) },
  INDONESIA: { id: 'INDONESIA', name: 'Indonesia / Kemenag', source: 'regional override', highLatitudeRecommendation: 'recommended', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => withDefaults(CalculationMethod.Other()) },
  MOROCCO: { id: 'MOROCCO', name: 'Morocco', source: 'regional override', highLatitudeRecommendation: 'twilight-angle', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => customAngles(19, 17) },
  PORTUGAL: { id: 'PORTUGAL', name: 'Portugal', source: 'regional override', highLatitudeRecommendation: 'middle-of-night', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => withDefaults(CalculationMethod.Other()) },
  JORDAN: { id: 'JORDAN', name: 'Jordan', source: 'regional override', highLatitudeRecommendation: 'recommended', polarResolutionDefault: 'aqrab-yaum', midnightMode: 'standard', createParams: () => withDefaults(CalculationMethod.Other()) }
};

export const buildMethodParameters = (methodId: PrayerMethodId, madhab: 'shafi' | 'hanafi' | 'jafari' = 'shafi') => {
  const p = PRAYER_METHODS[methodId].createParams();
  p.madhab = madhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  return p;
};
