// -----------------
// Butter-Smooth Network
// -----------------
const NODE_COUNT = 120;
const MAX_CONNECTIONS = 3;
const nodes = [];
const linePositions = new Float32Array(NODE_COUNT * MAX_CONNECTIONS * 6);
const lineColors = new Float32Array(NODE_COUNT * MAX_CONNECTIONS * 6);

const lineMat = new THREE.LineBasicMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.4
});
const lineGeo = new THREE.BufferGeometry();
const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
scene.add(lineMesh);

// colors
const colors = [0x58a6ff, 0xff6a00, 0x2ea043];
const geometries = [
  new THREE.SphereGeometry(0.035, 12, 12),
  new THREE.BoxGeometry(0.045,0.045,0.045)
];

// create nodes with velocity
for(let i=0;i<NODE_COUNT;i++){
  const geo = geometries[Math.floor(Math.random()*geometries.length)];
  const color = colors[Math.floor(Math.random()*colors.length)];
  const mat = new THREE.MeshBasicMaterial({color, transparent:true, opacity:0.8});
  const node = new THREE.Mesh(geo, mat);
  node.position.set((Math.random()-0.5)*10, (Math.random()-0.5)*6, (Math.random()-0.5)*6);
  // velocity for smooth motion
  node.userData.vel = new THREE.Vector3(
    (Math.random()-0.5)*0.002,
    (Math.random()-0.5)*0.002,
    (Math.random()-0.5)*0.002
  );
  nodes.push(node);
  scene.add(node);
}

// nearest neighbors for lines
function updateLines(){
  let idx = 0;
  nodes.forEach((node, i)=>{
    const dists = nodes.map((n,j)=>({j,dist: i!==j ? node.position.distanceTo(n.position) : Infinity}));
    dists.sort((a,b)=>a.dist-b.dist);
    for(let k=0;k<MAX_CONNECTIONS;k++){
      const other = nodes[dists[k].j];
      linePositions[idx*3+0] = node.position.x;
      linePositions[idx*3+1] = node.position.y;
      linePositions[idx*3+2] = node.position.z;
      linePositions[idx*3+3] = other.position.x;
      linePositions[idx*3+4] = other.position.y;
      linePositions[idx*3+5] = other.position.z;
      const c = 1 - dists[k].dist/3;
      const col = new THREE.Color().setHSL(0.6, 1, Math.max(0.2, c*0.8));
      lineColors[idx*6+0] = col.r;
      lineColors[idx*6+1] = col.g;
      lineColors[idx*6+2] = col.b;
      lineColors[idx*6+3] = col.r;
      lineColors[idx*6+4] = col.g;
      lineColors[idx*6+5] = col.b;
      idx++;
    }
  });
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions.slice(0, idx*6), 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors.slice(0, idx*6), 3));
  lineGeo.computeBoundingSphere();
}

// animate buttery-smooth motion
function animate(){
  requestAnimationFrame(animate);

  nodes.forEach(n=>{
    // move by velocity
    n.position.add(n.userData.vel);
    // bounce back when hitting bounds
    if(Math.abs(n.position.x) > 5) n.userData.vel.x *= -1;
    if(Math.abs(n.position.y) > 3) n.userData.vel.y *= -1;
    if(Math.abs(n.position.z) > 3) n.userData.vel.z *= -1;

    // smooth pulsing glow
    const pulse = 0.6 + Math.sin(Date.now()*0.002 + n.position.x + n.position.y)*0.4;
    n.material.opacity = pulse;
  });

  updateLines();

  // slow rotation for depth
  scene.rotation.y += 0.001;
  renderer.render(scene, camera);
}
animate();

// mouse rotation
document.addEventListener('mousemove', e=>{
  const mx = (e.clientX/window.innerWidth)*2 -1;
  const my = -(e.clientY/window.innerHeight)*2 +1;
  scene.rotation.x = my*0.12;
  scene.rotation.y = mx*0.12;
});

camera.position.z = 10;

