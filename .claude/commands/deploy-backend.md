# Deploy Backend to Azure

Deploy the SunriseApi to Azure App Service and apply any pending EF Core migrations to Azure SQL.

**Resources:**
- App Service: `thesunrise-api` → `https://thesunrise-api.azurewebsites.net`
- Resource Group: `thesunrise-rg` (West US 3)
- SQL Server: `thesunrise-sql.database.windows.net`
- Database: `SunriseDb`
- Subscription: `ZeroToTen`

## Important: do not use `Compress-Archive` for zipping

PowerShell's `Compress-Archive` creates zips with Windows backslash path separators which Kudu on Linux cannot extract — this causes a silent "Extract zip" failure during deployment. Use the .NET `ZipArchive` API directly (see step 3), which allows us to normalize paths to forward slashes before writing each entry.

## Before starting

Ensure the correct Azure subscription is active:

```powershell
az account set --subscription "ZeroToTen"
```

---

## Steps

Work from `SunriseApi/` for all commands.

### 1. Stop the local API if running

Stop any running local API process before proceeding — a locked DLL will cause the build to fail.

### 2. Whitelist local IP for Azure SQL firewall

```powershell
$myIp = (Invoke-WebRequest -Uri 'https://api.ipify.org' -UseBasicParsing).Content.Trim()
az sql server firewall-rule create --resource-group thesunrise-rg --server thesunrise-sql --name LocalDev --start-ip-address $myIp --end-ip-address $myIp
```

### 3. Apply pending migrations

```powershell
$env:ASPNETCORE_ENVIRONMENT = "Production"
dotnet ef database update
```

If this fails, stop immediately and report the error — do not proceed to deployment.

### 5. Build and publish

```powershell
dotnet publish -c Release -o ./publish -r linux-x64 --self-contained false
```

`-r linux-x64 --self-contained false` targets Linux and strips Windows runtime binaries, avoiding backslash path issues in the `runtimes/` folder.

### 6. Package as zip

Do **not** use `Compress-Archive` — it writes backslash separators into the zip entries which Kudu on Linux cannot extract. Use the .NET `ZipArchive` API to normalize all paths to forward slashes:

```powershell
Add-Type -AssemblyName System.IO.Compression.FileSystem
$publishDir = (Resolve-Path './publish').Path
$zipPath = (Resolve-Path '.').Path + '\publish.zip'
if (Test-Path $zipPath) { Remove-Item $zipPath }
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')
Get-ChildItem -Path $publishDir -Recurse -File | ForEach-Object {
    $entry = $_.FullName.Substring($publishDir.Length + 1).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $entry) | Out-Null
}
$zip.Dispose()
```

### 7. Deploy to Azure App Service

```powershell
az webapp deploy --resource-group thesunrise-rg --name thesunrise-api --src-path ./publish.zip --type zip
```

### 8. Verify deployment

```powershell
Invoke-RestMethod -Uri 'https://thesunrise-api.azurewebsites.net/health'
```

Expected: `{"status":"ok","timestamp":"..."}` with HTTP 200.

### 9. Cleanup

```powershell
Remove-Item -Recurse -Force ./publish
Remove-Item ./publish.zip
```

---

## Notes

- **appsettings.Production.json is gitignored and excluded from publish** (`CopyToPublishDirectory=Never` in the csproj). It exists locally only to provide the production connection string for migrations. All runtime config (`ASPNETCORE_ENVIRONMENT`, `FIREBASE_SERVICE_ACCOUNT`) is stored as encrypted Azure App Service settings.
- **Always run migrations before deploying code** — new code may depend on the updated schema.
- If migrations fail, the old code is still running so the app stays functional. Fix and retry.
- If deployment fails after migrations, the schema is ahead of the code — roll back or fix forward quickly.
- Swagger is disabled in production (`!IsProduction()` gate in `Program.cs`).
- The free App Service plan (F1) has a 60 CPU-minute/day limit. The Azure SQL free tier auto-pauses after inactivity and resumes on the next connection (first request may be slow).
