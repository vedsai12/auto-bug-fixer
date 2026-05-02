@echo off
SET PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0"
echo Starting Auto Bug Fixer Backend...
npm run dev
pause
