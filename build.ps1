# ─────────────────────────────────────────────────────────────────
# build.ps1 — Pré-build des apps Angular avant docker compose
# Usage : .\build.ps1
# ─────────────────────────────────────────────────────────────────

Write-Host ">>> [1/3] Build sav-front (SSR, NX)..." -ForegroundColor Cyan
npx nx build sav-front --configuration=production
if ($LASTEXITCODE -ne 0) { Write-Host "ERREUR sav-front" -ForegroundColor Red; exit 1 }

Write-Host ">>> [2/3] Build sav-admin (Angular standalone)..." -ForegroundColor Cyan
Push-Location sav-admin
if (-not (Test-Path "node_modules")) {
    Write-Host "  → npm install sav-admin..." -ForegroundColor Gray
    npm install --legacy-peer-deps
}
npx ng build --configuration=production
if ($LASTEXITCODE -ne 0) { Pop-Location; Write-Host "ERREUR sav-admin" -ForegroundColor Red; exit 1 }
Pop-Location

Write-Host ">>> [3/3] Build sav-landing (Angular standalone)..." -ForegroundColor Cyan
Push-Location sav-landing
if (-not (Test-Path "node_modules")) {
    Write-Host "  → npm install sav-landing..." -ForegroundColor Gray
    npm install --legacy-peer-deps
}
npx ng build --configuration=production
if ($LASTEXITCODE -ne 0) { Pop-Location; Write-Host "ERREUR sav-landing" -ForegroundColor Red; exit 1 }
Pop-Location

Write-Host ""
Write-Host "Tous les builds OK. Lance maintenant :" -ForegroundColor Green
Write-Host "  docker compose up -d --build" -ForegroundColor Yellow
