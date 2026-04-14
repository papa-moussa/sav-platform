#!/bin/bash
# ─────────────────────────────────────────────────────────────────
# build.sh — Pré-build des apps Angular avant docker compose
# Usage : chmod +x build.sh && ./build.sh
# ─────────────────────────────────────────────────────────────────
set -e

echo ">>> [1/3] Build sav-front (SSR, NX)..."
npx nx build sav-front --configuration=production

echo ">>> [2/3] Build sav-admin (Angular standalone)..."
cd sav-admin
[ ! -d "node_modules" ] && npm install --legacy-peer-deps
npx ng build --configuration=production
cd ..

echo ">>> [3/3] Build sav-landing (Angular standalone)..."
cd sav-landing
[ ! -d "node_modules" ] && npm install --legacy-peer-deps
npx ng build --configuration=production
cd ..

echo ""
echo "Tous les builds OK. Lance maintenant :"
echo "  docker compose up -d --build"
