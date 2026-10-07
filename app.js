'use strict';
// Cambia aquí el nombre y los mensajes de cumpleaños.
const GREETING = { name: 'Akemi', subtitle: 'Un nuevo año de aventuras, risas y cosas bonitas.' };
const $ = (id) => document.getElementById(id);
const canvas = $('world');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const colors = ['#eaa3b9','#f6d598','#a89aca','#a8c7b5','#fff0d8'];
let state = 'intro', started = 0, lastTime = 0, elapsed = 0, particles = [], audio = null, musicTimer = null, musicOn = false;
let seed = 26;
function random(){ seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
const stars = Array.from({length:68},()=>({x:12+random()*376,y:8+random()*196,size:random()>.83?2:1,phase:random()*6.28}));
const sparkles = Array.from({length:16},()=>({x:45+random()*310,y:40+random()*145,phase:random()*6.28}));
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
function cross(x,y,size,c){rect(x-size,y,size*2+1,1,c);rect(x,y-size,1,size*2+1,c);}
function ellipse(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function glow(x,y,r,a){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(255,186,112,${a})`);g.addColorStop(1,'rgba(255,150,90,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}
function flame(x,y,time,scale=1){
  const f=reduceMotion?0:Math.floor(Math.sin(time*11)*1.7);ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  rect(-2+f,-16,3,4,'#dc754a');rect(-4+f,-12,6,5,'#ed9859');rect(-5,-7,10,9,'#ffc977');rect(-3,2,6,3,'#ed9859');rect(-2,-8,4,10,'#ffe9a6');rect(-1,-3,2,5,'#fff7dd');ctx.restore();
}
function candle(x,y,h,time,lit=true){
  rect(x-6,y,12,h,'#694451');rect(x-5,y,10,h-2,'#d88b9d');rect(x-4,y+1,3,h-3,'#f5c6c2');rect(x+3,y+1,2,h-3,'#aa5d79');
  for(let k=4;k<h-3;k+=10){rect(x-1,y+k,5,3,'#efb8b7');rect(x-4,y+k+3,3,2,'#efb8b7');}
  rect(x-5,y,10,3,'#ffdfc7');rect(x-2,y-5,2,6,'#554044');if(lit)flame(x,y-7,time);
}
function pedestal(time,light){
  glow(200,155,87,.06+light*.1);ellipse(200,220,79,10,'#090812');
  // Candelabro de latón con reflejos y escalones.
  rect(161,207,78,7,'#3a2733');rect(165,203,70,6,'#866044');rect(170,200,60,4,'#cb9560');rect(178,196,44,5,'#77503f');rect(185,192,30,5,'#b48351');
  rect(195,175,10,19,'#815640');rect(196,176,3,16,'#dab279');rect(192,171,16,7,'#bc8b5b');rect(182,165,36,6,'#614235');rect(178,158,44,7,'#b38153');rect(181,157,38,3,'#e7bd81');
  candle(200,99,59,time,light>0);rect(190,150,20,7,'#f2c8b1');rect(187,154,26,3,'#ab7379');rect(202,105,3,16,'#ffe1c6');rect(205,109,2,7,'#f6c1b2');
  if(light>0)glow(200,87,68,.21*light);
  rect(155,218,90,1,'#624758');rect(172,226,57,1,'#392a40');
}
function strawberry(x,y){rect(x-4,y-3,8,7,'#713247');rect(x-3,y-4,6,9,'#c35470');rect(x-2,y+5,4,2,'#a64160');rect(x-2,y-3,2,5,'#ee8f99');rect(x+1,y,1,1,'#ffd3a8');rect(x-1,y+3,1,1,'#ffd3a8');rect(x-1,y-7,2,4,'#9cae85');rect(x-4,y-5,8,2,'#779578');}
function cake(time,reveal){
  ctx.save();ctx.translate(0,reduceMotion?0:Math.round((1-reveal)*32));ctx.globalAlpha=reveal;
  glow(200,139,120,.13);ellipse(200,225,100,11,'#0a0815');
  // Bandeja con pie y borde biselado.
  rect(179,220,42,7,'#685b87');rect(163,226,74,3,'#aca3bb');rect(148,214,104,6,'#5e5577');rect(116,206,168,8,'#9a94ad');rect(109,204,182,4,'#cebdc5');rect(117,201,166,4,'#f5d9cb');
  // Bizcocho, relleno, sombras y pequeñas decoraciones.
  rect(132,143,136,60,'#713c52');rect(129,145,142,50,'#bd718a');rect(132,146,136,47,'#e5a5ad');rect(135,161,130,10,'#ba6d86');rect(135,165,130,3,'#efb3af');rect(135,184,130,8,'#b2637c');rect(136,184,128,4,'#f0bdba');rect(136,146,7,48,'#f2c1ba');rect(257,150,9,44,'#c57b92');
  rect(128,139,144,13,'#95526a');rect(130,136,140,13,'#f9ddcb');rect(136,133,128,6,'#fff0d5');
  for(let i=0;i<11;i++){let x=133+i*12;rect(x,148,9,5+(i%3)*3,'#f9ddcb');rect(x+2,152,5,3+(i%3)*3,'#f9ddcb');rect(x,197,9,4,'#fff0d5');}
  for(let i=0;i<14;i++){let x=139+i*9;rect(x,174+(i%2)*4,2,2,i%2?'#ad5979':'#fff1d1');}
  // Segundo piso.
  rect(154,114,92,24,'#b56b82');rect(156,113,88,21,'#e8a7b1');rect(159,121,82,4,'#c07c93');rect(160,116,4,15,'#f8c9c3');rect(235,115,7,17,'#c78095');rect(153,108,94,9,'#fbe4d1');rect(158,105,84,5,'#fff0d8');
  for(let i=0;i<7;i++){rect(157+i*13,115,7,5+i%2*4,'#fbe4d1');}
  [143,169,231,257].forEach(x=>strawberry(x,134));[165,234].forEach(x=>strawberry(x,103));
  [183,201,219].forEach((x,i)=>{candle(x,88-i%2*7,18+i%2*7,time+i,state!=='wish');if(state!=='wish')glow(x,75-i%2*7,27,.1);});
  // Guirlande de losetas debajo del pastel.
  for(let i=0;i<5;i++){rect(168+i*15,208,8,2,'#eee0dc');}
  ctx.restore();
}
function burst(n=75){if(reduceMotion)return;for(let i=0;i<n;i++)particles.push({x:200,y:119,vx:(Math.random()-.5)*190,vy:-50-Math.random()*160,life:3+Math.random()*2,size:2+Math.floor(Math.random()*3),color:colors[i%colors.length],spin:Math.random()*6});}
function drawParticles(dt,time){particles=particles.filter(p=>p.life>0);for(const p of particles){p.life-=dt;p.vy+=50*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;ctx.globalAlpha=Math.min(1,p.life);rect(p.x,p.y,p.size,Math.sin(time*5+p.spin)>0?p.size:1,p.color);}ctx.globalAlpha=1;}
function background(time,celebrate){
  for(const star of stars){ctx.globalAlpha=.2+(Math.sin(time*(reduceMotion?0:1.1)+star.phase)+1)*.22;rect(star.x,star.y,star.size,star.size,'#e5c7ce');}ctx.globalAlpha=1;
  // Lune en escalier et petites constellations.
  rect(323,28,13,3,'#b9a3bb');rect(320,31,19,13,'#b9a3bb');rect(323,44,13,3,'#b9a3bb');rect(327,27,13,13,'#15121f');
  for(const s of sparkles){const alpha=celebrate?.3+(Math.sin(time*2+s.phase)+1)*.25:.15;ctx.globalAlpha=alpha;cross(s.x,s.y,Math.sin(time+s.phase)>0?2:1,celebrate?'#f5d19b':'#9d7c9c');}ctx.globalAlpha=1;
  rect(58,239,284,1,'#302336');rect(92,243,216,1,'#211b2d');
  if(celebrate){
    // Guirnalda festiva, dibujada sobre la cuadrícula de píxeles.
    for(let i=0;i<16;i++){const x=28+i*23,y=16+Math.sin(i/15*Math.PI)*17;rect(x,y,23,1,'#71506a');if(i%2===0){for(let r=0;r<9;r++)rect(x+5+r/2,y+2+r,10-r,1,colors[(i/2)%colors.length]);}}
  }
}
function frame(ms){const time=ms/1000;const dt=Math.min((ms-lastTime)/1000,.04);lastTime=ms;elapsed=time;ctx.clearRect(0,0,400,270);background(time,state==='birthday'||state==='wish');
  if(state==='intro'||state==='lighting'){const progress=state==='lighting'?Math.min(1,(time-started)/1.1):0;pedestal(time,progress);if(progress>0&&!reduceMotion){for(let i=0;i<7;i++){const a=time*1.8+i*.9;cross(200+Math.cos(a)*(25+progress*30),102+Math.sin(a)*34-progress*15,1,'#f4cf99');}}}
  else{cake(time,Math.min(1,(time-started)/.85));if(state==='wish'&&time-started<2){ctx.globalAlpha=Math.max(0,1-(time-started)/2);for(let i=0;i<3;i++)rect(183+i*18+Math.sin(time*3+i)*2,64-(time-started)*16,2,7,'#ad9db1');ctx.globalAlpha=1;}}
  drawParticles(dt,time);requestAnimationFrame(frame);
}
let transitionTimer;
function setStage(next){state=next;$('game').dataset.stage=next;}
function reveal(){setStage('birthday');started=elapsed;$('chapter').textContent='CAPÍTULO 02 · HOY EL MUNDO CELEBRA';$('kicker').textContent='Esta pequeña sorpresa es para ti';$('title').replaceChildren(document.createTextNode('¡Felicidades,'),document.createElement('br'));const name=document.createElement('em');name.textContent=GREETING.name+'!';$('title').append(name);$('subtitle').textContent=GREETING.subtitle;$('actionText').textContent='PEDIR UN DESEO';$('hint').textContent='Piensa en algo bonito y apaga las velitas';$('action').disabled=false;$('candle').disabled=false;$('candle').setAttribute('aria-label','Apagar las velitas y pedir un deseo');canvas.setAttribute('aria-label','Pastel de cumpleaños de dos pisos con fresas, tres velitas y confeti');document.querySelector('.heading').classList.add('change');burst();if(musicOn)playNotes([72,76,79,84],.14);}
function activate(){
  if(state==='intro'){setStage('lighting');started=elapsed;$('action').disabled=true;$('candle').disabled=true;$('actionText').textContent='UN POQUITO DE MAGIA…';$('hint').textContent='Tu sorpresa está a punto de aparecer';if(musicOn)playNotes([72,79,84],.12);transitionTimer=setTimeout(reveal,reduceMotion?350:1800);}
  else if(state==='birthday'){setStage('wish');started=elapsed;$('wish').hidden=false;$('replay').hidden=false;$('candle').disabled=true;$('replay').focus({preventScroll:true});$('subtitle').textContent='Deseo enviado a las estrellas. ✦';canvas.setAttribute('aria-label','Pastel de cumpleaños con las velitas apagadas');burst(100);if(musicOn)playNotes([76,79,84,88],.16);}
}
$('action').addEventListener('click',activate);$('candle').addEventListener('click',activate);
$('replay').addEventListener('click',()=>{clearTimeout(transitionTimer);setStage('intro');particles=[];$('chapter').textContent='CAPÍTULO 01 · UNA PEQUEÑA MAGIA';$('kicker').textContent='Hay una sorpresa esperándote';$('title').innerHTML='Todo empieza<br>con una <em>chispa.</em>';$('subtitle').textContent='A veces, una pequeña luz lo cambia todo.';$('actionText').textContent='ENCENDER LA VELITA';$('hint').textContent='Toca la vela · guarda un deseo';$('wish').hidden=true;$('replay').hidden=true;$('action').disabled=false;$('candle').disabled=false;$('candle').setAttribute('aria-label','Toca la vela para descubrir tu sorpresa');canvas.setAttribute('aria-label','Una vela de píxeles sobre un candelabro, bajo un cielo nocturno');document.querySelector('.heading').classList.remove('change');$('action').focus({preventScroll:true});});
// Música original de ocho bits, generada con Web Audio. Solo suena al activarla.
function tone(note,when,duration=.23){const oscillator=audio.createOscillator(),gain=audio.createGain();oscillator.type='triangle';oscillator.frequency.value=440*Math.pow(2,(note-69)/12);gain.gain.setValueAtTime(0,when);gain.gain.linearRampToValueAtTime(.045,when+.015);gain.gain.exponentialRampToValueAtTime(.001,when+duration);oscillator.connect(gain);gain.connect(audio.destination);oscillator.start(when);oscillator.stop(when+duration+.02);}
function playNotes(notes,spacing){notes.forEach((n,i)=>tone(n,audio.currentTime+i*spacing));}
$('sound').addEventListener('click',async()=>{try{if(!audio)audio=new(window.AudioContext||window.webkitAudioContext)();if(musicOn){musicOn=false;clearInterval(musicTimer);await audio.suspend();}else{await audio.resume();musicOn=true;let step=0;const melody=[72,76,79,76,74,77,81,77,76,79,84,79,74,77,79,71];tone(melody[step++],audio.currentTime);musicTimer=setInterval(()=>{tone(melody[step%melody.length],audio.currentTime,.4);if(step%4===0)tone(melody[step%melody.length]-24,audio.currentTime,.8);step++;},360);} $('sound').setAttribute('aria-pressed',String(musicOn));$('sound').setAttribute('aria-label',musicOn?'Desactivar música':'Activar música');$('sound').querySelector('span').textContent=musicOn?'SONIDO ON':'SONIDO OFF';}catch{$('sound').querySelector('span').textContent='NO DISPONIBLE';}});
document.addEventListener('visibilitychange',()=>{if(audio&&musicOn){if(document.hidden){audio.suspend();}else{audio.resume();}}});
requestAnimationFrame(frame);
