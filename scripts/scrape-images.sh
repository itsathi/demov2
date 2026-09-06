#!/bin/bash
# Scrape each company site homepage and extract candidate image URLs (bash 3 compatible).

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36"

OUTDIR="/tmp/prospect-images"
mkdir -p "$OUTDIR"

# slug|url
SITES=(
  "qualitycare|https://qualitycareuae.ae"
  "bluemount|http://www.bluemountuae.ae"
  "rakea|https://rakeauae.com"
  "iec|http://www.iecuae.ae"
  "ostaservices|https://www.ostaservices.com"
  "dsfmaintenance|https://dsfmaintenance.ae"
  "powerway|http://www.powerway.ae"
  "albaredacrepairing|https://albaredacrepairing.com"
  "levelgroup|https://levelgroup.ae"
  "teamstalwart|https://www.teamstalwart.com"
  "teluscare|https://www.teluscare.com/ras-al-khaimah/residential-ac-repair-service"
  "nestfix|https://nestfix-uae.com"
  "yello|https://www.yello.ae"
  "cannelleholdings|https://cannelleholdings.com"
  "thushhaara|https://www.thushhaara.com"
  "climatech|https://www.climatech.ae"
  "nestclimate|https://www.nestclimate.ae"
  "uaehvac|https://uaehvac.com"
  "fixationhub|https://fixationhub.ae"
  "noorawaal|https://noorawaal.com"
  "homeexperts|http://homeexperts.ae"
  "edtechnicalservices|https://www.edtechnicalservices.com"
  "alsidras|https://alsidras.com"
  "actechniciandubai|http://www.actechniciandubai.ae"
  "acmaintenancedubai|https://www.acmaintenancedubai.ae"
  "awalexperts|https://awalexperts.com"
  "abusaeed|http://www.abusaeed.com"
  "homefixit|https://homefixituae.com/24hr-emergency-ac-repair-dubai/"
  "basatanwertech|http://basatanwertech.com"
  "imdaad|https://www.imdaad.ae"
  "reach|https://www.reachuae.com"
)

for entry in "${SITES[@]}"; do
  slug="${entry%%|*}"
  url="${entry##*|}"
  htmlfile="$OUTDIR/$slug.html"
  curl -sL --max-time 40 -A "$UA" "$url" -o "$htmlfile" 2>/dev/null
  sz=$(stat -f%z "$htmlfile" 2>/dev/null || echo 0)
  echo "$slug|$url|$sz"
done