import {fireworkSound} from './audio.js';

export function startFireworks(canvas,onGreeting){
 const context=canvas.getContext('2d');
 const lowPower=matchMedia('(max-width: 700px), (pointer: coarse)').matches||navigator.hardwareConcurrency<=4||navigator.deviceMemory<=4||matchMedia('(prefers-reduced-motion: reduce)').matches;
 const pixelRatio=Math.min(devicePixelRatio,lowPower?1:1.5);
 let width,height,particles=[],rockets=[],running=true,greetingTimer=0,formation=null;
 function resize(){width=canvas.width=innerWidth*pixelRatio;height=canvas.height=innerHeight*pixelRatio;context.setTransform(pixelRatio,0,0,pixelRatio,0,0)}
 resize();
 addEventListener('resize',resize);

 function formGreeting(){
  const textCanvas=document.createElement('canvas');
  textCanvas.width=innerWidth;textCanvas.height=innerHeight;
  const textContext=textCanvas.getContext('2d',{willReadFrequently:true});
  const lines=['happy diwali','kanika,','with lots of love','from devang'];
  textContext.font='700 1px Georgia, serif';
  const longestLine=Math.max(...lines.map(line=>textContext.measureText(line).width));
  const fontSize=Math.max(20,Math.min(84,innerWidth*.92/longestLine,innerHeight*.66/(lines.length*1.25)));
  textContext.font=`700 ${fontSize}px Georgia, serif`;
  textContext.textAlign='center';textContext.textBaseline='middle';
  textContext.fillStyle='#fff';
  const lineHeight=fontSize*1.25,firstY=(innerHeight-lineHeight*(lines.length-1))/2;
  lines.forEach((line,index)=>textContext.fillText(line,innerWidth/2,firstY+index*lineHeight));

  const pixels=textContext.getImageData(0,0,innerWidth,innerHeight).data;
  const step=lowPower?4:3,targets=[];
  for(let y=0;y<innerHeight;y+=step)for(let x=0;x<innerWidth;x+=step)if(pixels[(y*innerWidth+x)*4+3]>100)targets.push({x,y});
  const sources=[{x:innerWidth*.2,y:innerHeight*.28},{x:innerWidth*.5,y:innerHeight*.72},{x:innerWidth*.8,y:innerHeight*.28}];
  formation=targets.map((target,index)=>{
   const source=sources[index%sources.length];
   return {sx:source.x+(Math.random()-.5)*innerWidth*.13,sy:source.y+(Math.random()-.5)*innerHeight*.12,tx:target.x,ty:target.y,twinkle:Math.random()};
  });
  formation.started=performance.now();
  if(onGreeting)onGreeting();
  textCanvas.width=0;textCanvas.height=0;
 }
 if(onGreeting)greetingTimer=setTimeout(formGreeting,2500);

 function burst(x,y){
  const hue=Math.random()*48+28,count=lowPower?36:95;
  for(let i=0;i<count;i++){
   const angle=Math.random()*Math.PI*2,speed=Math.random()*5+1;
   particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1,decay:.009+Math.random()*.012,hue:hue+Math.random()*25});
  }
  fireworkSound();
 }
 function launch(){rockets.push({x:Math.random()*innerWidth,y:innerHeight+5,vx:(Math.random()-.5)*1.4,vy:-7-Math.random()*3,target:innerHeight*(.15+Math.random()*.4)})}

 let lastLaunch=0;
 function frame(time){
  if(!running)return;
  context.clearRect(0,0,innerWidth,innerHeight);
  if(!formation&&time-lastLaunch>(lowPower?900:650)){launch();lastLaunch=time}
  rockets.forEach((rocket,index)=>{
   rocket.x+=rocket.vx;rocket.y+=rocket.vy;rocket.vy+=.035;
   context.fillStyle='#ffe1a1';context.fillRect(rocket.x,rocket.y,2,8);
   if(rocket.y<rocket.target){burst(rocket.x,rocket.y);rockets.splice(index,1)}
  });
  particles.forEach((particle,index)=>{
   particle.x+=particle.vx;particle.y+=particle.vy;particle.vy+=.045;particle.vx*=.985;particle.life-=particle.decay;
   context.globalAlpha=Math.max(0,particle.life);context.fillStyle=`hsl(${particle.hue},90%,68%)`;
   context.beginPath();context.arc(particle.x,particle.y,2.1,0,Math.PI*2);context.fill();
   if(particle.life<=0)particles.splice(index,1);
  });
  if(formation){
   const progress=Math.min(1,(performance.now()-formation.started)/2200),ease=1-Math.pow(1-progress,3);
   context.shadowColor='#ffad39';context.shadowBlur=lowPower?7:11;
   formation.forEach(particle=>{
    const x=particle.sx+(particle.tx-particle.sx)*ease,y=particle.sy+(particle.ty-particle.sy)*ease;
    context.globalAlpha=particle.twinkle>.86?.98:.9;
    context.fillStyle=particle.twinkle>.86?'#fffef0':'#ffe19a';
    context.beginPath();context.arc(x,y,lowPower?2.25:2.55,0,Math.PI*2);context.fill();
   });
   context.shadowBlur=0;context.globalAlpha=1;
  }
  context.globalAlpha=1;
  requestAnimationFrame(frame);
 }
 requestAnimationFrame(frame);
 return ()=>{running=false;clearTimeout(greetingTimer);removeEventListener('resize',resize)};
}
