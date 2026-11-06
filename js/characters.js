import * as THREE from '../node_modules/three/build/three.module.js';
export function makeCharacter(name,mainColor,skin=0xb97855){
 const g=new THREE.Group();g.name=name;
 const mat=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:.78});
 const body=new THREE.Mesh(new THREE.CapsuleGeometry(.28,.48,4,8),mat(mainColor));body.position.y=.78;g.add(body);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.29,16,12),mat(skin));head.position.y=1.48;g.add(head);
 const hair=new THREE.Mesh(new THREE.SphereGeometry(.30,16,10,0,Math.PI*2,0,Math.PI*.56),mat(0x241a20));hair.position.y=1.57;g.add(hair);
 const eyeMat=mat(0x211923);[-.105,.105].forEach(x=>{let e=new THREE.Mesh(new THREE.SphereGeometry(.025,8,8),eyeMat);e.position.set(x,1.49,.26);g.add(e)});
 const legMat=mat(0x40394a);for(let x of [-.12,.12]){let l=new THREE.Mesh(new THREE.CylinderGeometry(.07,.08,.38,8),legMat);l.position.set(x,.22,0);g.add(l)}
 const scarf=new THREE.Mesh(new THREE.BoxGeometry(.12,.5,.1),mat(name==="KANIKA"?0xf1c76c:0xd5b58b));scarf.position.set(.19,.85,.27);g.add(scarf);
 g.userData={body,legs:g.children.filter(o=>o.geometry?.type==="CylinderGeometry"),phase:Math.random()*5};return g;
}
export function animateCharacter(c,t,moving){const p=c.userData.phase;const previous=c.userData.previousPosition??(c.userData.previousPosition=c.position.clone());const actuallyMoving=moving&&c.position.distanceToSquared(previous)>.000001;c.userData.movingNow=actuallyMoving;previous.copy(c.position);if(actuallyMoving){c.userData.legs.forEach((l,i)=>l.rotation.x=Math.sin(t*9+p+i*Math.PI)*.65);c.userData.body.position.y=.78+Math.abs(Math.sin(t*9+p))*.045;}else{c.userData.legs.forEach(l=>l.rotation.x=0);c.userData.body.position.y=.78+Math.sin(t*2+p)*.012;}}
