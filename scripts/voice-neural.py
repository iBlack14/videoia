"""Voz masculina neural gratuita mediante Edge TTS (requiere internet)."""
import asyncio
import json
import subprocess
from pathlib import Path
import edge_tts
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parent.parent
VOICE = 'es-PE-AlexNeural'

async def main():
    idea = json.loads((ROOT/'ideas/demo.json').read_text(encoding='utf-8'))
    out = ROOT/'projects/demo/assets'
    out.mkdir(parents=True, exist_ok=True)
    voices = await edge_tts.list_voices()
    selected = next((v for v in voices if v['ShortName'] == VOICE), None)
    if not selected or selected['Gender'] != 'Male':
        raise RuntimeError('La voz masculina seleccionada no está disponible.')
    for i, scene in enumerate(idea['scenes'], 1):
        mp3 = out/f'voice{i}-alex.mp3'
        text = f"{scene['title']} {scene.get('subtitle', '')}".replace('HTTPS', 'hache te te pe ese')
        await edge_tts.Communicate(text, VOICE, rate='-3%').save(str(mp3))
        wav = out/f'voice{i}.wav'
        subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), '-v', 'error', '-y', '-i', str(mp3), '-ar', '24000', '-ac', '1', '-c:a', 'pcm_s16le', str(wav)], check=True)
        print(f'Escena {i}: {VOICE}', flush=True)
    (out/'voice-provider.json').write_text(json.dumps({'provider':'Microsoft Edge online TTS via edge-tts','voice':VOICE,'gender':'Male','locale':'es-PE','rate':'-3%','requires_internet':True},indent=2),encoding='utf-8')

if __name__ == '__main__':
    asyncio.run(main())
