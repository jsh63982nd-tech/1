$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

if (Test-Path ".\gradlew.bat") {
    & ".\gradlew.bat" assembleDebug
    exit $LASTEXITCODE
}

$gradle = Get-Command gradle -ErrorAction SilentlyContinue
if ($null -eq $gradle) {
    Write-Error "Gradle이 없습니다. JDK 17과 Gradle 8.10.2를 설치하거나 Gradle Wrapper를 추가한 뒤 다시 실행하세요."
}

& gradle assembleDebug
exit $LASTEXITCODE
