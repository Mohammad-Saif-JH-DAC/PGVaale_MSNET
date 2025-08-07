@echo off
REM Kill all running PGVaaleDotNetBackend.exe processes
TASKKILL /F /IM PGVaaleDotNetBackend.exe >nul 2>&1
REM Kill all running dotnet.exe processes (if backend is running via 'dotnet run')
TASKKILL /F /IM dotnet.exe >nul 2>&1
echo All .NET backend processes have been stopped.
pause