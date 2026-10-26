$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
$app = Join-Path $root "application"

$workerPath = Join-Path $app "worker.js"
$outputPath = Join-Path $app "worker-deploy.js"

$worker = [System.IO.File]::ReadAllText($workerPath)

if ([string]::IsNullOrWhiteSpace($worker)) {
    throw "ERROR: worker.js is empty."
}

$files = @{
    "__INDEX_HTML__" = "index.html"
    "__STYLE_CSS__"  = "style.css"
    "__SCRIPT_JS__"  = "script.js"
}

foreach ($placeholder in $files.Keys) {
    $filePath = Join-Path $app $files[$placeholder]

    if (-not (Test-Path $filePath)) {
        throw "Missing file: $filePath"
    }

    $content = [System.IO.File]::ReadAllText($filePath)

    if ([string]::IsNullOrWhiteSpace($content)) {
        throw "File is empty: $filePath"
    }

    if (-not $worker.Contains($placeholder)) {
        throw "Missing placeholder: $placeholder"
    }

    $encoded = ConvertTo-Json -InputObject ([string]$content) -Compress

    $worker = $worker.Replace($placeholder, $encoded)
}

$utf8 = New-Object System.Text.UTF8Encoding($false)

[System.IO.File]::WriteAllText(
    $outputPath,
    $worker,
    $utf8
)

Write-Host "Worker build completed successfully!"