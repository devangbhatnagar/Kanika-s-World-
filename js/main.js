import * as THREE from '../node_modules/three/build/three.module.js?v=joystick-20261107e';
import {createWorld} from './world.js?v=joystick-20261107e';import {setupControls} from './controls.js?v=joystick-20261107e';import {followCamera} from './camera.js?v=joystick-20261107e';import {animateCharacter} from './characters.js?v=joystick-20261107g';import {bindInteractions} from './interactions.js?v=joystick-20261107e';import {startFireworks} from './fireworks.js?v=joystick-20261107e';import {setSound,isSound} from './audio.js?v=joystick-20261107e';import {festivals} from './data.js?v=joystick-20261107e';import {festivalPanel,showLetter} from './festivals.js?v=joystick-20261107e';
const $=s=>document.querySelector(s);let world,controls,state,finalStop=null,performanceMode=false;
try{const canvas=$('#world'),mobile=matchMedia('(max-width: 700px), (pointer: coarse)').matches,lowPower=mobile||navigator.hardwareConcurrency<=4||navigator.deviceMemory<=4||matchMedia('(prefers-reduced-motion: reduce)').matches;performanceMode=lowPower;const renderer=new THREE.WebGLRenderer({canvas,antialias:!lowPower,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,performanceMode?1:1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=false;renderer.outputColorSpace=THREE.SRGBColorSpace;world=createWorld(renderer,lowPower);controls=setupControls(canvas,$('#joystick'),$('#lookPad'));state={...world,found:0,lit:0,blessed:false,updateProgress(){ $('#progressText').textContent=`${this.found} / 10 discoveries`;$('#progressBar').style.width=`${this.found*10}%`;if(this.found===10){setTimeout(()=>unlockFinal(),700)}},releaseLantern(){const l=new THREE.Mesh(new THREE.SphereGeometry(.4,12,10),new THREE.MeshBasicMaterial({color:0xffca70}));l.position.copy(this.chars[0].position);l.position.y=2;this.scene.add(l);const up=()=>{l.position.y+=.035;l.position.x+=.006;if(l.position.y<28)requestAnimationFrame(up);else this.scene.remove(l)};up()}};bindInteractions(state);
 const performanceBtn=$('#performanceBtn');function setPerformanceMode(enabled){performanceMode=enabled;renderer.setPixelRatio(Math.min(devicePixelRatio,enabled?1:1.5));renderer.setSize(innerWidth,innerHeight);world.scene.traverse(object=>{if(object.isPointLight)object.visible=!enabled});performanceBtn.setAttribute('aria-pressed',String(enabled));performanceBtn.textContent=enabled?'⚡ PERF: ON':'⚡ PERF: OFF';performanceBtn.title=enabled?'Lower graphics load is enabled':'Higher visual quality is enabled';}
 setPerformanceMode(performanceMode);performanceBtn.onclick=()=>setPerformanceMode(!performanceMode);
 let lastFrame=0,animationFrame=0,gameActive=false;
 function loop(t){
  if(!gameActive||document.hidden){animationFrame=0;return}
  animationFrame=requestAnimationFrame(loop);
  const interval=performanceMode?1000/30:1000/50;
  if(t-lastFrame<interval)return;
  const dt=Math.min(lastFrame?(t-lastFrame)/1000:1/30,.05);
  lastFrame=t;
  const time=t*.001,c=state.chars[0],k=state.chars[1];
  let forward=Number(Boolean(controls.keys.w||controls.keys.arrowup))-Number(Boolean(controls.keys.s||controls.keys.arrowdown))-controls.joy.y;
  let side=Number(Boolean(controls.keys.d||controls.keys.arrowright))-Number(Boolean(controls.keys.a||controls.keys.arrowleft))+controls.joy.x;
  const len=Math.hypot(forward,side);
  if(len>.08){
   forward/=Math.max(1,len);
   side/=Math.max(1,len);
   const a=controls.yaw;
   const dx=(side*Math.cos(a)+forward*Math.sin(a))*4*dt;
   const dz=(side*Math.sin(a)-forward*Math.cos(a))*4*dt;
   const nx=THREE.MathUtils.clamp(c.position.x+dx,-7,7);
   let nz=c.position.z+dz;
   const wrapOffset=nz>29?-65:nz< -36?65:0;
   nz+=wrapOffset;
   c.position.set(nx,0,nz);
   if(wrapOffset){
    k.position.z+=wrapOffset;
    world.camera.position.z+=wrapOffset;
    const followTarget=world.camera.userData.followTarget;
    if(followTarget)followTarget.z+=wrapOffset;
   }
   c.rotation.y=Math.atan2(dx,-dz);
   k.position.lerp(new THREE.Vector3(c.position.x+.75,c.position.y,c.position.z+.25),.12);
   k.rotation.y=c.rotation.y;
  }
 animateCharacter(c,time,controls.moving);animateCharacter(k,time,controls.moving);const movementBlocked=controls.moving&&!c.userData.movingNow;const hint=$('#locationHint');hint.textContent=movementBlocked?'Street edge — steer back toward the middle.':'Explore the gali and find the glowing places.';state.locations.forEach(l=>{l.orb.rotation.y+=dt*.8;l.orb.position.y=1.05+Math.sin(time*2+l.index)*.13;l.light.intensity=l.unlocked?.35:1.2+Math.sin(time*3+l.index)*.3});followCamera(world.camera,c,controls,dt);renderer.render(world.scene,world.camera)}
 function startLoop(){if(gameActive&&!document.hidden&&!animationFrame){lastFrame=0;animationFrame=requestAnimationFrame(loop)}}
 function stopLoop(){if(animationFrame)cancelAnimationFrame(animationFrame);animationFrame=0}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopLoop();else startLoop()});
 addEventListener('resize',()=>{world.camera.aspect=innerWidth/innerHeight;world.camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
 function updateSoundButton(){const button=$('#soundBtn');button.textContent=isSound()?'♫ MUSIC ON':'♫ MUSIC OFF';button.setAttribute('aria-pressed',String(isSound()))}
 $('#enterWorld').onclick=()=>{const intro=$('#intro');intro.classList.add('hidden');$('#game').classList.remove('hidden');gameActive=true;$('#welcome').textContent='Welcome to our little Diwali world, Kanika ✨';$('#loading').classList.add('hidden');startLoop();setSound(true).then(updateSoundButton).catch(error=>{console.error('Could not start festive music:',error);$('#soundBtn').textContent='♫ AUDIO UNAVAILABLE'})};
 $('#soundBtn').onclick=()=>{setSound(!isSound()).then(updateSoundButton).catch(error=>{console.error('Could not change sound:',error);$('#soundBtn').textContent='♫ AUDIO UNAVAILABLE'})};
 function unlockFinal(){if($('#finalScreen').classList.contains('hidden')===false)return;gameActive=false;stopLoop();$('#game').classList.add('hidden');$('#finalScreen').classList.remove('hidden');const finalContent=document.querySelector('.final-content');finalContent.classList.remove('finale-ready');finalStop=startFireworks($('#finalFireworks'),()=>finalContent.classList.add('finale-ready'))}
 $('#celebrateAgain').onclick=()=>{if(finalStop)finalStop();const finalContent=document.querySelector('.final-content');finalContent.classList.remove('finale-ready');finalStop=startFireworks($('#finalFireworks'),()=>finalContent.classList.add('finale-ready'))};
 function openFestivalLetters(){const m=$('#storyModal');m.querySelector('.modal-card').classList.remove('gallery-modal');$('#modalContinue').textContent='Back to our gali →';$('#modalIcon').textContent='🪔';$('#modalKicker').textContent='FIVE FESTIVALS · FIVE PERSONAL LETTERS';$('#modalTitle').textContent='Letters for every festival';$('#modalText').textContent='Choose a festival to read your letter.';$('#modalExtra').innerHTML=festivalPanel();m.classList.remove('hidden');document.querySelectorAll('[data-festival]').forEach(b=>b.onclick=()=>{const festival=festivals[Number(b.dataset.festival)];$('#festivalLetterTitle').textContent=`${festival[1]} ${festival[0]}`;$('#festivalLetterText').textContent=festival[4]})}
 $('.brand').style.cursor='pointer';$('.brand').title='Open five personal festival letters';$('.brand').onclick=openFestivalLetters;$('#festivalLettersBtn').onclick=openFestivalLetters;
 async function openGallery(){const m=$('#storyModal'),extra=$('#modalExtra');m.querySelector('.modal-card').classList.add('gallery-modal');$('#modalIcon').textContent='📷';$('#modalKicker').textContent='YOUR SHARED MOMENTS';$('#modalTitle').textContent='Our little gallery';$('#modalText').textContent='Photos, videos and reels, all in one place.';$('#modalContinue').textContent='Close gallery';extra.replaceChildren();m.classList.remove('hidden');try{const response=await fetch(new URL('../gallery.json',import.meta.url));if(!response.ok)throw new Error(`Gallery list request failed (${response.status})`);const media=await response.json();if(!Array.isArray(media))throw new Error('Gallery list has an invalid format');if(media.length===0){const empty=document.createElement('p');empty.className='gallery-empty';empty.textContent='Your gallery is ready. Add photos or videos to the gallery folder, then refresh. For a hosted site, rebuild with npm run build and redeploy.';extra.append(empty);return}const grid=document.createElement('div');grid.className='gallery-grid';media.forEach(item=>{if(!item||typeof item.file!=='string'||!['image','video'].includes(item.type))return;const figure=document.createElement('figure');figure.className='gallery-item';const src=new URL(`../gallery/${encodeURIComponent(item.file)}`,import.meta.url).href;if(item.type==='video'){const video=document.createElement('video');video.src=src;video.controls=true;video.preload='metadata';video.playsInline=true;figure.append(video)}else{const image=document.createElement('img');image.src=src;image.alt=item.file;image.loading='lazy';figure.append(image)}const caption=document.createElement('figcaption');caption.textContent=item.file.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ');figure.append(caption);grid.append(figure)});if(grid.childElementCount)extra.append(grid);else{const empty=document.createElement('p');empty.className='gallery-empty';empty.textContent='No supported photos or videos found. See gallery/README.txt for file types.';extra.append(empty)}}catch(error){console.error(error);const message=document.createElement('p');message.className='gallery-empty';message.textContent='Could not load the gallery list. On a static host, rebuild and redeploy after adding files to the gallery folder.';extra.append(message)}}
 $('#galleryBtn').onclick=openGallery;function pauseGalleryVideos(){document.querySelectorAll('#modalExtra video').forEach(video=>video.pause())}document.querySelectorAll('#storyModal .close,#modalContinue').forEach(button=>button.addEventListener('click',pauseGalleryVideos));
 // Memory letter available from the final courtyard and final-screen button.
 $('#openLetter').onclick=()=>{const m=$('#storyModal');m.querySelector('.modal-card').classList.remove('gallery-modal');$('#modalContinue').textContent='Back to our gali →';$('#modalIcon').textContent='💌';$('#modalKicker').textContent='A LITTLE NOTE, FROM ME';$('#modalTitle').textContent='A letter from Devang';$('#modalText').textContent=showLetter();$('#modalExtra').replaceChildren();m.classList.remove('hidden')};
 $('#loading').classList.add('hidden');
}catch(e){console.error(e);$('#loading').innerHTML='<p>The 3D world could not start. Check the browser console for details. If Three.js is missing, run <b>npm install</b> in the project folder and reload. Open through a web server, not a local file; WebGL must also be enabled.</p>'}
