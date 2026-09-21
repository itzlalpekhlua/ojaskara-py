@echo off
cd /d "%~dp0"
if "%PORT%"=="" set PORT=8000
call venv\Scripts\python.exe main.py
