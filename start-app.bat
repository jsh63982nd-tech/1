@echo off
cd /d "%~dp0"
echo Starting personal exam review app...
echo.
echo Keep this window open while using the app.
echo Open this address in your browser:
echo http://localhost:5173
echo.
"C:\Program Files\nodejs\node.exe" server.mjs
pause
