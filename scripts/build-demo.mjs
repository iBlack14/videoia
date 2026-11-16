import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {visualScene} from './visuals.mjs';
const project=JSON.parse(await readFile(process.argv[2] || 'ideas/demo.json','utf8'));
if(!Array.isArray(project.scenes)||!project.scenes.length) throw Error('Se requieren escenas');
for(const s of project.scenes) if(!s.title||!Number.isFinite(s.duration)||s.duration<=0) throw Error('Escena inválida');
const dir='projects/demo';
const withVoice=project.scenes.every((_,i)=>existsSync(`${dir}/assets/voice${i+1}.wav`));
if(withVoice) for(const [i,s] of project.scenes.entries()) {
 const wav=await readFile(`${dir}/assets/voice${i+1}.wav`);let rate=0,bytes=0;
 for(let p=12;p+8<=wav.length;) {const len=wav.readUInt32LE(p+4),kind=wav.toString('ascii',p,p+4);if(kind==='fmt ')rate=wav.readUInt32LE(p+16);if(kind==='data')bytes=len;p+=8+len+(len%2);}
 if(!rate||!bytes)throw Error('WAV inválido');s.audioDuration=bytes/rate;s.duration=Math.ceil((s.audioDuration+.7)*10)/10;
}
await mkdir(`${dir}/assets`,{recursive:true});
await mkdir(`${dir}/compositions`,{recursive:true});
await mkdir('output',{recursive:true});
await copyFile('templates/interactivo.html','output/interactivo.html');
await copyFile('node_modules/hyperframes/dist/vendor/npm/gsap@3.15.0/dist/gsap.min.js',`${dir}/assets/gsap.min.js`);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let start=0; const hosts=[];const subtitles=[];
const timestamp=t=>new Date(t*1000).toISOString().slice(11,23).replace('.',',');
for(const [i,s] of project.scenes.entries()){
 const id=`scene${i+1}`;
 const visual=visualScene(i,s.duration);
 hosts.push(`<div id="${id}" class="clip" data-composition-id="${id}" data-composition-src="compositions/${id}.html" data-start="${start}" data-duration="${s.duration}" data-track-index="0" data-track-kind="graphics" data-width="1080" data-height="1920"></div>`);
 if(withVoice)hosts.push(`<audio id="voice${i+1}" class="clip" data-start="${start}" data-duration="${s.audioDuration}" data-track-index="1" data-volume="1" src="assets/voice${i+1}.wav"></audio>`);
 subtitles.push(`${i+1}\n${timestamp(start)} --> ${timestamp(start+s.duration)}\n${s.title}\n${s.subtitle||''}\n`);
 await writeFile(`${dir}/compositions/${id}.html`,`<template>
<style>
#root {position:absolute;inset:0;color:#f5f3eb;font-family:Inter,sans-serif;background:#101921;overflow:hidden}
.accent{position:absolute;width:600px;height:600px;border:2px solid #b9f96b;border-radius:50%;right:-230px;top:80px;opacity:.25}
.content{position:absolute;left:132px;width:620px;top:320px}
.eyebrow{font-size:28px;letter-spacing:7px;color:#b9f96b;margin-bottom:34px}
h1{font-size:76px;line-height:1.08;letter-spacing:-3px;margin:0;font-weight:900}
.line{height:7px;width:110px;background:#b9f96b;margin:30px 0}
p{font-size:34px;line-height:1.35;color:#c0cad0;margin:0}
.footer{position:absolute;top:1180px;left:132px;font-size:28px;letter-spacing:2px;color:#b9f96b}
${visual.style}
</style>
<div id="root" data-composition-id="${id}" data-width="1080" data-height="1920">
 <div class="accent" data-layout-ignore></div>
 <div class="content"><div class="eyebrow">VIDEOIA / 0${i+1}</div><h1>${esc(s.title)}</h1><div class="line"></div><p>${esc(s.subtitle||'')}</p></div>
 <div class="footer">WEB / SEGURIDAD DIGITAL</div>
 ${visual.markup}
</div>
<script>
const tl=gsap.timeline({paused:true});
${visual.script}
tl.fromTo('.content',{opacity:.8,y:35},{opacity:1,y:0,duration:.65,ease:'power3.out'},0);
tl.fromTo('.line',{scaleX:0},{scaleX:1,duration:.6,transformOrigin:'left'},.3);
tl.fromTo('.accent',{rotation:0,scale:.9},{rotation:35,scale:1.2,duration:${s.duration},ease:'none'},0);
tl.to('.content',{y:-15,duration:${Math.max(1,s.duration-1)},ease:'none'},.7);
tl.to('.content',{opacity:0,y:-25,duration:.25},${Math.max(.8,s.duration-.3)});
window.__timelines=window.__timelines||{};window.__timelines['${id}']=tl;
</script></template>`);
 start+=s.duration;
}
await writeFile(`${dir}/index.html`,`<!doctype html><html lang="es"><head><meta charset="UTF-8"><title>${esc(project.title)}</title><script src="assets/gsap.min.js"></script><style>html,body{margin:0;background:#101921}#root{width:1080px;height:1920px;position:relative;overflow:hidden}</style></head><body><div id="root" data-composition-id="main" data-start="0" data-duration="${start}" data-width="1080" data-height="1920" data-fps="30">${hosts.join('\n')}</div><script>window.__timelines=window.__timelines||{};window.__timelines.main=gsap.timeline({paused:true});</script></body></html>`);
await writeFile(`${dir}/subtitles.srt`,subtitles.join('\n'));
await writeFile(`${dir}/metadata.json`,JSON.stringify({title:project.title,description:project.description,duration:start,width:1080,height:1920,voice:withVoice,status:'borrador-sin-publicar'},null,2));
console.log(`Proyecto generado: ${path.resolve(dir)} (${start}s). Voz: ${withVoice}. Subtítulos temporizados por escena.`);
