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

### 1. Check for pending migrations

```powershell
dotnet ef migrations list
```

If there are pending migrations, show them to the user and ask for confirmation before applying.

### 2. Apply pending migrations (if any)

Your local IP must be whitelisted in the Azure SQL firewall. If it isn't (or may have changed):

```powershell
$myIp = (Invoke-WebRequest -Uri 'https://api.ipify.org' -UseBasicParsing).Content.Trim()
az sql server firewall-rule create --resource-group thesunrise-rg --server thesunrise-sql --name LocalDev --start-ip-address $myIp --end-ip-address $myIp
```

Then apply migrations by passing the connection string directly — `appsettings.Production.json` does not exist by design (credentials live only in Azure App Service settings):

```powershell
dotnet ef database update --connection "Server=tcp:thesunrise-sql.database.windows.net,1433;Database=SunriseDb;User Id=sunriseadmin;Password=<DB_PASSWORD>;Encrypt=True;TrustServerCertificate=False;"
```

If this fails, stop immediately and report the error — do not proceed to deployment.

> Stop the local API process before running migrations if it is currently running, otherwise the build will fail due to locked DLL files.

### 3. Build and publish

```powershell
dotnet publish -c Release -o ./publish -r linux-x64 --self-contained false
```

`-r linux-x64 --self-contained false` targets Linux and strips Windows runtime binaries, avoiding backslash path issues in the `runtimes/` folder.

### 4. Package as zip

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

### 5. Deploy to Azure App Service

```powershell
az webapp deploy --resource-group thesunrise-rg --name thesunrise-api --src-path ./publish.zip --type zip
```

### 6. Verify deployment

```powershell
Invoke-RestMethod -Uri 'https://thesunrise-api.azurewebsites.net/health'
```

Expected: `{"status":"ok","timestamp":"..."}` with HTTP 200.

### 7. Cleanup

```powershell
Remove-Item -Recurse -Force ./publish
Remove-Item ./publish.zip
```

---

## Notes

- **appsettings.Production.json must not exist.** It is gitignored and was deleted intentionally. All production config (connection string, `ASPNETCORE_ENVIRONMENT`, `FIREBASE_SERVICE_ACCOUNT`) is stored as encrypted Azure App Service settings, never in files.
- **Always run migrations before deploying code** — new code may depend on the updated schema.
- If migrations fail, the old code is still running so the app stays functional. Fix and retry.
- If deployment fails after migrations, the schema is ahead of the code — roll back or fix forward quickly.
- Swagger is disabled in production (`!IsProduction()` gate in `Program.cs`).
- The free App Service plan (F1) has a 60 CPU-minute/day limit. The Azure SQL free tier auto-pauses after inactivity and resumes on the next connection (first request may be slow).
