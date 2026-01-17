@echo off
REM PDF-Blender Setup Script for Windows
REM This script sets up the project with all dependencies and starts the dev server

setlocal enabledelayedexpansion

REM Colors and formatting (basic for Windows)
set "BLUE=[34m"
set "GREEN=[32m"
set "YELLOW=[33m"
set "RED=[31m"
set "RESET=[0m"

REM Project paths
set "PROJECT_DIR=%~dp0"
set "VENV_DIR=%PROJECT_DIR%venv"
set "ENV_FILE=%PROJECT_DIR%.env"
set "NODE_MODULES=%PROJECT_DIR%node_modules"

echo.
echo ========================================
echo   PDF-Blender - Initial Setup Script
echo ========================================
echo.

REM Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set "NODE_VERSION=%%i"
echo [OK] Node.js found: %NODE_VERSION%

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set "NPM_VERSION=%%i"
echo [OK] npm found: %NPM_VERSION%

echo.

REM Check if installation exists
set "REINSTALL=0"

if exist "%NODE_MODULES%" (
    echo [WARNING] Existing installation detected: node_modules found
    echo.
    set /p "REINSTALL=Do you want to reinstall from scratch? (y/N): "
    
    if /i "!REINSTALL!"=="y" (
        echo [INFO] Cleaning up existing installation...
        rmdir /s /q "%NODE_MODULES%"
        echo [OK] Cleanup complete
        echo.
    )
)

REM Create .env file if it doesn't exist
if not exist "%ENV_FILE%" (
    echo [INFO] Creating .env file...
    (
        echo # Database Configuration
        echo # Update this with your actual PostgreSQL connection string
        echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pdf_blender
        echo.
        echo # Server Configuration
        echo PORT=5000
        echo NODE_ENV=development
    ) > "%ENV_FILE%"
    echo [OK] .env file created
    echo [WARNING] Please update DATABASE_URL in .env if you have a database
) else (
    echo [OK] .env file already exists
)

echo.

REM Install npm dependencies
if not exist "%NODE_MODULES%" (
    echo [INFO] Installing npm dependencies...
    call npm install --prefer-offline --no-audit
    if !errorlevel! neq 0 (
        echo [ERROR] Failed to install npm dependencies
        pause
        exit /b 1
    )
    echo [OK] npm dependencies installed
) else (
    echo [OK] npm dependencies already installed
)

echo.
echo ========================================
echo   Setup Complete! Starting Dev Server
echo ========================================
echo.
echo [INFO] Development server starting on port 5000...
echo [INFO] Open your browser at: http://localhost:5000
echo [INFO] Press Ctrl+C to stop the server
echo.

REM Start the dev server
cd /d "%PROJECT_DIR%"
call npm run dev

pause
