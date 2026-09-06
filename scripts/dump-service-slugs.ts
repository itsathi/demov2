import { allProspects } from "../lib/prospect";
const slugs = [
  "qualitycare", "bluemount", "rakea", "iec", "ostaservices", "dsfmaintenance",
  "powerway", "albaredacrepairing", "levelgroup", "teamstalwart", "teluscare",
  "nestfix", "yello", "cannelleholdings", "thushhaara", "climatech",
  "nestclimate", "uaehvac", "fixationhub", "noorawaal", "homeexperts",
  "edtechnicalservices", "alsidras", "actechniciandubai", "acmaintenancedubai",
  "awalexperts", "abusaeed", "homefixit", "basatanwertech", "imdaad",
  "rakdubizzle", "reach",
];
for (const s of slugs) {
  const p = allProspects.find((x) => x.slug === s);
  if (!p) { console.log(s + "\tMISSING"); continue; }
  console.log(s + "\t" + p.services.map((sv) => sv.slug).join(","));
}