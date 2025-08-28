@echo off
echo ========================================
echo FreePromptHub Feed Updater
echo ========================================
echo.

echo Updating sitemaps and RSS feeds...
echo.

REM Generate sitemaps
echo [1/3] Generating XML sitemaps...
node generate-sitemap.js
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to generate sitemaps
    pause
    exit /b 1
)
echo.

REM Generate RSS feeds
echo [2/3] Generating RSS feeds...
node generate-rss.js
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to generate RSS feeds
    pause
    exit /b 1
)
echo.

REM Run full update
echo [3/3] Running complete update...
node update-all-feeds.js
echo.

echo ========================================
echo Update complete!
echo ========================================
echo.
echo Files generated:
echo   - sitemap.xml
echo   - sitemap.html
echo   - rss.xml
echo   - atom.xml
echo   - feed.json
echo   - 8 category RSS feeds
echo.
echo Press any key to exit...
pause > nul