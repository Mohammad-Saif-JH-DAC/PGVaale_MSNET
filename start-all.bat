@echo off
REM Start .NET backend
start "Backend" cmd /k "cd PGVaaleDotNetBackend && dotnet run"
REM Start React frontend
start "Frontend" cmd /k "cd frontend && npm start" 