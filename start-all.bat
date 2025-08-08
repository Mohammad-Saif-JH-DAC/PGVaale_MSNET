@echo off
REM Start .NET backend
start "Backend" cmd /k "cd PGVaaleDotNetBackend && dotnet run --urls http://localhost:5000"
REM Start React frontend
start "Frontend" cmd /k "cd frontend && npm start" 