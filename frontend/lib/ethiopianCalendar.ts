/**
 * Ethiopian & Gregorian Calendar Conversion Utility
 * Based on Julian Day Number (JDN) astronomical calculation.
 * 
 * Ethiopian Calendar structure:
 * - 12 months of 30 days each
 * - 13th month (Pagume) of 5 days (6 in leap years)
 * - Ethiopian leap year occurs every 4 years without century exceptions (year % 4 === 3)
 */

export interface EthiopianDate {
  year: number;
  month: number; // 1 to 13
  day: number; // 1 to 30 (or 1 to 5/6 for Pagume)
  monthNameEn: string;
  monthNameAm: string;
  dayNameEn: string;
  dayNameAm: string;
  formattedEn: string;
  formattedAm: string;
}

export const ETHIOPIAN_MONTHS = [
  { en: 'Meskerem', am: 'መስከረም' },
  { en: 'Tikimt', am: 'ጥቅምት' },
  { en: 'Hidar', am: 'ኅዳር' },
  { en: 'Tahsas', am: 'ታኅሣሥ' },
  { en: 'Tir', am: 'ጥር' },
  { en: 'Yakatit', am: 'የካቲት' },
  { en: 'Megabit', am: 'መጋቢት' },
  { en: 'Miazia', am: 'ሚያዝያ' },
  { en: 'Ginbot', am: 'ግንቦት' },
  { en: 'Sene', am: 'ሰኔ' },
  { en: 'Hamle', am: 'ሐምሌ' },
  { en: 'Nehase', am: 'ነሐሴ' },
  { en: 'Pagume', am: 'ጳጉሜ' },
];

export const DAYS_OF_WEEK = [
  { en: 'Sunday', am: 'እሑድ' },
  { en: 'Monday', am: 'ሰኞ' },
  { en: 'Tuesday', am: 'ማክሰኞ' },
  { en: 'Wednesday', am: 'ረቡዕ' },
  { en: 'Thursday', am: 'ሐሙስ' },
  { en: 'Friday', am: 'ዓርብ' },
  { en: 'Saturday', am: 'ቅዳሜ' },
];

/**
 * Converts a Gregorian date (year, month, day) to Julian Day Number (JDN)
 */
export function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * Converts Julian Day Number (JDN) to Ethiopian Date
 */
export function jdnToEthiopian(jdn: number): { year: number; month: number; day: number } {
  const ERA = 1723856;
  const r = (jdn - ERA) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const year = 4 * Math.floor((jdn - ERA) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;
  return { year, month, day };
}

/**
 * Converts any standard JavaScript Date object into an EthiopianDate with bilingual details
 */
export function toEthiopianDate(date: Date): EthiopianDate {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1;
  const gDay = date.getDate();

  const jdn = gregorianToJDN(gYear, gMonth, gDay);
  const eth = jdnToEthiopian(jdn);

  const dayOfWeekIndex = date.getDay(); // 0 = Sunday
  const dayNames = DAYS_OF_WEEK[dayOfWeekIndex];
  const monthInfo = ETHIOPIAN_MONTHS[eth.month - 1] || { en: `Month ${eth.month}`, am: `ወር ${eth.month}` };

  const formattedEn = `${dayNames.en}, ${monthInfo.en} ${eth.day}, ${eth.year}`;
  const formattedAm = `${dayNames.am}፣ ${monthInfo.am} ${eth.day} ቀን ${eth.year} ዓ.ም`;

  return {
    year: eth.year,
    month: eth.month,
    day: eth.day,
    monthNameEn: monthInfo.en,
    monthNameAm: monthInfo.am,
    dayNameEn: dayNames.en,
    dayNameAm: dayNames.am,
    formattedEn,
    formattedAm,
  };
}

/**
 * Formats a Gregorian Date to human readable string
 */
export function formatEuropeanDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
