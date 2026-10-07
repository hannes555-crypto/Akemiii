'use strict';
// Serpentinas y dos intentos de quemar la carta. El tercer desenlace es abrirla.
if (document.body.dataset.page === 'birthday') {
  (() => {
    const get = id => document.getElementById(id);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const palette = ['#ed9fbe', '#f2cb87', '#a18adc', '#8dbdb4'];
    for(let i=0;i<38;i++){
      const piece=document.createElement('span');piece.className='party-spark';
      piece.style.left=`${i%2===0?3+(i%7)*2.8:81+(i%7)*2.4}%`;
      piece.style.top=`${8+(i*13)%72}%`;
      piece.style.background=palette[i%4];piece.style.animationDelay=`${(i%9)*.37}s`;
      piece.style.rotate=`${i*37}deg`;get('streamers').append(piece);
    }
    const modal = get('burnDialog'), canvas = get('burnCanvas'), c = canvas.getContext('2d');
    let attempts = 0, active = false, start = null, raf = null, intensity = 0;
    let W = 400, H = 300;
    function resize() {
      W = Math.min(960, Math.max(390, Math.round(innerWidth)));
      H = Math.round(W * innerHeight / innerWidth);
      canvas.width = W; canvas.height = H; c.imageSmoothingEnabled = true;
    }
    window.addEventListener('resize', resize);
    const eyes = Array.from({length:28}, (_,i) => ({
      x: .06 + ((i * .381966) % .88), y: .05 + ((i * .23713) % .72),
      size: 7 + (i % 4) * 3, phase: i * 1.7
    }));
    function box(x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));}
    function eye(x,y,r,t,i){
      r*=Math.max(1,W/440);
      const blink=reduced?1:.72+.28*Math.sin(t*.8+i);
      c.save();c.translate(x,y);c.rotate(Math.sin(i)*.4);c.scale(1,blink);
      c.shadowColor=palette[i%4];c.shadowBlur=r*.7;
      c.beginPath();c.moveTo(-r,0);c.bezierCurveTo(-r*.35,-r*.85,r*.5,-r*.85,r,0);c.bezierCurveTo(r*.4,r*.8,-r*.5,r*.8,-r,0);c.fillStyle='#d6cbd9';c.fill();c.shadowBlur=0;
      const dx=reduced?0:Math.sin(t*.5+i)*r*.3;
      c.beginPath();c.ellipse(dx,0,r*.34,r*.5,0,0,Math.PI*2);c.fillStyle=palette[i%4];c.fill();
      c.beginPath();c.ellipse(dx,0,r*.14,r*.4,0,0,Math.PI*2);c.fillStyle='#09030e';c.fill();
      c.beginPath();c.arc(dx+r*.1,-r*.19,r*.08,0,Math.PI*2);c.fillStyle='#fff';c.fill();c.restore();
    }
    function fire(t){
      const floor=H*.77,u=Math.max(1,W/440);
      const glow=c.createRadialGradient(W/2,floor-20*u,2,W/2,floor-20*u,110*u);
      glow.addColorStop(0,'#f9863b44');glow.addColorStop(1,'#f9863b00');c.fillStyle=glow;c.fillRect(0,floor-140*u,W,230*u);
      for(let i=0;i<9;i++){
        const x=W/2+(i-4)*7*u,h=(26+Math.sin(i*1.8+t*(reduced?0:2.5))*8+(4-Math.abs(i-4))*10)*u;
        c.beginPath();c.moveTo(x-8*u,floor);c.bezierCurveTo(x-20*u,floor-h*.45,x+12*u,floor-h*.8,x+Math.sin(t+i)*7*u,floor-h);c.bezierCurveTo(x+20*u,floor-h*.55,x+14*u,floor-5*u,x+8*u,floor);c.closePath();
        const g=c.createLinearGradient(0,floor,0,floor-h);g.addColorStop(0,'#ffe4a5');g.addColorStop(.4,'#fca24e');g.addColorStop(1,'#b83636aa');c.fillStyle=g;c.fill();
      }
      for(let i=0;i<25&&!reduced;i++){const a=(t*.25+i/25)%1;c.globalAlpha=(1-a)*.8;box(W/2+Math.sin(i*2+t)*34*u,floor-15*u-a*130*u,2,2,'#ffb36d');}c.globalAlpha=1;
    }
    // Fracturas ramificadas que se propagan desde el punto de impacto.
    function cracks(t){
      const progress=Math.min(1,Math.max(0,(t-(reduced?1:3.1))/(reduced?.5:2)));
      if(progress===0)return;
      const cx=W*.5,cy=H*.46,R=Math.hypot(W,H),count=17;
      c.save();
      for(let i=0;i<count;i++){
        const angle=i*Math.PI*2/count+.11*Math.sin(i*2),len=R*(.52+.12*Math.sin(i));
        const pts=[{x:cx,y:cy}];
        for(let j=1;j<=6;j++){const r=len*j/6;pts.push({x:cx+Math.cos(angle+.06*Math.sin(i+j*4))*r,y:cy+Math.sin(angle+.06*Math.sin(i+j*4))*r});}
        const steps=Math.min(6,progress*6);
        c.beginPath();c.moveTo(cx,cy);
        for(let j=1;j<=Math.ceil(steps);j++){const f=Math.min(1,steps-j+1);c.lineTo(pts[j-1].x+(pts[j].x-pts[j-1].x)*f,pts[j-1].y+(pts[j].y-pts[j-1].y)*f);}
        c.strokeStyle='rgba(196,210,232,.65)';c.lineWidth=.9;c.shadowColor='#b8b9ef';c.shadowBlur=3;c.stroke();c.shadowBlur=0;
        for(let j=1;j<Math.floor(steps);j++){
          const a=angle+(j%2?.52:-.42),r=len*.12;
          c.beginPath();c.moveTo(pts[j].x,pts[j].y);c.lineTo(pts[j].x+Math.cos(a)*r*.5,pts[j].y+Math.sin(a)*r*.5);c.lineTo(pts[j].x+Math.cos(a+.15)*r,pts[j].y+Math.sin(a+.15)*r);c.strokeStyle='#a998ba66';c.lineWidth=.65;c.stroke();
        }
        if(progress>.5){
          c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(angle)*R*progress,cy+Math.sin(angle)*R*progress);c.lineTo(cx+Math.cos(angle+.14)*R*progress,cy+Math.sin(angle+.14)*R*progress);c.closePath();c.fillStyle=i%3===0?'#bbaccb0c':'#00000016';c.fill();
        }
      }
      c.restore();
    }
    function draw(ms){
      if(!active)return;
      if(start===null) start=ms;
      const t=(ms-start)/1000, duration=reduced?3.5:7.8;
      const contact=reduced?.6:1.7;
      const consumed=Math.max(0,Math.min(1,(t-contact)/(reduced?1:2.6)));
      intensity=Math.max(0,Math.min(1,(t-contact)/(reduced?1.4:3.2)));
      c.globalAlpha=1;box(0,0,W,H,'#050309');
      const haze=c.createRadialGradient(W*.5,H*.55,0,W*.5,H*.55,H*.8);haze.addColorStop(0,'#37203f');haze.addColorStop(1,'#050309');c.globalAlpha=intensity*.65;c.fillStyle=haze;c.fillRect(0,0,W,H);c.globalAlpha=1;
      // Fragmentos de señal suaves, sin parpadeos de pantalla completa.
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
        const u=Math.max(1,W/440);c.scale(u,u);
        const w=90, h=58;
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
        const phase=Math.floor(t*1.5);
        for(let i=0;i<4;i++){
          const sy=(phase*17+i*67)%Math.max(1,H-10),offset=Math.round(Math.sin(phase+i)*intensity*8);
          c.drawImage(canvas,0,sy,W,4,offset,sy,W,4);
        }
        c.globalAlpha=intensity*.04;for(let yy=0;yy<H;yy+=5)box(0,yy,W,1,'#8e5c9a');c.globalAlpha=1;
      }
      cracks(t);
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
