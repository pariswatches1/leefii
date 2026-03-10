#!/bin/bash
# Run the full data sync from Neon → Production
# Usage: ./scripts/run-sync.sh [site_url] [admin_key]
#
# This script calls the /api/admin/sync-neon endpoint to copy
# 546K+ products from the Neon collection database into the
# production database.

SITE_URL="${1:-https://leefii.com}"
SECRET="${2:-leefii-admin-setup-2026}"

echo "=== Leefii Data Sync ==="
echo "Target: $SITE_URL"
echo ""

# Step 1: Check status
echo "Step 1: Checking sync status..."
curl -s -X POST "$SITE_URL/api/admin/sync-neon" \
  -H "Content-Type: application/json" \
  -d "{\"secret\":\"$SECRET\",\"step\":\"check\"}" | python3 -m json.tool
echo ""

# Step 2: Sync dispensary websites
echo "Step 2: Syncing dispensary websites..."
curl -s -X POST "$SITE_URL/api/admin/sync-neon" \
  -H "Content-Type: application/json" \
  -d "{\"secret\":\"$SECRET\",\"step\":\"dispensaries\"}" | python3 -m json.tool
echo ""

# Step 3: Sync products in batches
echo "Step 3: Syncing products (2000 per batch)..."
OFFSET=0
while true; do
  echo "  Batch at offset $OFFSET..."
  RESPONSE=$(curl -s -X POST "$SITE_URL/api/admin/sync-neon" \
    -H "Content-Type: application/json" \
    -d "{\"secret\":\"$SECRET\",\"step\":\"products\",\"offset\":$OFFSET}")
  
  echo "$RESPONSE" | python3 -m json.tool
  
  # Check if complete
  STATUS=$(echo "$RESPONSE" | python3 -c "import json,sys; print(json.load(sys.stdin).get('status',''))" 2>/dev/null)
  NEXT=$(echo "$RESPONSE" | python3 -c "import json,sys; print(json.load(sys.stdin).get('nextOffset',''))" 2>/dev/null)
  
  if [ "$STATUS" = "complete" ] || [ -z "$NEXT" ] || [ "$NEXT" = "None" ] || [ "$NEXT" = "null" ]; then
    echo ""
    echo "=== Sync Complete! ==="
    break
  fi
  
  OFFSET=$NEXT
  echo "  Continuing..."
  sleep 2  # Brief pause between batches
done
