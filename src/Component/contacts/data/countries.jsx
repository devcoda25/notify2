// src/Component/contacts/data/countries.js
/** @typedef {{ iso2:string, name:string, dial:string, flag:string, shortname:string }} Country */

export const COUNTRIES /** @type {readonly Country[]} */ = Object.freeze([
  { iso2: "in", name: "India",                 dial: "+91",  flag: "/assets/flags/IN.svg", shortname: "IN" },
  { iso2: "ae", name: "United Arab Emirates",  dial: "+971", flag: "/assets/flags/AE.svg", shortname: "AE" },
  { iso2: "us", name: "United States",         dial: "+1",   flag: "/assets/flags/US.svg", shortname: "US" },
  { iso2: "gb", name: "United Kingdom",        dial: "+44",  flag: "/assets/flags/GB.svg", shortname: "UK" },
]);

export const COUNTRIES_BY_ISO2 = Object.freeze(
  Object.fromEntries(COUNTRIES.map(c => [c.iso2, c]))
);

export const COUNTRIES_BY_DIAL = Object.freeze(
  Object.fromEntries(COUNTRIES.map(c => [c.dial, c]))
);
