$ErrorActionPreference = 'Stop'

Write-Host "Installing backend dependencies..."
Set-Location flowai-studio-backend
npm install

Write-Host "Configuring backend environment..."
Copy-Item .env.example .env

Write-Host "Setting up database..."
npx prisma db push
npx prisma db seed

Write-Host "Installing frontend dependencies..."
Set-Location ..\flowai-studio-frontend
npm install

Write-Host "Deployment preparation successful."
