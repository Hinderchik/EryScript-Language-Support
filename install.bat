@echo off
cd /d "%~dp0"
echo ============================================================
echo  EryScript Language Support - installer
echo ============================================================
echo.

call code --install-extension "%~dp0eryscript.vsix" --force

if errorlevel 1 (
    echo.
    echo Automatic install failed.
    echo Open VS Code, press Ctrl+Shift+P and run: Extensions: Install from VSIX...
    echo Then choose eryscript.vsix in this folder.
) else (
    echo.
    echo Installed. Restart VS Code completely, then open a .ery file.
)

echo.
pause
