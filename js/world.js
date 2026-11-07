import * as THREE from '../node_modules/three/build/three.module.js?v=joystick-20261107e';
import {makeCharacter} from './characters.js?v=joystick-20261107g';
export function createWorld(renderer, lowPower = false){
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x171a3a);scene.fog=new THREE.Fog(0x171a3a,22,65);
 const camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,120);camera.position.set(0,8,12);
 scene.add(new THREE.HemisphereLight(0x9ba9e5,0x4c2d25,2));
 const moon=new THREE.DirectionalLight(0xffd8a0,2.1);moon.position.set(-8,14,5);scene.add(moon);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(90,90),new THREE.MeshStandardMaterial({color:0x51404a,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.04;scene.add(ground);
 const tileStep = lowPower ? 4 : 2;
 const tilePositions=[];for(let z=-30;z<32;z+=tileStep)for(let x=-8;x<=8;x+=tileStep)tilePositions.push([x,z]);
 const tiles=new THREE.InstancedMesh(new THREE.BoxGeometry(1.92,.06,1.92),new THREE.MeshStandardMaterial({color:0xffffff,roughness:1}),tilePositions.length);
 const transform=new THREE.Object3D();
 tilePositions.forEach(([x,z],i)=>{transform.position.set(x,.02,z);transform.updateMatrix();tiles.setMatrixAt(i,transform.matrix);tiles.setColorAt(i,(Math.abs(x+z)%4===0)?new THREE.Color(0x6b555d):new THREE.Color(0x594852))});
 tiles.instanceMatrix.needsUpdate=true;if(tiles.instanceColor)tiles.instanceColor.needsUpdate=true;scene.add(tiles);
 // Houses flank the lane, with glowing windows and festive trim.
 const houseMat=[0xa94f45,0x7d607e,0xc27c45,0x526b7b,0x9a554b];
 const houses=[];for(let side of [-1,1])for(let i=0;i<7;i++)houses.push({x:side*11,z:-25+i*8,h:4.6+(i%3)*.5,color:(i+(side===1?2:0))%5});
 houseMat.forEach((color,colorIndex)=>{const instances=houses.filter(h=>h.color===colorIndex);const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(5.5,1,6.5),new THREE.MeshStandardMaterial({color,roughness:.9}),instances.length);instances.forEach((h,i)=>{transform.position.set(h.x,h.h/2,h.z);transform.scale.set(1,h.h,1);transform.updateMatrix();mesh.setMatrixAt(i,transform.matrix)});transform.scale.set(1,1,1);mesh.instanceMatrix.needsUpdate=true;scene.add(mesh)});
 const roofs=new THREE.InstancedMesh(new THREE.ConeGeometry(4.3,1.7,4),new THREE.MeshStandardMaterial({color:0x483444}),houses.length);
 const windows=new THREE.InstancedMesh(new THREE.PlaneGeometry(.9,1.1),new THREE.MeshBasicMaterial({color:0xffc76c}),houses.length*4);
 const frames=new THREE.InstancedMesh(new THREE.BoxGeometry(1.08,1.28,.12),new THREE.MeshStandardMaterial({color:0x422c2c}),houses.length*4);
 const garlands=new THREE.InstancedMesh(new THREE.TorusGeometry(1.8,.08,6,30,Math.PI),new THREE.MeshStandardMaterial({color:0xe5a33e}),houses.length);
 let windowIndex=0;
 houses.forEach((h,i)=>{transform.position.set(h.x,h.h+.65,h.z);transform.rotation.set(0,Math.PI/4,0);transform.updateMatrix();roofs.setMatrixAt(i,transform.matrix);
  for(let yy of [1.8,3.3])for(let xx of [-1.4,1.4]){transform.position.set(h.x+xx,h.h/2+yy,h.z+3.27);transform.rotation.set(0,0,0);transform.updateMatrix();windows.setMatrixAt(windowIndex,transform.matrix);transform.position.z=h.z+3.32;transform.updateMatrix();frames.setMatrixAt(windowIndex,transform.matrix);windowIndex++}
  transform.position.set(h.x,h.h+1.4,h.z+3.5);transform.rotation.set(0,0,Math.PI);transform.updateMatrix();garlands.setMatrixAt(i,transform.matrix)});
 for(const mesh of [roofs,windows,frames,garlands]){mesh.instanceMatrix.needsUpdate=true;scene.add(mesh)}
 // Street lanterns and strings
 const lanternStep = lowPower ? 16 : 8;
 for(let z=-26;z<=26;z+=lanternStep){for(let side of [-1,1]){let pole=new THREE.Mesh(new THREE.CylinderGeometry(.07,.1,4,8),new THREE.MeshStandardMaterial({color:0x49352e}));pole.position.set(side*7,2,z);scene.add(pole);let lamp=new THREE.PointLight(0xffb95d,1.4,9);lamp.position.set(side*7,4,z);lamp.visible=!lowPower;scene.add(lamp);let box=new THREE.Mesh(new THREE.BoxGeometry(.5,.7,.5),new THREE.MeshStandardMaterial({color:0xffc86f,emissive:0xb36a24,emissiveIntensity:1}));box.position.copy(lamp.position);scene.add(box)}}
 const chars=[makeCharacter("DEVANG",0xe9e2d5),makeCharacter("KANIKA",0xb84950)];chars[0].position.set(-.55,0,5);chars[1].position.set(.55,0,5);chars[1].rotation.y=.15;chars.forEach(c=>scene.add(c));
 const points=[[-4,2], [4,-3],[-4,-9],[4,-15],[-3,-21],[3,-27],[0,-33],[5,9],[-5,13],[0,19]];
 const names=["The First Diya","Our Little Gali","The Rangoli","The Sparklers","The Sweet Shop","The Anar","The Temple Courtyard","The Festive Bazaar","The Sky Lantern","The Final Courtyard"];
 const icons=["🪔","🏘️","🌸","✨","🍬","🎇","🛕","🏮","🌌","🎆"];
 const locations=points.map(([x,z],i)=>{let group=new THREE.Group();group.position.set(x,.1,z);let base=new THREE.Mesh(new THREE.CylinderGeometry(1.05,1.2,.16,32),new THREE.MeshStandardMaterial({color:0x9b6943,metalness:.5}));group.add(base);
 let ring=new THREE.Mesh(new THREE.TorusGeometry(.83,.055,8,40),new THREE.MeshStandardMaterial({color:0xffc66e,emissive:0x8c4b15,emissiveIntensity:.5}));ring.rotation.x=Math.PI/2;ring.position.y=.2;group.add(ring);
 let orb=new THREE.Mesh(new THREE.OctahedronGeometry(.32),new THREE.MeshStandardMaterial({color:0xffd17a,emissive:0xff9c32,emissiveIntensity:1.6}));orb.position.y=1.05;group.add(orb);
 let light=new THREE.PointLight(0xffb75c,1.3,5);light.position.y=1.1;light.visible=!lowPower;group.add(light);
 scene.add(group);return {group,orb,light,x,z,name:names[i],icon:icons[i],index:i,unlocked:false};});
 // Extra diyas
 const diyas=[];const diyaCount = lowPower ? 12 : 28;for(let i=0;i<diyaCount;i++){let x=(Math.random()-.5)*13,z=-27+Math.random()*52;let g=new THREE.Group();g.position.set(x,.1,z);let bowl=new THREE.Mesh(new THREE.SphereGeometry(.22,12,8,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0xb96d32,metalness:.45}));bowl.rotation.x=Math.PI;g.add(bowl);let flame=new THREE.Mesh(new THREE.ConeGeometry(.07,.25,8),new THREE.MeshBasicMaterial({color:0xffd16d}));flame.position.y=.2;g.add(flame);let l=new THREE.PointLight(0xffa944,.45,2.5);l.position.y=.3;l.visible=!lowPower;g.add(l);scene.add(g);diyas.push({g,lit:false,flame,l})}
 // Rangoli medallions
 for(let z of [-13,5,21]){let r=new THREE.Mesh(new THREE.TorusGeometry(1.2,.04,6,64),new THREE.MeshStandardMaterial({color:0xe6b35f,emissive:0x75401d,emissiveIntensity:.5}));r.rotation.x=Math.PI/2;r.position.set(0,.08,z);scene.add(r)}
 const starCount = lowPower ? 45 : 160;const stars=new THREE.InstancedMesh(new THREE.SphereGeometry(.035,5,5),new THREE.MeshBasicMaterial({color:0xffffff}),starCount);
 for(let i=0;i<starCount;i++){transform.position.set((Math.random()-.5)*65,8+Math.random()*22,-40+Math.random()*80);transform.updateMatrix();stars.setMatrixAt(i,transform.matrix);stars.setColorAt(i,Math.random()>.5?new THREE.Color(0xffe0a1):new THREE.Color(0xaab6ef))}
 stars.instanceMatrix.needsUpdate=true;if(stars.instanceColor)stars.instanceColor.needsUpdate=true;scene.add(stars);
 return {scene,camera,chars,locations,diyas,renderer};
}
