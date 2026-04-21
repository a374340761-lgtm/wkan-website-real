# Full /zh/ mirror builder: copies EN HTML to zh/ with absolute assets, internal /zh/ links, and Chinese head tags.
# Run from repo root: powershell -ExecutionPolicy Bypass -File tools/build-zh-full.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$metaPath = Join-Path $PSScriptRoot 'zh-seo-meta.json'
$metaObj = Get-Content -LiteralPath $metaPath -Raw -Encoding UTF8 | ConvertFrom-Json
$metaHt = @{}
$metaObj.PSObject.Properties | ForEach-Object { $metaHt[$_.Name] = @{ title = $_.Value.title; description = $_.Value.description } }
$termMapPath = Join-Path $PSScriptRoot 'zh-term-map.json'
$script:TermPairs = @((Get-Content -LiteralPath $termMapPath -Raw -Encoding UTF8 | ConvertFrom-Json) | Sort-Object { -$_.from.Length })
$script:TitleSuffix = (Get-Content -LiteralPath (Join-Path $PSScriptRoot 'zh-title-suffix.txt') -Encoding UTF8 -Raw).Trim()

$RootPages = @(
    'index.html', 'product-center.html', 'all-products.html', 'product-detail.html',
    'custom-canopy-tent-manufacturer.html', 'beach-flag-supplier.html', 'portable-display-systems.html',
    'seg-light-box-manufacturer.html', 'aluminum-folding-tent.html', 'tension-fabric-backwall.html',
    'products.html', 'products-flags.html', 'products-displays.html', 'products-lightbox.html',
    'products-furniture.html', 'products-inflatable.html', 'products-custom.html', 'products-accessories.html',
    'pop-up-display-stands.html', 'tent-type.html', 'flag-type.html', 'dome-type.html', 'furniture-type.html',
    'racegate-type.html', 'six-sided-booth.html',
    'faq.html', 'faq-moq.html', 'faq-artwork-files.html', 'faq-shipping.html', 'faq-samples.html', 'faq-lead-time.html',
    'faq-color-matching.html', 'terms.html', 'privacy.html', 'site-map.html'
)
$NewsPages = @('news/index.html', 'news/apppexpo-2026-shanghai.html')
$SeoPages = @(Get-ChildItem -LiteralPath (Join-Path $root 'seo') -Filter '*.html' | ForEach-Object { 'seo/' + $_.Name })
$AllSources = $RootPages + $NewsPages + $SeoPages

$MirrorNorm = @{}
foreach ($rel in $AllSources) {
    $n = '/' + ($rel -replace '\\', '/')
    $MirrorNorm[$n] = $true
}
$MirrorNorm['/index.html'] = $true

function ConvertTo-AbsoluteAssets([string]$html, [string]$rel) {
    $h = $html
    $h = $h -replace '<script src="\.\./\.\./scripts/', '<script src="/scripts/'
    $h = $h -replace '<script src="\.\./scripts/', '<script src="/scripts/'
    $h = $h -replace '<script src="scripts/', '<script src="/scripts/'
    $h = $h -replace 'href="\.\./\.\./styles/', 'href="/styles/'
    $h = $h -replace 'href="\.\./styles/', 'href="/styles/'
    $h = $h -replace 'href="styles/', 'href="/styles/'
    # Logos / shared assets under site-root images/
    $h = $h -replace 'src="\.\./\.\./images/', 'src="/images/'
    $h = $h -replace 'src="\.\./images/', 'src="/images/'
    # Under news/, unqualified images/ means news/images/ (not /images/)
    if ($rel -match '(?i)^news/') {
        $h = $h -replace 'src="images/', 'src="/news/images/'
        $h = $h -replace 'href="images/', 'href="/news/images/'
    } else {
        $h = $h -replace 'src="images/', 'src="/images/'
        $h = $h -replace 'href="images/', 'href="/images/'
    }
    $h = $h -replace 'href="\.\./\.\./images/', 'href="/images/'
    $h = $h -replace 'href="\.\./images/', 'href="/images/'
    $h = $h -replace 'href="\.\./\.\./favicon', 'href="/favicon'
    $h = $h -replace 'href="\.\./favicon', 'href="/favicon'
    $h = $h -replace 'href="favicon', 'href="/favicon'
    $h = $h -replace 'href="\.\./\.\./site\.webmanifest"', 'href="/site.webmanifest"'
    $h = $h -replace 'href="\.\./site\.webmanifest"', 'href="/site.webmanifest"'
    $h = $h -replace 'href="site\.webmanifest"', 'href="/site.webmanifest"'
    return $h
}

function Get-EnPathFromHref([string]$fromRel, [string]$href) {
    if ($href -match '^#') { return $null }
    if ($href -match '^(https?:|mailto:|tel:|javascript:)') { return $null }
    if ($href -match '^/styles/|^/scripts/|^/images/|^/news/images/|^/favicon') { return $null }
    try {
        $base = 'https://www.waikwantent.com/' + ($fromRel -replace '\\', '/')
        $u = New-Object System.Uri ([Uri]$base, $href)
        return $u.AbsolutePath
    } catch {
        return $null
    }
}

function Convert-HrefForZh([string]$html, [string]$fromRel, [hashtable]$mirrorSet) {
    return [regex]::Replace($html, 'href="([^"]+)"', {
            param($match)
            $full = $match.Groups[1].Value
            if ($full -match '^https?://') { return $match.Value }
            if ($full -match '^(mailto:|tel:|javascript:)') { return $match.Value }
            if ($full -match '^#') { return $match.Value }
            if ($full -match '^/styles/|^/scripts/|^/images/|^/news/images/|^/favicon|^/site\.webmanifest') { return $match.Value }
            if ($full -match '\.(css|js|png|jpg|jpeg|gif|webp|svg|ico|pdf)(\?|#|$)') {
                if ($full -notmatch '\.html') { return $match.Value }
            }
            $hash = ''
            if ($full -match '#') {
                $hash = '#' + ($full -split '#', 2)[1]
            }
            $qa = ($full -split '#', 2)[0]
            $q = ''
            $pathPart = $qa
            if ($qa -match '\?') {
                $pathPart = $qa.Split('?')[0]
                $q = '?' + ($qa.Split('?')[1])
            }
            if ([string]::IsNullOrEmpty($pathPart)) { return $match.Value }

            $enPath = Get-EnPathFromHref $fromRel $pathPart
            if (-not $enPath) { return $match.Value }

            if ($mirrorSet.ContainsKey($enPath)) {
                return ('href="/zh{0}{1}{2}"' -f $enPath, $q, $hash)
            }
            return ('href="{0}{1}{2}"' -f $enPath, $q, $hash)
        })
}

function Apply-TermMap([string]$t) {
    foreach ($row in $script:TermPairs) {
        $toVal = $row.to
        $pat = [regex]::Escape($row.from)
        $t = [regex]::Replace($t, $pat, $toVal, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    }
    return $t
}

function Convert-EnTitleToZh([string]$en) {
    $t = $en -replace '\s*\|\s*WaiKwan\s*$', '' -replace '\s*\|\s*Wai Kwan Tent[^|]*$', ''
    $t = Apply-TermMap $t
    if ($t.Length -gt 58) { $t = ($t.Substring(0, 55).Trim() + '...') }
    return ($t + ' | ' + $script:TitleSuffix)
}

function Get-EnMetaDesc([string]$html) {
    $m = [regex]::Match($html, '<meta\s+name="description"\s+content="([^"]*)"')
    if ($m.Success) { return $m.Groups[1].Value }
    return ''
}

function Convert-EnDescToZh([string]$en) {
    $t = Apply-TermMap $en
    if ($t.Length -gt 158) { return ($t.Substring(0, 155).Trim() + '...') }
    return $t
}

function Apply-ZhHead([string]$c, [string]$rel, [hashtable]$metaHt) {
    $enCanon = 'https://www.waikwantent.com/' + ($rel -replace '\\', '/')
    $zhCanon = 'https://www.waikwantent.com/zh/' + ($rel -replace '\\', '/')
    $title = $null
    $desc = $null
    if ($metaHt.ContainsKey($rel)) {
        $title = $metaHt[$rel].title
        $desc = $metaHt[$rel].description
    } elseif ($rel.StartsWith('seo/')) {
        if ($c -match '<title>([^<]+)</title>') { $title = Convert-EnTitleToZh $Matches[1] }
        else { $title = Convert-EnTitleToZh 'B2B manufacturing export guide' }
        $enD = Get-EnMetaDesc $c
        if ($enD) { $desc = Convert-EnDescToZh $enD } else { $desc = Apply-TermMap 'Guangxi WaiKwan Tent: OEM/ODM custom canopy tents, beach flags and display systems. Factory direct.' }
    } else {
        $title = Convert-EnTitleToZh 'Guangxi WaiKwan Tent Manufacturing'
        $desc = Apply-TermMap 'OEM/ODM custom canopy tents, beach flags and portable display systems. Factory direct, worldwide shipping.'
    }

    $escTitle = $title -replace '&', '&amp;'
    $escDesc = $desc -replace '&', '&amp;'

    $i0 = $c.IndexOf('<head>', [System.StringComparison]::OrdinalIgnoreCase)
    if ($i0 -lt 0) { $i0 = $c.IndexOf('<HEAD>') }
    $i1 = $c.IndexOf('</head>', [System.StringComparison]::OrdinalIgnoreCase)
    if ($i1 -lt 0) { $i1 = $c.IndexOf('</HEAD>') }
    if ($i0 -lt 0 -or $i1 -lt $i0) {
        Write-Warning "Missing head section: $rel"
        return $c
    }
    $headLen = $i1 - $i0 + '</head>'.Length
    $head = $c.Substring($i0, $headLen)

    $head = $head -replace '<title>[^<]*</title>\s*', "<title>$escTitle</title>`r`n    "
    $dSeek = '<meta name="description" content="'
    $dp = $head.IndexOf($dSeek, [System.StringComparison]::Ordinal)
    if ($dp -ge 0) {
        $dq = $head.IndexOf('"', $dp + $dSeek.Length)
        if ($dq -gt $dp) {
            $head = $head.Remove($dp, $dq - $dp + 1).Insert($dp, ($dSeek + $escDesc + '"'))
        }
    }
    $head = $head.Replace($enCanon, $zhCanon)
    $head = $head -replace '<meta\s+property="og:title"\s+content="[^"]*"', "<meta property=`"og:title`" content=`"$escTitle`""
    $head = $head -replace '<meta\s+property="og:description"\s+content="[^"]*"', "<meta property=`"og:description`" content=`"$escDesc`""
    $head = $head -replace '<meta\s+name="twitter:title"\s+content="[^"]*"', "<meta name=`"twitter:title`" content=`"$escTitle`""
    $head = $head -replace '<meta\s+name="twitter:description"\s+content="[^"]*"', "<meta name=`"twitter:description`" content=`"$escDesc`""
    if ($head -match 'twitter:url') {
        $head = $head -replace '<meta\s+name="twitter:url"\s+content="[^"]*"', "<meta name=`"twitter:url`" content=`"$zhCanon`""
    }
    if ($head -notmatch 'bilingual-routing\.js') {
        $head = $head -replace '(<script src="/scripts/seo\.js" defer></script>)', "<script src=`"/scripts/bilingual-routing.js`" defer></script>$([Environment]::NewLine)    `$1"
    }
    if ($rel -eq 'index.html') {
        $head = $head -replace 'https://www\.waikwantent\.com/">', 'https://www.waikwantent.com/zh/index.html">'
        $head = $head.Replace('https://www.waikwantent.com/index.html', 'https://www.waikwantent.com/zh/index.html')
    }
    $c = $c.Remove($i0, $headLen).Insert($i0, $head)
    $c = $c -replace '(?i)<html\s+lang="en"\s*>', '<html lang="zh-CN">'
    return $c
}

foreach ($rel in $AllSources) {
    $src = Join-Path $root $rel
    if (-not (Test-Path -LiteralPath $src)) {
        Write-Warning "Missing source: $rel"
        continue
    }
    $dest = Join-Path $root (Join-Path 'zh' $rel)
    $destDir = Split-Path -Parent $dest
    if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }

    $c = Get-Content -LiteralPath $src -Raw -Encoding UTF8
    $c = ConvertTo-AbsoluteAssets $c $rel
    $c = Convert-HrefForZh $c $rel $MirrorNorm
    $c = Apply-ZhHead $c $rel $metaHt

    if ($rel -eq 'product-detail.html') {
        $c = $c -replace "origin \+ '/product-detail\.html\?sku='", "origin + '/zh/product-detail.html?sku='"
        $c = $c -replace 'https://www\.waikwantent\.com/product-detail\.html', 'https://www.waikwantent.com/zh/product-detail.html'
    }

    [System.IO.File]::WriteAllText($dest, $c, [System.Text.UTF8Encoding]::new($false))
    Write-Host "OK zh/$($rel -replace '\\','/')"
}

# Emit MIRRORED_EN lines for scripts/bilingual-routing.js
$jsPaths = ($MirrorNorm.Keys | Sort-Object)
$sb = New-Object System.Text.StringBuilder
foreach ($p in $jsPaths) {
    [void]$sb.AppendLine("  '" + $p.Replace("'", "\'") + "': true,")
}
$snippetPath = Join-Path $PSScriptRoot 'zh-mirrored-en-snippet.txt'
[System.IO.File]::WriteAllText($snippetPath, $sb.ToString(), [System.Text.UTF8Encoding]::new($false))
Write-Host "Wrote snippet: $snippetPath (merge into bilingual-routing.js)"
