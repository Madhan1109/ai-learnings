# PowerShell script to load .env file and run Spring Boot
Write-Host "Loading environment variables from .env file..." -ForegroundColor Green

# Load .env file and set environment variables
if (Test-Path ".env") {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, 'Process')
            Write-Host "Set $key = $value" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host ".env file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "`nStarting Spring Boot application..." -ForegroundColor Green
mvn spring-boot:run
