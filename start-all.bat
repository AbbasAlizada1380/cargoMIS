@echo off
echo Starting Client and Server...

:: Start CLIENT in a new terminal
start cmd /k "cd client && npm run dev"

:: Wait 2 seconds before starting server
timeout /t 2 >nul

:: Start SERVER in a new terminal
start cmd /k "cd server && npm start"

exit
