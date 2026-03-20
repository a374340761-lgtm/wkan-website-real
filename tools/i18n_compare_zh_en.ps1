# Compare top-level string keys in scripts/multilang.js zh vs en blocks (line ranges must match file edits).
# Run from repo root: powershell -File tools/i18n_compare_zh_en.ps1
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot\..
$pat = '^\s+([a-zA-Z_][a-zA-Z0-9_]*):\s*[''"]'
$lines = Get-Content "scripts\multilang.js" -Encoding UTF8
# zh: lines 43-719 (0-based 42-718), en: lines 723-1399 (0-based 722-1398) — adjust if structure changes
$zh = $lines[42..718] | ForEach-Object { if ($_ -match $pat) { $Matches[1] } }
$en = $lines[722..1398] | ForEach-Object { if ($_ -match $pat) { $Matches[1] } }
$zhs = $zh | Sort-Object -Unique
$ens = $en | Sort-Object -Unique
Write-Host "zh keys: $($zhs.Count)  en keys: $($ens.Count)"
$diff = Compare-Object $zhs $ens
if ($diff) {
    Write-Host "DIFF:"
    $diff | Format-Table -AutoSize
    exit 1
}
Write-Host "OK: zh and en have the same keys."
exit 0
