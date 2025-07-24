@echo off
REM Start Spring Boot backend
start cmd /k "cd /d %~dp0backend && call gradlew.bat bootRun"
REM Wait a few seconds for backend to start
timeout /t 5
REM Start React frontend
start cmd /k "cd /d %~dp0frontend && npm start" 