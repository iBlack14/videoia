import asyncio, json, subprocess
from pathlib import Path
import edge_tts, imageio_ffmpeg
root=Path.cwd(); out=root/'projects/lms/assets'; voice='es-PE-AlexNeural'
lines=[
"¿Tus cursos siguen repartidos entre chats, archivos y enlaces? Reúne tu formación en un campus virtual propio.",
"Organiza cursos, lecciones, materiales y tareas en una experiencia clara, desde computadora o celular.",
"Conecta clases en vivo por Google Meet o Zoom, aplica evaluaciones y sigue el avance de tus estudiantes.",
"Al completar los requisitos, tus alumnos pueden obtener certificados digitales verificables con código QR.",
"OdiseaCloud implementa tu aula virtual desde mil ochocientos cincuenta soles el primer año. El alcance se cotiza contigo. Escríbenos y lleva tus cursos a un nuevo nivel."
]
async def main():
 voices=await edge_tts.list_voices(); v=next(x for x in voices if x['ShortName']==voice and x['Gender']=='Male')
 for i,line in enumerate(lines,1):
  mp3=out/f'voice{i}-alex.mp3'; await edge_tts.Communicate(line,voice,rate='-3%').save(str(mp3))
  subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-v','error','-y','-i',str(mp3),'-ar','24000','-ac','1','-c:a','pcm_s16le',str(out/f'voice{i}.wav')],check=True)
  print(f'voz {i}: {voice}',flush=True)
 (out/'voice-provider.json').write_text(json.dumps({'provider':'edge-tts','voice':voice,'gender':'male','locale':'es-PE'},indent=2))
asyncio.run(main())
