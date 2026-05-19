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

:: =========================
:: CHECK PYTHON 3.12.10
:: =========================

echo.
echo [1/4] Check Python 3.12.10...

python --version 2>nul | findstr "3.12.10" >nul

IF %ERRORLEVEL% NEQ 0 (

    echo Python 3.12.10 non trovato.
    echo Download automatico...

    powershell -Command "Invoke-WebRequest https://www.python.org/ftp/python/3.12.10/python-3.12.10-amd64.exe -OutFile python_installer.exe"

    echo Installazione Python...

    start /wait python_installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0

    timeout /t 10
)

python --version

:: =========================
:: CHECK NODE 24
:: =========================

echo.
echo [2/4] Check Node.js v24...

node -v 2>nul | findstr "v24" >nul

IF %ERRORLEVEL% NEQ 0 (

    echo Node.js v24 non trovato.
    echo Download automatico...

    powershell -Command "Invoke-WebRequest https://nodejs.org/dist/v24.13.1/node-v24.13.1-x64.msi -OutFile node_installer.msi"

    echo Installazione Node.js...

    msiexec /i node_installer.msi /passive

    timeout /t 15
)



:: =========================
:: BACKEND VENV
:: =========================

echo.
echo [3/4] Setup Python venv...

cd /d "%PROJECT_ROOT%\Backend"

IF EXIST venv (
    echo Removing old venv...
    rmdir /s /q venv
)

python -m venv venv

call venv\Scripts\activate

python -m pip install --upgrade pip

pip install -r requirements.txt

@REM venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000

:: =========================
:: FRONTEND
:: =========================

echo.
echo [4/4] Setup frontend...

cd /d "%PROJECT_ROOT%\Frontend"

IF EXIST node_modules (
    rmdir /s /q node_modules
)

IF EXIST package-lock.json (
    del package-lock.json
)

call npm install

pause










@REM uvicorn app.main:app --host 127.0.0.1 --port 8000