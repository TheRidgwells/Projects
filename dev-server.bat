@echo off
REM The Ridgwell Family Projects - local dev server (Windows)
REM Usage: dev-server.bat [port] [--no-dev-mode] [--lan]
REM   port            default: 8080
REM   --no-dev-mode   don't force DEV_MODE on for this run (see dev-server.js)
REM   --lan           listen on all interfaces, for phones and other devices on your network
setlocal
set "DIR=%~dp0"
node "%DIR%dev-server.js" %*
