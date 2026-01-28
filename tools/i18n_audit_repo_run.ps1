Param(
  [string]$Root = $(Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [int]$MaxFindings = 5000
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Web | Out-Null

$CjkRegex = '[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]'

function Has-CJK([string]$s) {
  if ([string]::IsNullOrEmpty($s)) { return $false }
  return [regex]::IsMatch($s, $script:CjkRegex)
}

function Has-Latin([string]$s) {
  if ([string]::IsNullOrEmpty($s)) { return $false }
  return [regex]::IsMatch($s, '[A-Za-z]')
}

function Get-RelPath([string]$full) {
  $root = (Resolve-Path $script:Root).Path
  if ($full.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
    $rel = $full.Substring($root.Length).TrimStart('\','/')
    return ($rel -replace '\\','/')
  }
  return ($full -replace '\\','/')
}

function Get-LineNumber([string]$text, [int]$index) {
  if ($index -lt 0) { return 1 }
  if ([string]::IsNullOrEmpty($text)) { return 1 }
  $prefix = $text.Substring(0, [Math]::Min($index, $text.Length))
  return (($prefix -split "`n", 0).Count)
}

function Get-OneLineSnippet([string]$text, [int]$index, [int]$maxLen = 180) {
  if ([string]::IsNullOrEmpty($text)) { return '' }
  $start = $text.LastIndexOf("`n", [Math]::Max(0, $index))
  if ($start -lt 0) { $start = 0 } else { $start++ }
  $end = $text.IndexOf("`n", [Math]::Max(0, $index))
  if ($end -lt 0) { $end = $text.Length }
  $line = $text.Substring($start, [Math]::Max(0, $end - $start))
  $line = ($line -replace "\s+", ' ').Trim()
  if ($line.Length -gt $maxLen) { $line = $line.Substring(0, $maxLen) + '...' }
  return $line
}

function Strip-Tags([string]$html) {
  if ([string]::IsNullOrEmpty($html)) { return '' }
  $s = [regex]::Replace($html, '<[^>]+>', ' ')
  $s = [System.Web.HttpUtility]::HtmlDecode($s)
  return ($s -replace "\s+", ' ').Trim()
}

function Get-ObjectBlockInfo([string]$text, [string]$label) {
  $pattern = [regex]::Escape($label) + '\s*:\s*\{'
  $m = [regex]::Match($text, $pattern)
  if (-not $m.Success) { return $null }
  $startBrace = $text.IndexOf('{', $m.Index)
  if ($startBrace -lt 0) { return $null }

  $depth = 0
  $inSingle = $false
  $inDouble = $false
  $escape = $false
  $blockStart = $null

  for ($i = $startBrace; $i -lt $text.Length; $i++) {
    $ch = $text[$i]

    if ($escape) { $escape = $false; continue }
    if (($inSingle -or $inDouble) -and $ch -eq '\\') { $escape = $true; continue }

    if (-not $inDouble -and $ch -eq "'") { $inSingle = -not $inSingle; continue }
    if (-not $inSingle -and $ch -eq '"') { $inDouble = -not $inDouble; continue }
    if ($inSingle -or $inDouble) { continue }

    if ($ch -eq '{') {
      $depth++
      if ($depth -eq 1) { $blockStart = $i + 1 }
      continue
    }
    if ($ch -eq '}') {
      $depth--
      if ($depth -eq 0 -and $blockStart -ne $null) {
        $blockEnd = $i - 1
        $block = $text.Substring($blockStart, $blockEnd - $blockStart + 1)
        return [pscustomobject]@{ Block = $block; StartIndex = $blockStart; EndIndex = $blockEnd }
      }
      continue
    }
  }

  return $null
}

function Get-KeysFromBlock([string]$block) {
  $keys = New-Object System.Collections.Generic.HashSet[string]
  if ([string]::IsNullOrEmpty($block)) { return $keys }

  foreach ($m in [regex]::Matches($block, '(?m)^\s*([A-Za-z0-9_]+)\s*:')) {
    $k = $m.Groups[1].Value
    if ($k) { $null = $keys.Add($k) }
  }

  return $keys
}

$findings = New-Object System.Collections.Generic.List[object]
function Add-Finding([string]$severity, [string]$file, [int]$line, [string]$type, [string]$snippet, [string]$reason, [string]$suggestion) {
  if ($findings.Count -ge $script:MaxFindings) { return }
  $findings.Add([pscustomobject]@{
    severity = $severity
    file = $file
    line = $line
    type = $type
    snippet = $snippet
    reason = $reason
    suggestion = $suggestion
  }) | Out-Null
}

$allowedTokens = @(
  'WaiKwan','WKAN','OEM','ODM','PDF','WhatsApp','Email','US','USA','AU','MOQ',
  '600D','420D','300D','50mm','40mm','32mm','25mm','20GP','40HQ',
  'CE','RoHS','ISO','RGB','CMYK','Pantone','UV','PVC','TPU','Oxford',
  'Aluminum','Aluminium','Fiberglass','Steel','Iron',
  'BCD','HEX','mm','cm','m','kg','g','V','A','Hz'
)
$allowedTokenSet = New-Object System.Collections.Generic.HashSet[string] ([StringComparer]::OrdinalIgnoreCase)
$allowedTokens | ForEach-Object { $null = $allowedTokenSet.Add($_) }

function Find-DisallowedLatinTokens([string]$text) {
  $bad = New-Object System.Collections.Generic.List[string]
  if ([string]::IsNullOrEmpty($text)) { return $bad }

  foreach ($t in [regex]::Matches($text, '[A-Za-z]{3,}')) {
    $tok = $t.Value
    $isAcronym = ($tok -cmatch '^[A-Z]{2,6}$')
    $isModel = ($tok -cmatch '^(WK[-_][A-Za-z0-9]+)$')
    if ($allowedTokenSet.Contains($tok) -or $isAcronym -or $isModel) { continue }
    if (-not $bad.Contains($tok)) { $bad.Add($tok) | Out-Null }
  }

  return $bad
}

$mlPath = Join-Path $Root 'scripts\multilang.js'
$mlText = Get-Content $mlPath -Raw -Encoding UTF8

$enInfo = Get-ObjectBlockInfo $mlText 'en'
$zhInfo = Get-ObjectBlockInfo $mlText 'zh'
if (-not $enInfo -or -not $zhInfo) {
  throw "Failed to parse en/zh blocks from scripts/multilang.js"
}

$enKeys = Get-KeysFromBlock $enInfo.Block
$zhKeys = Get-KeysFromBlock $zhInfo.Block

# P2: dictionary mismatch
foreach ($k in $enKeys) {
  if (-not $zhKeys.Contains($k)) {
    Add-Finding 'P2' (Get-RelPath $mlPath) (Get-LineNumber $mlText $enInfo.StartIndex) 'missing_zh_key' "key: $k" 'Key exists in en dictionary but not zh.' 'Add this key to zh translations.'
  }
}
foreach ($k in $zhKeys) {
  if (-not $enKeys.Contains($k)) {
    Add-Finding 'P2' (Get-RelPath $mlPath) (Get-LineNumber $mlText $zhInfo.StartIndex) 'missing_en_key' "key: $k" 'Key exists in zh dictionary but not en.' 'Add this key to en translations.'
  }
}

# P0/P1: scan dictionary values only
# Note: single-quoted PowerShell strings require doubling single-quotes.
$kvPattern = '(?m)^\s*([A-Za-z0-9_]+)\s*:\s*([''"])(.*?)\2'

foreach ($m in [regex]::Matches($enInfo.Block, $kvPattern)) {
  $key = $m.Groups[1].Value
  $val = $m.Groups[3].Value
  if (Has-CJK $val) {
    $globalIndex = $enInfo.StartIndex + $m.Index
    Add-Finding 'P0' (Get-RelPath $mlPath) (Get-LineNumber $mlText $globalIndex) 'en_value_contains_cjk' ($key + ': ' + (Get-OneLineSnippet $mlText $globalIndex)) 'English dictionary value contains CJK (Han characters).' 'Move Chinese into zh value (or split into zh/en spans) so English mode shows no Chinese.'
  }
}

foreach ($m in [regex]::Matches($zhInfo.Block, $kvPattern)) {
  $key = $m.Groups[1].Value
  $val = $m.Groups[3].Value
  if (-not (Has-Latin $val)) { continue }

  $badList = @(Find-DisallowedLatinTokens $val)
  if ($badList.Count -gt 0) {
    $badTok = $badList[0]
    $globalIndex = $zhInfo.StartIndex + $m.Index
    Add-Finding 'P1' (Get-RelPath $mlPath) (Get-LineNumber $mlText $globalIndex) 'zh_value_contains_english_token' ($key + ': ' + (Get-OneLineSnippet $mlText $globalIndex)) ("Chinese dictionary value contains English token '$badTok' (len>=3) not in allowed list.") ("If '$badTok' is not a brand/model/material/unit, translate it to Chinese or split into zh/en spans.")
  }
}

$usedKeys = New-Object System.Collections.Generic.HashSet[string]

$scanFiles = Get-ChildItem -Path $Root -Recurse -File -Include *.html,*.js |
  Where-Object {
    $_.FullName -notmatch '\\images\\' -and
    $_.FullName -notmatch '\\data\\' -and
    $_.FullName -notmatch '\\dist\\' -and
    $_.FullName -notmatch '\\node_modules\\' -and
    $_.FullName -notmatch '\\\.git\\'
  }

foreach ($f in $scanFiles) {
  $rel = Get-RelPath $f.FullName
  $text = Get-Content $f.FullName -Raw -Encoding UTF8
  if ($null -eq $text) { $text = '' }

  foreach ($m in [regex]::Matches($text, 'data-(?:translate|i18n)(?:-[a-z-]+)?\s*=\s*(?:"([^"]+)"|''([^'']+)'')')) {
    $k = $m.Groups[1].Value
    if (-not $k) { $k = $m.Groups[2].Value }
    if ($k) { $null = $usedKeys.Add($k) }
  }
  foreach ($m in [regex]::Matches($text, 'wkI18n\.t\(\s*["'']([^"'']+)["'']')) {
    $k = $m.Groups[1].Value
    if ($k) { $null = $usedKeys.Add($k) }
  }
  foreach ($m in [regex]::Matches($text, '(?:multiLang|window\.multiLang)\.t\(\s*["'']([^"'']+)["'']')) {
    $k = $m.Groups[1].Value
    if ($k) { $null = $usedKeys.Add($k) }
  }

  if ($f.Extension -ieq '.html') {
    foreach ($m in [regex]::Matches($text, '(?is)<([a-z0-9]+)[^>]*class\s*=\s*["''][^"'']*\ben\b[^"'']*["''][^>]*>(.*?)</\1>')) {
      $inner = Strip-Tags $m.Groups[2].Value
      if (Has-CJK $inner) {
        $idx = $m.Index
        Add-Finding 'P0' $rel (Get-LineNumber $text $idx) 'html_en_contains_cjk' (Get-OneLineSnippet $text $idx) 'An element marked as .en contains CJK (Han characters).' 'Move the Chinese text into a .zh element or an i18n key; keep .en text English-only.'
      }
    }

    foreach ($m in [regex]::Matches($text, '(?is)<([a-z0-9]+)[^>]*class\s*=\s*["''][^"'']*\bzh\b[^"'']*["''][^>]*>(.*?)</\1>')) {
      $inner = Strip-Tags $m.Groups[2].Value
      $badList = @(Find-DisallowedLatinTokens $inner)
      if ($badList.Count -gt 0) {
        $idx = $m.Index
        Add-Finding 'P1' $rel (Get-LineNumber $text $idx) 'html_zh_contains_english_token' (Get-OneLineSnippet $text $idx) ("An element marked as .zh contains English token '$($badList[0])' (len>=3) not in allowed list.") 'Translate to Chinese or split into zh/en spans; keep allowed brand/model/material/unit tokens only.'
      }
    }

    # P2: hardcoded user-visible text outside .zh/.en wrappers (heuristic; audit only)
    $lines = $text -split "`n", 0
    $inScript = $false
    $inStyle = $false
    for ($i = 0; $i -lt $lines.Count; $i++) {
      $ln = $lines[$i]

      if ($ln -match '<script\b') { $inScript = $true }
      if ($ln -match '<style\b') { $inStyle = $true }

      if ($inScript -or $inStyle) {
        if ($ln -match '</script>') { $inScript = $false }
        if ($ln -match '</style>') { $inStyle = $false }
        continue
      }

      if ($ln -match 'class\s*=\s*["''][^"'']*\b(zh|en)\b') { continue }
      if ($ln -match 'data-(translate|i18n)') { continue }

      $visible = Strip-Tags $ln
      if ([string]::IsNullOrWhiteSpace($visible)) { continue }

      if (Has-CJK $visible) {
        Add-Finding 'P2' $rel ($i + 1) 'html_hardcoded_cjk_outside_lang_wrapper' (($ln -replace '\s+',' ').Trim()) 'CJK appears in user-visible HTML line not under a .zh wrapper or i18n key.' 'Wrap in a .zh element (paired with .en), or replace with data-i18n key.'
        continue
      }

      $badList2 = @(Find-DisallowedLatinTokens $visible)
      if ($badList2.Count -gt 0) {
        Add-Finding 'P2' $rel ($i + 1) 'html_hardcoded_english_outside_lang_wrapper' (($ln -replace '\s+',' ').Trim()) ("English text appears outside .en wrapper/i18n key (e.g., '$($badList2[0])').") 'Wrap in a .en element (paired with .zh), or replace with data-i18n key.'
      }
    }
  }

  if ($f.Extension -ieq '.js' -and $rel -ne 'scripts/multilang.js') {
    $lines = $text -split "`n", 0
    for ($i = 0; $i -lt $lines.Count; $i++) {
      $ln = $lines[$i]

      # P2: hardcoded Chinese or English sentences in JS (heuristic: focus on string literals)
      foreach ($m in [regex]::Matches($ln, '(["''])(?:\\.|(?!\1).)*\1')) {
        $lit = $m.Value
        if ($lit.Length -lt 3) { continue }
        $content = $lit.Substring(1, $lit.Length - 2)

        if (Has-CJK $content) {
          Add-Finding 'P2' $rel ($i + 1) 'js_hardcoded_cjk_string' (($ln -replace '\s+',' ').Trim()) 'CJK appears in a JS string literal; this will be hardcoded in all languages.' 'Move the text into HTML .zh/.en blocks or use wkI18n.t(KEY) with dictionary entries.'
          continue
        }

        $badJs = @(Find-DisallowedLatinTokens $content)
        $wordCount = ([regex]::Matches($content, '[A-Za-z]{3,}')).Count
        if ($badJs.Count -gt 0 -and $wordCount -ge 2 -and $content -match '\s') {
          Add-Finding 'P2' $rel ($i + 1) 'js_hardcoded_english_string' (($ln -replace '\s+',' ').Trim()) ("English sentence/label appears in a JS string literal (e.g., '$($badJs[0])').") 'Move the text into HTML .zh/.en blocks or use wkI18n.t(KEY) with dictionary entries.'
        }
      }
    }
  }
}

# P2: used keys missing in dictionaries
foreach ($k in $usedKeys) {
  if (-not $enKeys.Contains($k) -or -not $zhKeys.Contains($k)) {
    $missing = @()
    if (-not $enKeys.Contains($k)) { $missing += 'en' }
    if (-not $zhKeys.Contains($k)) { $missing += 'zh' }
    Add-Finding 'P2' (Get-RelPath $mlPath) 1 'used_key_missing_translation' "key: $k" ("data-i18n/data-translate key is used but missing translations: " + ($missing -join ', ') + '.') ("Define key in: " + ($missing -join ', ') + ' translations.')
  }
}

# Deduplicate
$uniq = @{}
$final = foreach ($x in $findings) {
  $k = ($x.severity + '|' + $x.file + '|' + $x.line + '|' + $x.type + '|' + $x.snippet)
  if (-not $uniq.ContainsKey($k)) { $uniq[$k] = $true; $x }
}

$severityOrder = @{ P0 = 0; P1 = 1; P2 = 2; P3 = 3 }
$final = $final | Where-Object { $_.severity -in @('P0','P1','P2') } | Sort-Object @{Expression={ $severityOrder[$_.severity] }}, file, line

# Write outputs (JSON schema strictly per spec)
$jsonOut = $final | Select-Object severity,file,line,type,snippet,suggestion
$jsonOut | ConvertTo-Json -Depth 6 | Out-File -FilePath (Join-Path $Root 'i18n_audit_summary.json') -Encoding UTF8

$counts = foreach ($sev in @('P0','P1','P2')) {
  $c = @($final | Where-Object { $_.severity -eq $sev }).Count
  [pscustomobject]@{ severity = $sev; count = $c }
}

$md = New-Object System.Collections.Generic.List[string]
$md.Add('# i18n Audit Report') | Out-Null
$md.Add('') | Out-Null
$md.Add(('Generated: ' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))) | Out-Null
$md.Add('') | Out-Null
$md.Add(('Max findings cap: ' + $MaxFindings + ' (report may be truncated if exceeded)')) | Out-Null
$md.Add('') | Out-Null
$md.Add('## Summary Counts') | Out-Null
$md.Add('') | Out-Null
$md.Add('| Severity | Count |') | Out-Null
$md.Add('|---|---:|') | Out-Null
foreach ($c in $counts) { $md.Add(('| ' + $c.severity + ' | ' + $c.count + ' |')) | Out-Null }
$md.Add('') | Out-Null
$md.Add('## Findings') | Out-Null
$md.Add('') | Out-Null

foreach ($sev in @('P0','P1','P2')) {
  $group = $final | Where-Object { $_.severity -eq $sev }
  if (-not $group -or $group.Count -eq 0) { continue }
  $md.Add(('### ' + $sev)) | Out-Null
  $md.Add('') | Out-Null
  foreach ($it in $group) {
    $md.Add(('- **' + $it.type + '** - ' + $it.file + ':' + $it.line)) | Out-Null
    $md.Add(('  - Snippet: ' + $it.snippet)) | Out-Null
    $md.Add(('  - Reason: ' + $it.reason)) | Out-Null
    $md.Add(('  - Suggestion: ' + $it.suggestion)) | Out-Null
  }
  $md.Add('') | Out-Null
}

$md | Out-File -FilePath (Join-Path $Root 'i18n_audit_report.md') -Encoding UTF8

Write-Host ("Audit done. Findings: {0}" -f $final.Count)
Write-Host ($counts | Format-Table -AutoSize | Out-String)
Write-Host "Top 10 P0:"
if ((@($final | Where-Object severity -eq 'P0').Count) -eq 0) {
  Write-Host "(none)"
} else {
  Write-Host (($final | Where-Object severity -eq 'P0' | Select-Object -First 10 file,line,type | Format-Table -AutoSize | Out-String))
}
if ($findings.Count -ge $MaxFindings) { Write-Warning "Findings hit cap ($MaxFindings)." }
