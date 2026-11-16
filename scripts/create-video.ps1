param([switch]$PreviewOnly)
$ErrorActionPreference = 'Stop'
$videoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $videoRoot
try {
  & (Join-Path $PSScriptRoot 'voice.ps1')
  & npm.cmd run demo
  if ($LASTEXITCODE -ne 0) { throw 'Falló la generación del proyecto.' }
  Copy-Item -Path projects/demo/assets/voice*.wav -Destination projects/realista/assets -Force
  Copy-Item -LiteralPath projects/demo/assets/voice-provider.json -Destination projects/realista/assets/voice-provider.json -Force
  & node scripts/build-realistic.mjs
  if ($LASTEXITCODE -ne 0) { throw 'Falló la generación del proyecto con mascota.' }
  & npm.cmd run hf -- check projects/realista --json
  if ($LASTEXITCODE -ne 0) { throw 'La revisión detectó problemas. Corregir antes de renderizar.' }
  if ($PreviewOnly) {
    & npm.cmd run hf -- preview projects/realista --background
  } else {
    & npm.cmd run hf -- render projects/realista --output output/odiseacloud-realista.mp4 --quality draft --workers 2
  }
  if ($LASTEXITCODE -ne 0) { throw 'HyperFrames no pudo completar la operación.' }
} finally {
  Pop-Location
}
