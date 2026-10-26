
$ErrorActionPreference = "Stop"

$folder = $PSScriptRoot

$html = Get-Content "$folder\index.html" -Raw
$css = Get-Content "$folder\style.css" -Raw
$js = Get-Content "$folder\script.js" -Raw
$worker = Get-Content "$folder\worker.js" -Raw

Add-Type -AssemblyName System.Web.Extensions

$serializer = New-Object System.Web.Script.Serialization.JavaScriptSerializer
$serializer.MaxJsonLength = 10485760

$htmlJson = $serializer.Serialize($html)
$cssJson = $serializer.Serialize($css)
$jsJson = $serializer.Serialize($js)

Write-Host "Frontend files converted successfully"

# Generate a Worker that serves the frontend and existing API.
$prefix = @"
const FRONTEND_HTML = $htmlJson;
const FRONTEND_CSS = $cssJson;
const FRONTEND_JS = $jsJson;

"@

# Insert frontend routing into the existing fetch handler.
$pattern = 'const url = new URL\(request\.url\);'

$replacement = @'
const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return new Response(FRONTEND_HTML, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    if (request.method === "GET" && url.pathname === "/style.css") {
      return new Response(FRONTEND_CSS, {
        headers: { "Content-Type": "text/css; charset=utf-8" }
      });
    }

    if (request.method === "GET" && url.pathname === "/script.js") {
      return new Response(FRONTEND_JS, {
        headers: { "Content-Type": "application/javascript; charset=utf-8" }
      });
    }
'@

if ($worker -notmatch $pattern) {
    throw "Could not find URL routing in worker.js. Check your worker code."
}

$worker = [regex]::Replace(
    $worker,
    $pattern,
    [System.Text.RegularExpressions.MatchEvaluator] {
        param($match)
        return $replacement
    },
    1
)

$output = $prefix + $worker

Set-Content -Path "$folder\worker-deploy.js" -Value $output -Encoding UTF8

Write-Host "Generated application/worker-deploy.js successfully."
