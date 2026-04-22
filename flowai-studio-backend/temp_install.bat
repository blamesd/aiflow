@echo off
set "PATH=%PATH%;C:\Program Files\nodejs"
call npm.cmd install @nestjs/throttler --registry=https://registry.npmmirror.com
