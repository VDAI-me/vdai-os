@echo off
setlocal
cd /d "%~dp0"
set "VDAI_BASH=%ProgramFiles%\Git\bin\bash.exe"
if not exist "%VDAI_BASH%" set "VDAI_BASH=%LocalAppData%\Programs\Git\bin\bash.exe"
if not exist "%VDAI_BASH%" (
  echo Git for Windows is required. See START-HERE.md for the official download.
  pause
  exit /b 1
)
"%VDAI_BASH%" scripts/start-guided.sh
set "VDAI_EXIT=%ERRORLEVEL%"
pause
exit /b %VDAI_EXIT%
