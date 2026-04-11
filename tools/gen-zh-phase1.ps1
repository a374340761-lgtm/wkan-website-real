$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }
$zh = Join-Path $root 'zh'
New-Item -ItemType Directory -Force -Path $zh | Out-Null

function Test-MirrorRelative([string]$pathOnly) {
    return $pathOnly -match '^(index|product-center|all-products|product-detail|custom-canopy-tent-manufacturer)\.html$'
}

function Convert-AbsAssets([string]$html) {
    $h = $html -replace 'href="styles/', 'href="/styles/'
    $h = $h -replace 'src="scripts/', 'src="/scripts/'
    $h = $h -replace 'src="images/', 'src="/images/'
    $h = $h -replace 'href="images/', 'href="/images/'
    $h = $h -replace 'href="favicon', 'href="/favicon'
    $h = $h -replace 'href="site.webmanifest"', 'href="/site.webmanifest"'
    return $h
}

function Convert-AbsPageLinks([string]$html) {
    $pattern = 'href="([^"]+)"'
    return [regex]::Replace($html, $pattern, {
        param($match)
        $p = $match.Groups[1].Value
        if ($p -match '^https?:') { return $match.Value }
        if ($p.StartsWith('#') -or $p.StartsWith('/')) { return $match.Value }
        if ($p -match '^mailto:' -or $p -match '^tel:') { return $match.Value }
        $pathOnly = ($p -split '#')[0]
        $pathOnly = ($pathOnly -split '\?')[0]
        if (Test-MirrorRelative $pathOnly) { return $match.Value }
        return 'href="/' + $p + '"'
    })
}

$files = @(
    'index.html',
    'product-center.html',
    'all-products.html',
    'product-detail.html',
    'custom-canopy-tent-manufacturer.html'
)

foreach ($f in $files) {
    $src = Join-Path $root $f
    $c = Get-Content -LiteralPath $src -Raw -Encoding UTF8
    $c = Convert-AbsAssets $c
    $c = Convert-AbsPageLinks $c
    $dest = Join-Path $zh $f
    [System.IO.File]::WriteAllText($dest, $c, [System.Text.UTF8Encoding]::new($false))
    Write-Host "wrote zh/$f"
}
