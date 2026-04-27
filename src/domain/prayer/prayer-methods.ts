import { CalculationMethod, Madhab, HighLatitudeRule, PolarCircleResolution } from 'adhan';

export type PrayerMethodId =
  | 'mwl' | 'isna' | 'egypt' | 'umm-al-qura' | 'karachi' | 'tehran' | 'jafari'
  | 'gulf' | 'kuwait' | 'qatar' | 'singapore' | 'france' | 'turkey' | 'russia'
  | 'dubai' | 'malaysia' | 'tunisia' | 'algeria' | 'indonesia' | 'morocco' | 'portugal' | 'jordan';

export type MethodProfile = {
  id: PrayerMethodId;
  name: string;
  paramsFactory: () => ReturnType<typeof CalculationMethod.MuslimWorldLeague>;
  defaultMadhab: 'shafi' | 'hanafi' | 'jafari';
  highLatitudeRecommendation: 'middle-of-night' | 'seventh-of-night' | 'twilight-angle' | 'recommended';
  polarDefault: 'aqrab-yaum' | 'aqrab-balad' | 'unresolved';
  source: string;
};

const mk = (id: PrayerMethodId, name: string, paramsFactory: MethodProfile['paramsFactory'], source: string): MethodProfile => ({
  id,
  name,
  paramsFactory,
  defaultMadhab: 'shafi',
  highLatitudeRecommendation: 'recommended',
  polarDefault: 'aqrab-yaum',
  source,
});

export const METHOD_PROFILES: Record<PrayerMethodId, MethodProfile> = {
  mwl: mk('mwl', 'Muslim World League', () => CalculationMethod.MuslimWorldLeague(), 'Adhan defaults'),
  isna: mk('isna', 'ISNA', () => CalculationMethod.NorthAmerica(), 'Adhan defaults'),
  egypt: mk('egypt', 'Egyptian General Authority', () => CalculationMethod.Egyptian(), 'Adhan defaults'),
  'umm-al-qura': mk('umm-al-qura', 'Umm Al-Qura', () => CalculationMethod.UmmAlQura(), 'Adhan defaults'),
  karachi: mk('karachi', 'Karachi', () => CalculationMethod.Karachi(), 'Adhan defaults'),
  tehran: mk('tehran', 'Tehran', () => CalculationMethod.Tehran(), 'Adhan defaults'),
  jafari: mk('jafari', 'Jafari', () => CalculationMethod.Tehran(), 'Adhan + jafari madhab'),
  gulf: mk('gulf', 'Gulf Region', () => CalculationMethod.Other(), 'Configured'),
  kuwait: mk('kuwait', 'Kuwait', () => CalculationMethod.Kuwait(), 'Adhan defaults'),
  qatar: mk('qatar', 'Qatar', () => CalculationMethod.Qatar(), 'Adhan defaults'),
  singapore: mk('singapore', 'Singapore', () => CalculationMethod.Singapore(), 'Adhan defaults'),
  france: mk('france', 'France', () => CalculationMethod.MuslimWorldLeague(), 'Configured'),
  turkey: mk('turkey', 'Turkey', () => CalculationMethod.MuslimWorldLeague(), 'Configured'),
  russia: mk('russia', 'Russia', () => CalculationMethod.MuslimWorldLeague(), 'Configured'),
  dubai: mk('dubai', 'Dubai', () => CalculationMethod.Dubai(), 'Adhan defaults'),
  malaysia: mk('malaysia', 'Malaysia / JAKIM', () => CalculationMethod.Singapore(), 'Configured'),
  tunisia: mk('tunisia', 'Tunisia', () => CalculationMethod.Other(), 'Configured'),
  algeria: mk('algeria', 'Algeria', () => CalculationMethod.Other(), 'Configured'),
  indonesia: mk('indonesia', 'Indonesia / Kemenag', () => CalculationMethod.Singapore(), 'Configured'),
  morocco: mk('morocco', 'Morocco', () => CalculationMethod.Other(), 'Configured'),
  portugal: mk('portugal', 'Portugal', () => CalculationMethod.MuslimWorldLeague(), 'Configured'),
  jordan: mk('jordan', 'Jordan', () => CalculationMethod.Other(), 'Configured'),
};

export function configureMethod(id: PrayerMethodId, madhab: 'shafi' | 'hanafi' | 'jafari' = 'shafi') {
  const profile = METHOD_PROFILES[id];
  const params = profile.paramsFactory();
  if (id === 'france') { params.fajrAngle = 12; params.ishaAngle = 12; }
  if (id === 'turkey') { params.fajrAngle = 18; params.ishaAngle = 17; }
  if (id === 'morocco') { params.fajrAngle = 18; params.ishaAngle = 17; }
  if (id === 'tunisia') { params.fajrAngle = 18; params.ishaAngle = 18; }
  if (id === 'algeria') { params.fajrAngle = 18; params.ishaAngle = 17; }
  if (id === 'jordan') { params.fajrAngle = 18; params.ishaAngle = 18; }
  if (id === 'gulf') { params.fajrAngle = 19.5; params.ishaAngle = 18.5; }

  params.madhab = madhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  params.highLatitudeRule = HighLatitudeRule.TwilightAngle;
  params.polarCircleResolution = PolarCircleResolution.AqrabYaum;
  return params;
}
