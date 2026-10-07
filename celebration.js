'use strict';
// Serpentinas y dos intentos de quemar la carta. El tercer desenlace es abrirla.
if (document.body.dataset.page === 'birthday') {
  (() => {
    const get = id => document.getElementById(id);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const palette = ['#ed9fbe', '#f2cb87', '#a18adc', '#8dbdb4'];
    const ns = 'http://www.w3.org/2000/svg';
    for (let i = 0; i < 10; i++) {
      const ribbon = document.createElement('span');
      ribbon.className = 'streamer';
      ribbon.style[i < 5 ? 'left' : 'right'] = `${1 + (i % 5) * 3.3}%`;
      ribbon.style.top = `${-20 - (i % 3) * 28}px`;
      ribbon.style.animationDelay = `${(i % 5) * .09}s, ${1.8 + i * .1}s`;
      const svg = document.createElementNS(ns, 'svg');svg.setAttribute('viewBox', '0 0 28 240');
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', 'M14 -20 C-7 0 36 15 14 35 S-7 69 14 89 S36 123 14 143 S-7 177 14 197 S36 225 14 244');
      path.setAttribute('fill', 'none');path.setAttribute('stroke', palette[i % 4]);path.setAttribute('stroke-width', '5');
      svg.append(path);ribbon.append(svg);get('streamers').append(ribbon);
    }
    const modal = get('burnDialog'), canvas = get('burnCanvas'), c = canvas.getContext('2d');
    let attempts = 0, active = false, start = null, raf = null, intensity = 0;
    let W = 400, H = 300;
    function resize() {
      W = Math.min(640, Math.max(240, Math.round(innerWidth / 3)));
      H = Math.round(W * innerHeight / innerWidth);
      canvas.width = W; canvas.height = H; c.imageSmoothingEnabled = false;
    }
    window.addEventListener('resize', resize);
    const eyes = Array.from({length:28}, (_,i) => ({
      x: .06 + ((i * .381966) % .88), y: .05 + ((i * .23713) % .72),
      size: 7 + (i % 4) * 3, phase: i * 1.7
    }));
    function box(x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));}
    function eye(x,y,r,t,i){
      const blink = reduced ? 1 : .7 + .3*Math.sin(t*1.8+i);
      c.save();c.translate(x,y);c.rotate(Math.sin(i)*.28);
      // Ojos escalonados, pupilas de colores y sombras desplazadas.
      box(-r-2,-r*.4*blink,r*2+4,r*.8*blink,'#5b245f');
      box(-r,-r*.5*blink,r*2,r*blink,'#ece0e4');box(-r*.6,-r*.7*blink,r*1.2,r*1.4*blink,'#ece0e4');
      const dx = reduced ? 0 : Math.sin(t*.9+i)*r*.27;
      box(dx-r*.36,-r*.6*blink,r*.72,r*1.2*blink,palette[i%4]);
      box(dx-r*.16,-r*.6*blink,r*.32,r*1.2*blink,'#110915');box(dx+1,-r*.3,2,2,'#fff4ee');c.restore();
    }
    function fire(t){
      const floor = H*.77;
      for(let i=0;i<11;i++){
        const x=W/2+(i-5)*4;
        const height=18+Math.sin(i*1.8+t*(reduced?0:3))*8+(5-Math.abs(i-5))*3;
        box(x,floor-height,5,height,'#a63934');box(x+1,floor-height*.78,3,height*.78,'#ef8044');box(x+1,floor-height*.5,3,height*.5,'#ffd68b');
      }
      for(let i=0;i<18&&!reduced;i++){
        const a=(t*.3+i/18)%1;c.globalAlpha=1-a;box(W/2+Math.sin(i*2+t)*26,floor-15-a*65,1,2,'#ffad60');
      }
      c.globalAlpha=1;box(W/2-27,floor+1,54,3,'#7d3438');
    }
    function draw(ms){
      if(!active)return;
      if(start===null) start=ms;
      const t=(ms-start)/1000, duration=reduced?3.5:7.8;
      const contact=reduced?.6:1.7;
      const consumed=Math.max(0,Math.min(1,(t-contact)/(reduced?1:2.6)));
      intensity=Math.max(0,Math.min(1,(t-contact)/(reduced?1.4:3.2)));
      c.globalAlpha=1;box(0,0,W,H,'#050309');
      // El mundo se abstrae gradualmente, sin destellos de pantalla completa.
      c.globalAlpha=intensity*.2;
      for(let i=0;i<10;i++){
        const phase=reduced?0:Math.floor(t*2);
        box(((i*61+phase*13)%W), (i*41+phase*7)%H, W*.3, 3+i%5, palette[i%4]);
      }
      c.globalAlpha=1;
      eyes.forEach((e,i)=>{
        const a=Math.max(0,Math.min(1,(intensity-i/38)*2.3));
        c.globalAlpha=a*.9;if(a>0)eye(e.x*W,e.y*H,e.size,t,i);
      });c.globalAlpha=1;
      const descent=Math.min(1,t/contact);
      const y=H*.24+(H*.77-16-H*.24)*(1-Math.pow(1-descent,2));
      const sway=reduced?0:Math.sin(t*2)*12*(1-descent);
      if(consumed<1){
        c.save();c.translate(W/2+sway,y);c.rotate(reduced?0:Math.sin(t*1.6)*.16);
        const w=Math.min(74,W*.24), h=45;
        // Se consume por filas de píxeles, de abajo hacia arriba.
        for(let row=0;row<h;row+=3){for(let col=0;col<w;col+=3){
          const jag=Math.sin(col*.7)*3;
          if(row>h*(1-consumed)+jag)continue;
          const edge=consumed>0&&row>h*(1-consumed)-6+jag;
          box(col-w/2,row-h,3,3,edge?'#e8954b':(row>h*.7?'#dba4b1':'#f7d7cb'));
        }}
        if(consumed<.45){box(-14,-31,28,1,'#b77d88');box(-8,-24,16,1,'#b77d88');box(-3,-17,6,5,'#ac5875');}
        c.restore();
      }
      fire(t);
      if(!reduced&&intensity>.1){
        // Desplazamiento de franjas de la imagen, creciendo con el fuego.
        const phase=Math.floor(t*2);
        for(let i=0;i<4;i++){
          const sy=(phase*17+i*67)%Math.max(1,H-10),offset=Math.round(Math.sin(phase+i)*intensity*17);
          c.drawImage(canvas,0,sy,W,4,offset,sy,W,4);
        }
        c.globalAlpha=intensity*.16;for(let yy=0;yy<H;yy+=5)box(0,yy,W,1,'#8e5c9a');c.globalAlpha=1;
      }
      get('burnCaption').textContent = t<contact ? '¿De verdad la vas a quemar…?' : consumed<1 ? 'Hay cosas que el fuego no puede borrar.' : attempts===1 ? 'Parece que esta carta quiere volver a ti.' : 'Esta vez… mejor ábrela. ♡';
      get('burnCaption').classList.toggle('abstracted',intensity>.5);
      if(t>=duration){finish();return;}
      raf=requestAnimationFrame(draw);
    }
    function finish(){
      if(!active)return;active=false;cancelAnimationFrame(raf);start=null;
      document.body.classList.remove('abstraction','burning-letter');
      if(modal.open)modal.close();
      get('openLetter').disabled=false;get('readLetter').disabled=false;
      const invitation=document.querySelector('.letter-invitation');invitation.classList.remove('returned');void invitation.offsetWidth;invitation.classList.add('returned');
      if(attempts>=2){get('burnLetter').hidden=true;get('letterChoices').classList.add('only-open');get('choicePrompt').textContent='Algunas cartas están destinadas a ser leídas. ♡';}
      else{get('burnLetter').disabled=false;get('choicePrompt').textContent='La carta volvió… ¿quemarla o abrirla?';}
      get('readLetter').focus({preventScroll:true});
    }
    get('burnLetter').addEventListener('click',()=>{
      if(active||attempts>=2)return;
      attempts++;active=true;start=null;resize();
      get('openLetter').disabled=true;get('readLetter').disabled=true;get('burnLetter').disabled=true;
      document.body.classList.add('abstraction','burning-letter');
      modal.showModal();get('skipBurn').focus({preventScroll:true});raf=requestAnimationFrame(draw);
    });
    get('skipBurn').addEventListener('click',finish);
    modal.addEventListener('cancel',event=>{event.preventDefault();finish();});
    modal.addEventListener('close',finish);
  })();
}
