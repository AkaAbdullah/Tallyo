import "server-only";

const COUNTRY_CODES =
  "AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW".split(" ");

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const currencyNames = new Intl.DisplayNames(["en"], { type: "currency" });

export const COUNTRIES = COUNTRY_CODES.map((code) => ({ code, name: regionNames.of(code) ?? code })).sort((a, b) =>
  a.name.localeCompare(b.name),
);

export const CURRENCIES = Intl.supportedValuesOf("currency").map((code) => ({
  code,
  name: currencyNames.of(code) ?? code,
}));

export const COMMON_CURRENCIES = ["USD", "EUR", "GBP", "PKR", "INR", "AED", "CAD", "AUD", "CHF", "JPY", "SAR", "SGD"];

/** Currencies with the most common ones first. */
export const CURRENCIES_SORTED = [
  ...COMMON_CURRENCIES.map((code) => CURRENCIES.find((c) => c.code === code)!).filter(Boolean),
  ...CURRENCIES.filter((c) => !COMMON_CURRENCIES.includes(c.code)),
];
