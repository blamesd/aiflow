@echo off
set "PATH=%PATH%;C:\Program Files\nodejs"

echo Starting NovaFlow Studio Backend...
start "NovaFlow Studio Backend" cmd /k "cd flowai-studio-backend && npm run start:dev"

echo Starting NovaFlow Studio Frontend...
start "NovaFlow Studio Frontend" cmd /k "cd flowai-studio-frontend && npm run dev"

echo NovaFlow Studio has been started!
echo Frontend is accessible at http://localhost:5173
echo Backend API is bound to http://localhost:3000
