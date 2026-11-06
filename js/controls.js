export function setupControls(canvas,joystick,lookPad){const keys={};let joy={x:0,y:0};addEventListener('keydown',e=>{const key=e.key.toLowerCase();keys[key]=true;if(key.startsWith('arrow'))e.preventDefault()});addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});let dragging=false,lastX=0,lastY=0,yaw=0,pitch=.18;
 const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
 const down=e=>{dragging=true;lastX=e.clientX;lastY=e.clientY};const move=e=>{if(!dragging)return;yaw-=(e.clientX-lastX)*.004;pitch=clamp(pitch+(e.clientY-lastY)*.002,-.05,.65);lastX=e.clientX;lastY=e.clientY};const up=()=>dragging=false;
 canvas.addEventListener('pointerdown',down);addEventListener('pointermove',move);addEventListener('pointerup',up);

 let lookDragging=false,lookLastX=0,lookLastY=0;
 const lookDown=e=>{if(e.pointerType==='mouse'&&e.button!==0)return;lookDragging=true;lookLastX=e.clientX;lookLastY=e.clientY;lookPad.setPointerCapture(e.pointerId)};
 const lookMove=e=>{if(!lookDragging)return;yaw-=(e.clientX-lookLastX)*.005;pitch=clamp(pitch+(e.clientY-lookLastY)*.003,-.05,.65);lookLastX=e.clientX;lookLastY=e.clientY};
 const lookUp=e=>{lookDragging=false;lookPad.releasePointerCapture?.(e.pointerId)};
 lookPad.addEventListener('pointerdown',lookDown);lookPad.addEventListener('pointermove',lookMove);lookPad.addEventListener('pointerup',lookUp);lookPad.addEventListener('pointercancel',()=>lookDragging=false);

 const stick=joystick.querySelector('.stick');let activePointerId=null;joystick.addEventListener('pointerdown',e=>{if(activePointerId!==null||(e.pointerType==='mouse'&&e.button!==0))return;e.preventDefault();activePointerId=e.pointerId;updateJoy(e)});const moveJoy=e=>{if(e.pointerId===activePointerId)updateJoy(e)};const stopJoy=e=>{if(e.pointerId!==activePointerId)return;activePointerId=null;resetJoy()};addEventListener('pointermove',moveJoy);addEventListener('pointerup',stopJoy);addEventListener('pointercancel',stopJoy);
 let activeTouchId=null;if(!('PointerEvent' in globalThis)){joystick.addEventListener('touchstart',e=>{if(activeTouchId!==null)return;e.preventDefault();const touch=e.changedTouches[0];if(!touch)return;activeTouchId=touch.identifier;updateJoy(touch)},{passive:false});addEventListener('touchmove',e=>{const touch=[...e.changedTouches].find(item=>item.identifier===activeTouchId);if(touch){e.preventDefault();updateJoy(touch)}},{passive:false});const stopTouch=e=>{if([...e.changedTouches].some(touch=>touch.identifier===activeTouchId)){activeTouchId=null;resetJoy()}};addEventListener('touchend',stopTouch);addEventListener('touchcancel',stopTouch)}
 function resetJoy(){joy={x:0,y:0};stick.style.transform='translate(0,0)'}
 function updateJoy(e){const r=joystick.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),len=Math.hypot(dx,dy),k=Math.min(1,42/(len||1));joy={x:dx*k/42,y:dy*k/42};stick.style.transform=`translate(${joy.x*35}px,${joy.y*35}px)`}
 return {keys,get joy(){return joy},get yaw(){return yaw},get pitch(){return pitch},get moving(){return !!(keys.w||keys.a||keys.s||keys.d||keys.arrowup||keys.arrowdown||keys.arrowleft||keys.arrowright||Math.abs(joy.x)+Math.abs(joy.y)>.12)}};
}
