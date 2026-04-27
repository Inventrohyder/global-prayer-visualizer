export type PrayerMethodId =
  | 'mwl' | 'isna' | 'egypt' | 'umm-al-qura' | 'karachi' | 'tehran' | 'jafari'
  | 'gulf' | 'kuwait' | 'qatar' | 'singapore' | 'france' | 'turkey' | 'russia' | 'dubai'
  | 'jakim' | 'tunisia' | 'algeria' | 'kemenag' | 'morocco' | 'portugal' | 'jordan';

export type HighLatitudeRuleId = 'middle-of-night' | 'seventh-of-night' | 'twilight-angle' | 'recommended';
export type PolarResolutionId = 'aqrab-yaum' | 'aqrab-balad' | 'unresolved';

export type PrayerMethodProfile = {
  id: PrayerMethodId;
  name: string;
  fajrAngle: number;
  ishaAngle?: number;
  ishaOffsetMinutes?: number;
  maghribOffsetMinutes?: number;
  asrFactor: 1 | 2;
  midnightMode: 'standard' | 'jafari';
  highLatitudeRule: Exclude<HighLatitudeRuleId, 'recommended'>;
  polarResolution: PolarResolutionId;
  source: string;
};

const method = (m: PrayerMethodProfile): PrayerMethodProfile => m;

export const PRAYER_METHODS: Record<PrayerMethodId, PrayerMethodProfile> = {
  'mwl': method({ id:'mwl', name:'Muslim World League', fajrAngle:18, ishaAngle:17, asrFactor:1, midnightMode:'standard', highLatitudeRule:'middle-of-night', polarResolution:'aqrab-yaum', source:'Adhan + documented defaults' }),
  'isna': method({ id:'isna', name:'ISNA', fajrAngle:15, ishaAngle:15, asrFactor:1, midnightMode:'standard', highLatitudeRule:'middle-of-night', polarResolution:'aqrab-yaum', source:'Adhan' }),
  'egypt': method({ id:'egypt', name:'Egyptian Survey', fajrAngle:19.5, ishaAngle:17.5, asrFactor:1, midnightMode:'standard', highLatitudeRule:'middle-of-night', polarResolution:'aqrab-yaum', source:'Adhan' }),
  'umm-al-qura': method({ id:'umm-al-qura', name:'Umm Al-Qura', fajrAngle:18.5, ishaOffsetMinutes:90, asrFactor:1, midnightMode:'standard', highLatitudeRule:'middle-of-night', polarResolution:'aqrab-yaum', source:'Adhan' }),
  'karachi': method({ id:'karachi', name:'Karachi', fajrAngle:18, ishaAngle:18, asrFactor:1, midnightMode:'standard', highLatitudeRule:'middle-of-night', polarResolution:'aqrab-yaum', source:'Adhan' }),
  'tehran': method({ id:'tehran', name:'Tehran', fajrAngle:17.7, ishaAngle:14, maghribOffsetMinutes:4, asrFactor:1, midnightMode:'jafari', highLatitudeRule:'middle-of-night', polarResolution:'aqrab-yaum', source:'Adhan' }),
  'jafari': method({ id:'jafari', name:'Jafari', fajrAngle:16, ishaAngle:14, maghribOffsetMinutes:4, asrFactor:1, midnightMode:'jafari', highLatitudeRule:'middle-of-night', polarResolution:'aqrab-yaum', source:'Adhan/Ithna-Ashari presets' }),
  'gulf': method({ id:'gulf', name:'Gulf Region', fajrAngle:19.5, ishaAngle:17.5, asrFactor:1, midnightMode:'standard', highLatitudeRule:'middle-of-night', polarResolution:'aqrab-yaum', source:'Regional profile' }),
  'kuwait': method({ id:'kuwait', name:'Kuwait', fajrAngle:18, ishaAngle:17.5, asrFactor:1, midnightMode:'standard', highLatitudeRule:'middle-of-night', polarResolution:'aqrab-yaum', source:'Regional profile' }),
  'qatar': method({ id:'qatar', name:'Qatar', fajrAngle:18, ishaOffsetMinutes:90, asrFactor:1, midnightMode:'standard', highLatitudeRule:'middle-of-night', polarResolution:'aqrab-yaum', source:'Regional profile' }),
  'singapore': method({ id:'singapore', name:'Singapore', fajrAngle:20, ishaAngle:18, asrFactor:1, midnightMode:'standard', highLatitudeRule:'seventh-of-night', polarResolution:'aqrab-yaum', source:'MUIS style profile' }),
  'france': method({ id:'france', name:'France', fajrAngle:12, ishaAngle:12, asrFactor:1, midnightMode:'standard', highLatitudeRule:'twilight-angle', polarResolution:'aqrab-yaum', source:'French organizations common profile' }),
  'turkey': method({ id:'turkey', name:'Turkey', fajrAngle:18, ishaAngle:17, asrFactor:1, midnightMode:'standard', highLatitudeRule:'seventh-of-night', polarResolution:'aqrab-yaum', source:'Diyanet-style profile' }),
  'russia': method({ id:'russia', name:'Russia', fajrAngle:16, ishaAngle:15, asrFactor:1, midnightMode:'standard', highLatitudeRule:'seventh-of-night', polarResolution:'aqrab-yaum', source:'Regional profile' }),
  'dubai': method({ id:'dubai', name:'Dubai', fajrAngle:18.2, ishaAngle:18.2, asrFactor:1, midnightMode:'standard', highLatitudeRule:'middle-of-night', polarResolution:'aqrab-yaum', source:'Regional profile' }),
  'jakim': method({ id:'jakim', name:'Malaysia / JAKIM', fajrAngle:20, ishaAngle:18, asrFactor:1, midnightMode:'standard', highLatitudeRule:'seventh-of-night', polarResolution:'aqrab-yaum', source:'JAKIM profile' }),
  'tunisia': method({ id:'tunisia', name:'Tunisia', fajrAngle:18, ishaAngle:18, asrFactor:1, midnightMode:'standard', highLatitudeRule:'middle-of-night', polarResolution:'aqrab-yaum', source:'Regional profile' }),
  'algeria': method({ id:'algeria', name:'Algeria', fajrAngle:18, ishaAngle:17, asrFactor:1, midnightMode:'standard', highLatitudeRule:'middle-of-night', polarResolution:'aqrab-yaum', source:'Regional profile' }),
  'kemenag': method({ id:'kemenag', name:'Indonesia / Kemenag', fajrAngle:20, ishaAngle:18, asrFactor:1, midnightMode:'standard', highLatitudeRule:'seventh-of-night', polarResolution:'aqrab-yaum', source:'Kemenag profile' }),
  'morocco': method({ id:'morocco', name:'Morocco', fajrAngle:19, ishaAngle:17, asrFactor:1, midnightMode:'standard', highLatitudeRule:'middle-of-night', polarResolution:'aqrab-yaum', source:'Ministry profile' }),
  'portugal': method({ id:'portugal', name:'Portugal', fajrAngle:18, ishaAngle:17, asrFactor:1, midnightMode:'standard', highLatitudeRule:'middle-of-night', polarResolution:'aqrab-yaum', source:'Community profile' }),
  'jordan': method({ id:'jordan', name:'Jordan', fajrAngle:18, ishaAngle:18, asrFactor:1, midnightMode:'standard', highLatitudeRule:'middle-of-night', polarResolution:'aqrab-yaum', source:'Awqaf profile' })
};
