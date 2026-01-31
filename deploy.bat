@echo off
TITLE Khasab Sports Club - Deployer
color 0A

echo ===================================================
echo   KHASAB SPORTS CLUB - DEPLOYMENT TOOL
echo ===================================================
echo.
echo This script will deploy your website to Vercel.
echo.
echo [IMPORTANT]
echo 1. You may be asked to Log In to Vercel (first time only).
echo 2. You will be asked to confirm default settings (just press Enter for all).
echo.
echo Starting deployment process...
echo.

call npx vercel --prod

echo.
echo ===================================================
echo   DEPLOYMENT FINISHED
echo ===================================================
echo.
echo If successful, your Live URL is shown above.
echo.
pause
