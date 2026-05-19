@echo off

set PROJECT_ROOT=%~dp0

:: FRONTEND
start cmd /k "cd /d %PROJECT_ROOT%Frontend && npm run dev -- --host"

:: BACKEND
start cmd /k "cd /d %PROJECT_ROOT%Backend && venv\Scripts\activate.bat && python -m uvicorn app.main:app --host 0.0.0.0 --port 8001"

