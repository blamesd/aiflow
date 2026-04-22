@echo off
set "PATH=%PATH%;C:\Program Files\nodejs"

echo Installing backend dependencies...
cd flowai-studio-backend
call npm.cmd install --registry=https://registry.npmmirror.com

echo Configuring backend environment...
copy .env.example .env

echo Setting up database...
call npx.cmd prisma db push
call npx.cmd prisma db seed

echo Installing frontend dependencies...
cd ..\flowai-studio-frontend
call npm.cmd install --registry=https://registry.npmmirror.com

echo Deployment preparation successful.
