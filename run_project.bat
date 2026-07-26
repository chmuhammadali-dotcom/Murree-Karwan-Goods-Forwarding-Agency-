@echo off
echo ==========================================================
echo   🚀 Murree Karwan Goods Forwarding Agency Portal Launcher
echo ==========================================================
echo.

:: Temporarily add Node.js installation directory to PATH so npm is recognized
set PATH=C:\Program Files\nodejs;%PATH%

echo [1/3] Starting Express Backend (Port 5000)...
start "Murree Karwan Backend Server" cmd /k "set PATH=C:\Program Files\nodejs;%%PATH%% && cd backend && npm start"

echo [2/3] Starting React Frontend Client (Port 3000)...
start "Murree Karwan Frontend Client" cmd /k "set PATH=C:\Program Files\nodejs;%%PATH%% && cd frontend && npm run dev"

echo [3/3] Opening Web Browser...
timeout /t 4 /nobreak >nul
start http://localhost:3000

echo.
echo ==========================================================
echo   Web servers are booting up in the new terminal windows.
echo   Keep those windows open while testing the website!
echo   Close them when you want to stop the servers.
echo ==========================================================
echo.
pause
