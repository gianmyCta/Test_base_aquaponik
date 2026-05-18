@echo off

set PROJECT_ROOT=%cd%

echo =====================================
echo SETUP TEST BASE AQUAPONIK
echo =====================================

:: =========================
:: CHECK PYTHON
:: =========================

echo.
echo [1/7] Check Python...

python --version >nul 2>&1

IF %ERRORLEVEL% NEQ 0 (
    echo Python non trovato.
    echo Installa Python 3.11+ da:
    echo https://www.python.org/downloads/
    pause
    exit /b
)

:: =========================
:: CHECK NODE
:: =========================

echo.
echo [2/7] Check Node.js...

node --version >nul 2>&1

IF %ERRORLEVEL% NEQ 0 (

    echo Node.js non trovato.
    echo Download automatico...

    powershell -Command "Invoke-WebRequest https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi -OutFile node_installer.msi"

    echo Installazione Node.js...

    msiexec /i node_installer.msi /passive

    echo Attendere fine installazione...

    timeout /t 15
)

:: =========================
:: BACKEND
:: =========================

echo.
echo [3/7] Setup backend...

cd /d %~dp0backend

IF NOT EXIST venv (
    python -m venv venv
)

venv\Scripts\python.exe -m pip install --upgrade pip

venv\Scripts\python.exe -m pip install -r requirements.txt


@REM venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000

:: =========================
:: FRONTEND
:: =========================

echo.
echo [4/7] Setup frontend...

cd ..\Frontend

echo Installing frontend dependencies...
call npm install

echo Building frontend...
call npm run build

:: =========================
:: COPY FRONTEND DIST
:: =========================

echo.
echo [6/8] Copy frontend dist...

cd ..\Backend

:: crea static se manca
IF NOT EXIST static (
    mkdir static
)

IF NOT EXIST static\dist (
    mkdir  static\dist
)
IF NOT EXIST static\dist\assets (
    mkdir  static\dist\assets
)




:: =========================
:: BUILD FRONTEND
cd /d %~dp0Backend

:: copia build frontend
robocopy "%PROJECT_ROOT%\Frontend\dist" "%PROJECT_ROOT%\Backend\static\dist" /E

echo Copy completed.




@REM uvicorn app.main:app --host 127.0.0.1 --port 8000