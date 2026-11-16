param([switch]$Offline)
$ErrorActionPreference = 'Stop'
if (-not $Offline) {
  & python (Join-Path $PSScriptRoot 'voice-neural.py')
  if ($LASTEXITCODE -ne 0) { throw 'Falló la voz neural masculina; no se sustituyó por una voz distinta.' }
  return
}
$videoRoot = Split-Path -Parent $PSScriptRoot
$idea = Get-Content -LiteralPath (Join-Path $videoRoot 'ideas/demo.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$audioDirectory = Join-Path $videoRoot 'projects/demo/assets'
New-Item -ItemType Directory -Path $audioDirectory -Force | Out-Null
$speaker = New-Object -ComObject SAPI.SpVoice
$spanishVoice = @($speaker.GetVoices() | Where-Object { $_.GetDescription() -match 'Sabina' })[0]
if (-not $spanishVoice) { throw 'No se encontró la voz española Microsoft Sabina.' }
$speaker.Voice = $spanishVoice
$speaker.Rate = 1
for ($i = 0; $i -lt $idea.scenes.Count; $i++) {
  $stream = New-Object -ComObject SAPI.SpFileStream
  $stream.Open((Join-Path $audioDirectory "voice$($i+1).wav"), 3, $false)
  $speaker.AudioOutputStream = $stream
  $speaker.Speak("$($idea.scenes[$i].title) $($idea.scenes[$i].subtitle)") | Out-Null
  $stream.Close()
}
Write-Output 'Voz generada con SAPI local, sin conexión ni API de pago.'
