#!/bin/bash
# Extract candidate image URLs from scraped HTML.
UA="Mozilla/5.0"

OUTDIR="/tmp/prospect-images"
OUTFILE="$OUTDIR/ALL_IMAGES.txt"
: > "$OUTFILE"

for html in "$OUTDIR"/*.html; do
  slug=$(basename "$html" .html)
  # og:image / twitter:image
  og=$(grep -o '<meta[^>]*property="og:image"[^>]*content="[^"]*"' "$html" | sed -E 's/.*content="([^"]*)".*/\1/' | head -3)
  tw=$(grep -o '<meta[^>]*name="twitter:image"[^>]*content="[^"]*"' "$html" | sed -E 's/.*content="([^"]*)".*/\1/' | head -3)
  # img src / srcset
  imgs=$(grep -oE '<img[^>]*src="[^"]*"' "$html" | sed -E 's/.*src="([^"]*)".*/\1/' | head -40)
  # background-image urls
  bgs=$(grep -oE 'background[^:]*:url\([^)]*\)' "$html" | sed -E 's/.*url\(["'"'"']?([^)"'"'"']*).*/\1/' | head -10)

  {
    echo "###SLUG:$slug"
    [ -n "$og" ] && echo "###OG" && echo "$og"
    [ -n "$tw" ] && echo "###TW" && echo "$tw"
    [ -n "$imgs" ] && echo "###IMG" && echo "$imgs"
    [ -n "$bgs" ] && echo "###BG" && echo "$bgs"
  } >> "$OUTFILE"
done
echo "done -> $OUTFILE"