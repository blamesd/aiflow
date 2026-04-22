@echo off
set "PATH=%PATH%;C:\Program Files\nodejs"
call npx.cmd prisma db push
