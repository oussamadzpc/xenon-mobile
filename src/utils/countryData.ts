// ================= COUNTRY DATA - ISO 3166-1 Alpha-2 =================
// نقل دقيق من App.jsx

export const COUNTRY_DATA: Record<string, { name: string; flag: string; code: string }> = {
  "AE": { name: "United Arab Emirates", flag: "🇦🇪", code: "AE" },
  "BH": { name: "Bahrain", flag: "🇧🇭", code: "BH" },
  "DZ": { name: "Algeria", flag: "🇩🇿", code: "DZ" },
  "EG": { name: "Egypt", flag: "🇪🇬", code: "EG" },
  "IQ": { name: "Iraq", flag: "🇮🇶", code: "IQ" },
  "JO": { name: "Jordan", flag: "🇯🇴", code: "JO" },
  "KW": { name: "Kuwait", flag: "🇰🇼", code: "KW" },
  "LB": { name: "Lebanon", flag: "🇱🇧", code: "LB" },
  "LY": { name: "Libya", flag: "🇱🇾", code: "LY" },
  "MA": { name: "Morocco", flag: "🇲🇦", code: "MA" },
  "OM": { name: "Oman", flag: "🇴🇲", code: "OM" },
  "PS": { name: "Palestine", flag: "🇵🇸", code: "PS" },
  "QA": { name: "Qatar", flag: "🇶🇦", code: "QA" },
  "SA": { name: "Saudi Arabia", flag: "🇸🇦", code: "SA" },
  "SD": { name: "Sudan", flag: "🇸🇩", code: "SD" },
  "SY": { name: "Syria", flag: "🇸🇾", code: "SY" },
  "TN": { name: "Tunisia", flag: "🇹🇳", code: "TN" },
  "YE": { name: "Yemen", flag: "🇾🇪", code: "YE" },
  "AT": { name: "Austria", flag: "🇦🇹", code: "AT" },
  "BE": { name: "Belgium", flag: "🇧🇪", code: "BE" },
  "BG": { name: "Bulgaria", flag: "🇧🇬", code: "BG" },
  "CH": { name: "Switzerland", flag: "🇨🇭", code: "CH" },
  "CZ": { name: "Czechia", flag: "🇨🇿", code: "CZ" },
  "DE": { name: "Germany", flag: "🇩🇪", code: "DE" },
  "DK": { name: "Denmark", flag: "🇩🇰", code: "DK" },
  "ES": { name: "Spain", flag: "🇪🇸", code: "ES" },
  "FI": { name: "Finland", flag: "🇫🇮", code: "FI" },
  "FR": { name: "France", flag: "🇫🇷", code: "FR" },
  "GB": { name: "United Kingdom", flag: "🇬🇧", code: "GB" },
  "GR": { name: "Greece", flag: "🇬🇷", code: "GR" },
  "HR": { name: "Croatia", flag: "🇭🇷", code: "HR" },
  "HU": { name: "Hungary", flag: "🇭🇺", code: "HU" },
  "IE": { name: "Ireland", flag: "🇮🇪", code: "IE" },
  "IT": { name: "Italy", flag: "🇮🇹", code: "IT" },
  "NL": { name: "Netherlands", flag: "🇳🇱", code: "NL" },
  "NO": { name: "Norway", flag: "🇳🇴", code: "NO" },
  "PL": { name: "Poland", flag: "🇵🇱", code: "PL" },
  "PT": { name: "Portugal", flag: "🇵🇹", code: "PT" },
  "RO": { name: "Romania", flag: "🇷🇴", code: "RO" },
  "SE": { name: "Sweden", flag: "🇸🇪", code: "SE" },
  "SI": { name: "Slovenia", flag: "🇸🇮", code: "SI" },
  "SK": { name: "Slovakia", flag: "🇸🇰", code: "SK" },
  "AR": { name: "Argentina", flag: "🇦🇷", code: "AR" },
  "BR": { name: "Brazil", flag: "🇧🇷", code: "BR" },
  "CA": { name: "Canada", flag: "🇨🇦", code: "CA" },
  "CL": { name: "Chile", flag: "🇨🇱", code: "CL" },
  "CO": { name: "Colombia", flag: "🇨🇴", code: "CO" },
  "MX": { name: "Mexico", flag: "🇲🇽", code: "MX" },
  "US": { name: "United States", flag: "🇺🇸", code: "US" },
  "CN": { name: "China", flag: "🇨🇳", code: "CN" },
  "ID": { name: "Indonesia", flag: "🇮🇩", code: "ID" },
  "IN": { name: "India", flag: "🇮🇳", code: "IN" },
  "IR": { name: "Iran", flag: "🇮🇷", code: "IR" },
  "JP": { name: "Japan", flag: "🇯🇵", code: "JP" },
  "KR": { name: "South Korea", flag: "🇰🇷", code: "KR" },
  "MY": { name: "Malaysia", flag: "🇲🇾", code: "MY" },
  "PH": { name: "Philippines", flag: "🇵🇭", code: "PH" },
  "PK": { name: "Pakistan", flag: "🇵🇰", code: "PK" },
  "TH": { name: "Thailand", flag: "🇹🇭", code: "TH" },
  "TR": { name: "Turkey", flag: "🇹🇷", code: "TR" },
  "VN": { name: "Vietnam", flag: "🇻🇳", code: "VN" },
  "GH": { name: "Ghana", flag: "🇬🇭", code: "GH" },
  "KE": { name: "Kenya", flag: "🇰🇪", code: "KE" },
  "NG": { name: "Nigeria", flag: "🇳🇬", code: "NG" },
  "ZA": { name: "South Africa", flag: "🇿🇦", code: "ZA" },
  "AU": { name: "Australia", flag: "🇦🇺", code: "AU" },
  "NZ": { name: "New Zealand", flag: "🇳🇿", code: "NZ" },
  "RU": { name: "Russia", flag: "🇷🇺", code: "RU" },
};

export const BEIN_LANGUAGE_MAP: Record<string, string> = {
  "arabic": "ar", "عربي": "ar", "arab": "ar", "العربية": "ar",
  "french": "fr", "français": "fr", "france": "fr", "فرنسي": "fr",
  "english": "en", "anglais": "en", "british": "en", "انجليزي": "en",
  "espanol": "es", "spanish": "es", "español": "es", "es": "es",
  "turkish": "tr", "turk": "tr", "türkçe": "tr", "تركي": "tr",
  "german": "de", "deutsch": "de", "allemand": "de", "ألماني": "de",
  "italian": "it", "italiano": "it", "italien": "it", "إيطالي": "it",
};

export const ARABIC_COUNTRIES: Record<string, string> = {
  "الجزائر": "DZ", "مصر": "EG", "السعودية": "SA", "الامارات": "AE",
  "المغرب": "MA", "تونس": "TN", "لبنان": "LB", "سوريا": "SY",
  "العراق": "IQ", "الاردن": "JO", "فلسطين": "PS", "ليبيا": "LY",
  "السودان": "SD", "اليمن": "YE", "الكويت": "KW", "قطر": "QA",
  "البحرين": "BH", "عمان": "OM", "تركيا": "TR", "تركيه": "TR",
  "المانيا": "DE", "فرنسا": "FR", "بريطانيا": "GB", "امريكا": "US",
  "ايطاليا": "IT", "اسبانيا": "ES", "روسيا": "RU", "الهند": "IN",
  "باكستان": "PK", "الصين": "CN", "اليابان": "JP", "كوريا": "KR",
  "البرازيل": "BR", "الارجنتين": "AR", "كندا": "CA", "استراليا": "AU",
  "هولندا": "NL", "بلجيكا": "BE", "سويسرا": "CH", "النمسا": "AT",
  "السويد": "SE", "النرويج": "NO", "الدنمارك": "DK", "فنلندا": "FI",
  "بولندا": "PL", "التشيك": "CZ", "المجر": "HU", "رومانيا": "RO",
  "بلغاريا": "BG", "اليونان": "GR", "البرتغال": "PT", "ايرلندا": "IE",
  "جنوب افريقيا": "ZA", "نيجيريا": "NG", "كينيا": "KE", "غانا": "GH",
};

export const detectBeinLanguage = (channelName: string, groupName: string): string | null => {
  const text = (channelName + " " + groupName).toLowerCase();
  for (const [keyword, lang] of Object.entries(BEIN_LANGUAGE_MAP)) {
    if (text.includes(keyword.toLowerCase())) return lang;
  }
  if (text.includes("bein") || text.includes("ssc") || text.includes("dazn")) {
    if (/\b(ar|arab|عرب)/i.test(text)) return "ar";
    if (/\b(fr|fra|french|français)/i.test(text)) return "fr";
    if (/\b(en|eng|english|uk|british)/i.test(text)) return "en";
    if (/\b(es|esp|spanish|español)/i.test(text)) return "es";
    if (/\b(tr|tur|turkish|türk)/i.test(text)) return "tr";
    if (/\b(de|ger|german|deutsch)/i.test(text)) return "de";
    return "ar";
  }
  return null;
};

export const detectCountry = (channelName: string, groupName: string) => {
  const text = (channelName + " " + groupName).toLowerCase();
  const isoMatch = text.match(/\b([a-z]{2})\b/);
  if (isoMatch && COUNTRY_DATA[isoMatch[1].toUpperCase()]) {
    return COUNTRY_DATA[isoMatch[1].toUpperCase()];
  }
  for (const [code, data] of Object.entries(COUNTRY_DATA)) {
    if (text.includes(data.name.toLowerCase()) || text.includes(code.toLowerCase())) {
      return data;
    }
  }
  for (const [arabicName, code] of Object.entries(ARABIC_COUNTRIES)) {
    if (text.includes(arabicName)) return COUNTRY_DATA[code];
  }
  return null;
};
