[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$MultiLangPath = Join-Path $Root 'scripts\multilang.js'

$HanRegex = [regex]'[\u4E00-\u9FFF]'
$EnTokenRegex = [regex]'[A-Za-z][A-Za-z0-9+./_-]*'
# Note: keep this conservative to avoid PowerShell quoting pitfalls; matches class attributes using double-quotes.
$ClassEnRegex = New-Object System.Text.RegularExpressions.Regex('class\s*=\s*"[^\"]*\ben\b[^\"]*"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$ClassZhRegex = New-Object System.Text.RegularExpressions.Regex('class\s*=\s*"[^\"]*\bzh\b[^\"]*"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$TranslateAttrRegex = New-Object System.Text.RegularExpressions.Regex('data-(?:translate|i18n)(?:-[a-z-]+)?="([^\"]+)"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

$AllowedTokens = @(
  'WaiKwan','WKAN','OEM','ODM','PDF','WhatsApp','Email','US','USA','AU','MOQ',
  '600D','420D','300D','50mm','40mm','32mm','25mm','20GP','40HQ','CE','RoHS','ISO',
  'RGB','CMYK','Pantone','UV','PVC','TPU','Oxford','Aluminum','Aluminium','Fiberglass',
  'Steel','Iron','BCD','HEX','mm','cm','m','kg','g','V','A','Hz'
)

$AllowedSet = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
$AllowedTokens | ForEach-Object { [void]$AllowedSet.Add($_) }

function Test-HasHan([string]$s){
  if([string]::IsNullOrWhiteSpace($s)){ return $false }
  return $HanRegex.IsMatch($s)
}

function Get-DisallowedEnglishTokens([string]$s){
  if([string]::IsNullOrWhiteSpace($s)){ return @() }

  $tokens = @()
  foreach($m in $EnTokenRegex.Matches($s)){
    $tok = $m.Value
    if($AllowedSet.Contains($tok)){ continue }

    if($tok -match '^\d+(?:\.\d+)?(?:mm|cm|m|kg|g|v|a|hz)$'){ continue }
    if($tok -match '^\d+(?:\.\d+)?[x×]\d+(?:\.\d+)?(?:mm|cm|m)?$'){ continue }
    # model/material-ish tokens: digits + letters/hyphen
    if(($tok -match '^(?:[A-Za-z]+)?\d+[A-Za-z0-9-]*$') -and ($tok -match '\d')){ continue }

    $tokens += $tok
  }

  return $tokens
}

function Get-OneLineSnippet([string]$line, [int]$maxLen=220){
  if($null -eq $line){ $line = '' }
  $s = $line.Trim()
  $s = [regex]::Replace($s, '\s+', ' ')
  if($s.Length -gt $maxLen){
    return $s.Substring(0, $maxLen-1) + '…'
  }
  return $s
}

function Remove-HtmlTags([string]$line){
  if([string]::IsNullOrWhiteSpace($line)){ return '' }
  $s = [regex]::Replace($line, '<[^>]*>', ' ')
  $s = $s -replace '&nbsp;', ' '
  $s = [regex]::Replace($s, '\s+', ' ')
  return $s.Trim()
}

function New-Finding(
  [string]$severity,
  [string]$file,
  [int]$line,
  [string]$type,
  [string]$snippet,
  [string]$suggestion
){
  [pscustomobject]@{
    severity   = $severity
    file       = $file
    line       = $line
    type       = $type
    snippet    = $snippet
    suggestion = $suggestion
  }
}

function Get-LineFromIndex([string]$text, [int]$index){
  if($index -le 0){ return 1 }
  $prefix = $text.Substring(0, [Math]::Min($index, $text.Length))
  return ($prefix -split "`n", -1).Count
}

function Extract-LangBlock([string]$jsText, [string]$lang){
  $idx = $jsText.IndexOf("$lang:")
  if($idx -lt 0){ return $null }

  $brace = $jsText.IndexOf('{', $idx)
  if($brace -lt 0){ return $null }

  $i = $brace
  $depth = 0
  $inS = $false
  $inD = $false
  $inB = $false
  $inLine = $false
  $inBlock = $false
  $escape = $false

  while($i -lt $jsText.Length){
    $ch = $jsText[$i]
    $nxt = if($i+1 -lt $jsText.Length){ $jsText[$i+1] } else { '' }

    if($inLine){
      if($ch -eq "`n"){ $inLine = $false }
      $i++; continue
    }
    if($inBlock){
      if($ch -eq '*' -and $nxt -eq '/'){ $inBlock = $false; $i += 2; continue }
      $i++; continue
    }

    if($inS -or $inD -or $inB){
      if($escape){ $escape = $false; $i++; continue }
      if($ch -eq [char]92){ $escape = $true; $i++; continue }
      if($inS -and $ch -eq "'"){ $inS = $false }
      elseif($inD -and $ch -eq '"'){ $inD = $false }
      elseif($inB -and $ch -eq [char]96){ $inB = $false }
      $i++; continue
    }

    if($ch -eq '/' -and $nxt -eq '/'){ $inLine = $true; $i += 2; continue }
    if($ch -eq '/' -and $nxt -eq '*'){ $inBlock = $true; $i += 2; continue }

    if($ch -eq "'"){ $inS = $true; $i++; continue }
    if($ch -eq '"'){ $inD = $true; $i++; continue }
    if($ch -eq [char]96){ $inB = $true; $i++; continue }

    if($ch -eq '{'){ $depth++; $i++; continue }
    if($ch -eq '}'){
      $depth--
      $i++
      if($depth -eq 0){
        $end = $i
        return [pscustomobject]@{
          startIndex = $brace
          endIndex   = $end
          startLine  = (Get-LineFromIndex $jsText $brace)
          text       = $jsText.Substring($brace, $end - $brace)
        }
      }
      continue
    }

    $i++
  }

  return $null
}

function Extract-LangKeys([string]$jsText, [string]$lang){
  $block = Extract-LangBlock $jsText $lang
  if($null -eq $block){
    return (New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::Ordinal))
  }

  $keys = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::Ordinal)

  $text = $block.text
  $i = 0
  $depth = 0
  $inS = $false
  $inD = $false
  $inB = $false
  $inLine = $false
  $inBlock = $false
  $escape = $false

  function SkipWs([string]$s, [int]$pos){
    while($pos -lt $s.Length -and [char]::IsWhiteSpace($s[$pos])){ $pos++ }
    return $pos
  }

  while($i -lt $text.Length){
    $ch = $text[$i]
    $nxt = if($i+1 -lt $text.Length){ $text[$i+1] } else { '' }

    if($inLine){ if($ch -eq "`n"){ $inLine = $false }; $i++; continue }
    if($inBlock){ if($ch -eq '*' -and $nxt -eq '/'){ $inBlock = $false; $i += 2; continue }; $i++; continue }

    if($inS -or $inD -or $inB){
      if($escape){ $escape = $false; $i++; continue }
      if($ch -eq [char]92){ $escape = $true; $i++; continue }
      if($inS -and $ch -eq "'"){ $inS = $false }
      elseif($inD -and $ch -eq '"'){ $inD = $false }
      elseif($inB -and $ch -eq [char]96){ $inB = $false }
      $i++; continue
    }

    if($ch -eq '/' -and $nxt -eq '/'){ $inLine = $true; $i += 2; continue }
    if($ch -eq '/' -and $nxt -eq '*'){ $inBlock = $true; $i += 2; continue }

    if($ch -eq "'"){ $inS = $true; $i++; continue }
    if($ch -eq '"'){ $inD = $true; $i++; continue }
    if($ch -eq [char]96){ $inB = $true; $i++; continue }

    if($ch -eq '{'){ $depth++; $i++; continue }
    if($ch -eq '}'){ $depth--; $i++; continue }

    if($depth -eq 1){
      $j = SkipWs $text $i
      if($j -ge $text.Length){ break }

      # quoted key
      if($text[$j] -eq "'" -or $text[$j] -eq '"'){
        $q = $text[$j]
        $k = $j + 1
        $buf = New-Object System.Text.StringBuilder
        $esc = $false
        while($k -lt $text.Length){
          $c = $text[$k]
          if($esc){ [void]$buf.Append($c); $esc = $false }
          elseif($c -eq [char]92){ $esc = $true }
          elseif($c -eq $q){ break }
          else { [void]$buf.Append($c) }
          $k++
        }
        if($k -lt $text.Length -and $text[$k] -eq $q){
          $k++
          $k = SkipWs $text $k
          if($k -lt $text.Length -and $text[$k] -eq ':'){
            [void]$keys.Add($buf.ToString())
            $i = $k + 1
            continue
          }
        }
      }

      # identifier key
      $rest = $text.Substring($j)
      $m = [regex]::Match($rest, '^[A-Za-z_$][A-Za-z0-9_$]*')
      if($m.Success){
        $key = $m.Value
        $k = $j + $key.Length
        $k = SkipWs $text $k
        if($k -lt $text.Length -and $text[$k] -eq ':'){
          [void]$keys.Add($key)
          $i = $k + 1
          continue
        }
      }
    }

    $i++
  }

  return $keys
}

# --- Load translations keys ---
if(!(Test-Path $MultiLangPath)){
  throw "Missing scripts/multilang.js at $MultiLangPath"
}
$MultiLangText = Get-Content $MultiLangPath -Raw -Encoding UTF8
$ZhKeys = Extract-LangKeys $MultiLangText 'zh'
$EnKeys = Extract-LangKeys $MultiLangText 'en'

# --- Scan files ---
$Findings = New-Object System.Collections.Generic.List[object]

# Track i18n key usage occurrences for P2 reporting
$KeyFirstUse = @{}  # key -> @{ file=..., line=..., snippet=... }
$UsedKeys = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::Ordinal)

function Add-KeyUse([string]$key, [string]$file, [int]$line, [string]$snippet){
  if([string]::IsNullOrWhiteSpace($key)){ return }
  [void]$UsedKeys.Add($key)
  if(-not $KeyFirstUse.ContainsKey($key)){
    $KeyFirstUse[$key] = @{ file=$file; line=$line; snippet=$snippet }
  }
}

# translation mixing inside scripts/multilang.js (values)
$zhBlock = Extract-LangBlock $MultiLangText 'zh'
if($zhBlock -ne $null){
  $lines = $zhBlock.text -split "`n", -1
  for($i=0; $i -lt $lines.Count; $i++){
    $lineNo = $zhBlock.startLine + $i
    $line = $lines[$i]
    if($line -notmatch '[:]\s*["\'']'){ continue }
    $bad = Get-DisallowedEnglishTokens $line
    if($bad.Count -gt 0){
      $Findings.Add((New-Finding 'P1' 'scripts/multilang.js' $lineNo 'zh_translation_contains_disallowed_en' (Get-OneLineSnippet $line) 'Replace English sentence in zh translation (keep allowed tokens only), or split into zh/en keys.'))
    }
  }
}
$enBlock = Extract-LangBlock $MultiLangText 'en'
if($enBlock -ne $null){
  $lines = $enBlock.text -split "`n", -1
  for($i=0; $i -lt $lines.Count; $i++){
    $lineNo = $enBlock.startLine + $i
    $line = $lines[$i]
    if(Test-HasHan $line){
      $Findings.Add((New-Finding 'P0' 'scripts/multilang.js' $lineNo 'en_translation_contains_han' (Get-OneLineSnippet $line) 'Replace with English-only translation; move Han text into zh translation.'))
    }
  }
}

# Files to scan
$files = Get-ChildItem -Path $Root -Recurse -File | Where-Object {
  $_.Extension -in @('.html','.js') -and
  $_.FullName -notmatch '\\node_modules\\' -and
  $_.FullName -notmatch '\\images\\' -and
  $_.FullName -notmatch '\\videos\\' -and
  $_.FullName -notmatch '\\data\\' -and
  $_.FullName -notmatch '\\.git\\'
}

foreach($f in $files){
  $rel = ($f.FullName.Substring($Root.Length)).TrimStart('\\') -replace '\\','/'

  $lines = Get-Content $f.FullName -Encoding UTF8 -ErrorAction SilentlyContinue
  if($null -eq $lines){ continue }

  $isHtml = $f.Extension -ieq '.html'
  $inScript = $false

  for($i=0; $i -lt $lines.Count; $i++){
    $lineNo = $i + 1
    $raw = $lines[$i]

    if($isHtml){
      if($raw -match '(?i)<script\b'){ $inScript = $true }
      $textOnly = if($inScript){ $raw } else { Remove-HtmlTags $raw }

      $hasEn = $ClassEnRegex.IsMatch($raw)
      $hasZh = $ClassZhRegex.IsMatch($raw)
      $hasI18n = $TranslateAttrRegex.IsMatch($raw)

      # record i18n keys on this line
      foreach($m in $TranslateAttrRegex.Matches($raw)){
        Add-KeyUse $m.Groups[1].Value $rel $lineNo (Get-OneLineSnippet $raw)
      }

      if($hasEn -and (Test-HasHan $textOnly)){
        $Findings.Add((New-Finding 'P0' $rel $lineNo 'en_block_contains_han' (Get-OneLineSnippet $raw) "Wrap Han into .zh and provide .en, or convert to data-i18n key."))
      }

      if($hasZh){
        $bad = Get-DisallowedEnglishTokens $textOnly
        if($bad.Count -gt 0){
          $Findings.Add((New-Finding 'P1' $rel $lineNo 'zh_block_contains_disallowed_en' (Get-OneLineSnippet $raw) "Replace English sentence in .zh (keep allowed tokens only), or split into .zh/.en spans or i18n key."))
        }
      }

      if((-not $inScript) -and (Test-HasHan $textOnly) -and (-not $hasZh) -and (-not $hasI18n)){
        $Findings.Add((New-Finding 'P3' $rel $lineNo 'hardcoded_han_outside_zh' (Get-OneLineSnippet $raw) "If user-facing, wrap in .zh/.en spans or convert to data-i18n."))
      }

      $bad = Get-DisallowedEnglishTokens $textOnly
      if((-not $inScript) -and ($bad.Count -gt 0) -and (-not $hasEn) -and (-not $hasI18n)){
        $Findings.Add((New-Finding 'P3' $rel $lineNo 'hardcoded_disallowed_en_outside_en' (Get-OneLineSnippet $raw) "If user-facing, wrap in .en/.zh spans or convert to data-i18n."))
      }

      if($raw -match '(?i)</script\b'){ $inScript = $false }
    }
    else {
      # JS scan
      foreach($m in $TranslateAttrRegex.Matches($raw)){
        Add-KeyUse $m.Groups[1].Value $rel $lineNo (Get-OneLineSnippet $raw)
      }
      foreach($rx in @(
        [regex]'wkI18n\.t\(\s*["\'']([^"\'']+)["\'']\s*\)',
        [regex]'setAttribute\(\s*["\'']data-(?:translate|i18n)["\'']\s*,\s*["\'']([^"\'']+)["\'']\s*\)',
        [regex]'dataset\.(?:translate|i18n)\s*=\s*["\'']([^"\'']+)["\'']'
      )){
        foreach($m in $rx.Matches($raw)){
          Add-KeyUse $m.Groups[1].Value $rel $lineNo (Get-OneLineSnippet $raw)
        }
      }

      $hasEn = $ClassEnRegex.IsMatch($raw)
      $hasZh = $ClassZhRegex.IsMatch($raw)

      if($hasEn -and (Test-HasHan $raw)){
        $Findings.Add((New-Finding 'P0' $rel $lineNo 'en_block_contains_han' (Get-OneLineSnippet $raw) "Ensure .en content has no Han; move Han into .zh or an i18n key."))
      }
      if($hasZh){
        $bad = Get-DisallowedEnglishTokens $raw
        if($bad.Count -gt 0){
          $Findings.Add((New-Finding 'P1' $rel $lineNo 'zh_block_contains_disallowed_en' (Get-OneLineSnippet $raw) "Keep only allowed tokens inside .zh, or split into .zh/.en spans or i18n key."))
        }
      }

      # heuristic: string literals only
      if($raw -match "['\"`].*['\"`]" ){
        if((Test-HasHan $raw) -and (-not $hasZh)){
          $Findings.Add((New-Finding 'P3' $rel $lineNo 'hardcoded_han_in_js' (Get-OneLineSnippet $raw) "If user-facing, replace with wkI18n.t('KEY') or data-i18n in generated HTML."))
        }
        $bad = Get-DisallowedEnglishTokens $raw
        if(($bad.Count -gt 0) -and (-not $hasEn)){
          $Findings.Add((New-Finding 'P3' $rel $lineNo 'hardcoded_disallowed_en_in_js' (Get-OneLineSnippet $raw) "If user-facing, replace with wkI18n.t('KEY') or split .zh/.en spans."))
        }
      }
    }
  }
}

# P2: key coverage
foreach($key in $UsedKeys){
  $hasZh = $ZhKeys.Contains($key)
  $hasEn = $EnKeys.Contains($key)
  if($hasZh -and $hasEn){ continue }

  $use = $KeyFirstUse[$key]
  $file = if($use){ $use.file } else { 'scripts/multilang.js' }
  $line = if($use){ [int]$use.line } else { 1 }
  $snippet = if($use){ $use.snippet } else { "i18n key '$key'" }

  if(-not $hasZh){
    $Findings.Add((New-Finding 'P2' $file $line 'missing_key_in_zh' "key='$key' | $snippet" "Add key '$key' to translations.zh in scripts/multilang.js."))
  }
  if(-not $hasEn){
    $Findings.Add((New-Finding 'P2' $file $line 'missing_key_in_en' "key='$key' | $snippet" "Add key '$key' to translations.en in scripts/multilang.js."))
  }
}

# Keys that exist only in one language (dictionary drift)
foreach($k in $ZhKeys){
  if(-not $EnKeys.Contains($k)){
    $Findings.Add((New-Finding 'P2' 'scripts/multilang.js' 1 'key_exists_only_in_zh' "key='$k'" "Add key '$k' to translations.en (or remove if unused)."))
  }
}
foreach($k in $EnKeys){
  if(-not $ZhKeys.Contains($k)){
    $Findings.Add((New-Finding 'P2' 'scripts/multilang.js' 1 'key_exists_only_in_en' "key='$k'" "Add key '$k' to translations.zh (or remove if unused)."))
  }
}

# --- Output files ---
$ReportPath = Join-Path $Root 'i18n_audit_report.md'
$JsonPath = Join-Path $Root 'i18n_audit_summary.json'

$Groups = @{
  P0 = @(); P1 = @(); P2 = @(); P3 = @()
}
foreach($f in $Findings){
  $Groups[$f.severity] += $f
}
foreach($k in @('P0','P1','P2','P3')){
  $Groups[$k] = $Groups[$k] | Sort-Object file,line,type
}

$Counts = @{
  P0 = $Groups.P0.Count
  P1 = $Groups.P1.Count
  P2 = $Groups.P2.Count
  P3 = $Groups.P3.Count
}

$md = New-Object System.Collections.Generic.List[string]
$md.Add('# i18n Language Separation Audit')
$md.Add('')
$md.Add("Workspace: `$Root`")
$md.Add('')
$md.Add('## Summary')
$md.Add('')
$md.Add("- P0: $($Counts.P0)")
$md.Add("- P1: $($Counts.P1)")
$md.Add("- P2: $($Counts.P2)")
$md.Add("- P3: $($Counts.P3)")
$md.Add('')
$md.Add('## Notes')
$md.Add('')
$md.Add('- Line-level audit; some multi-line HTML cases may need manual follow-up.')
$md.Add('- Allowed English tokens inside zh are treated as exceptions (brand/model/material list + conservative model/units patterns).')
$md.Add('- This audit does not modify any site copy or the existing scripts/multilang.js system.')
$md.Add('')

function Add-Section([string]$title, [string]$key, [string]$desc){
  $md.Add("## $title")
  $md.Add('')
  $md.Add($desc)
  $md.Add('')
  $items = $Groups[$key]
  if($items.Count -eq 0){
    $md.Add('- (none)')
    $md.Add('')
    return
  }
  foreach($it in $items){
    $md.Add("- $($it.file):$($it.line) | `$($it.type)` | $($it.snippet)")
    $md.Add("  - Suggestion: $($it.suggestion)")
  }
  $md.Add('')
}

Add-Section 'P0 — English blocks contain Chinese (must fix)' 'P0' 'These will surface Chinese characters under English mode.'
Add-Section 'P1 — Chinese blocks contain English sentences (likely fix)' 'P1' 'These will surface English text under Chinese mode (excluding allowed tokens).'
Add-Section 'P2 — Missing i18n keys / missing one language' 'P2' 'Keys referenced in HTML/JS but not present for both zh/en in scripts/multilang.js.'
Add-Section 'P3 — Other mixed-language occurrences (manual review)' 'P3' 'Hardcoded language outside .zh/.en blocks or i18n keys. Review to confirm user-facing impact.'

$md.Add('## TODO List (no auto-changes)')
$md.Add('')
$md.Add('1. Fix all P0 items by removing Han from `.en` content and `en` translation values.')
$md.Add('2. Fix P1 items by replacing English sentences in `.zh` / `zh` translation values (keep allowed tokens only).')
$md.Add('3. Fix P2 items by adding missing keys to both `translations.en` and `translations.zh` in scripts/multilang.js.')
$md.Add('4. Review P3 items and convert user-facing strings to i18n keys or `.zh/.en` paired spans.')
$md.Add('')

Set-Content -Path $ReportPath -Value ($md -join "`n") -NoNewline -Encoding UTF8

($Findings | ConvertTo-Json -Depth 6) | Set-Content -Path $JsonPath -NoNewline -Encoding UTF8

Write-Host "Wrote: $ReportPath"
Write-Host "Wrote: $JsonPath"
Write-Host ("Counts: P0={0} P1={1} P2={2} P3={3}" -f $Counts.P0,$Counts.P1,$Counts.P2,$Counts.P3)
