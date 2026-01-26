// -----------------
// Cyberpunk Network Hero
// -----------------
const NODE_COUNT = 120;           // less nodes for smoothness
const MAX_CONNECTIONS = 3;        // connect each node to 3 closest neighbors

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

// neon colors
const colors = [0x58a6ff, 0xff6a00, 0x2ea043, 0xff2d95];
const geometries = [
  new THREE.SphereGeometry(0.035, 12, 12),
  new THREE.BoxGeometry(0.045,0.045,0.045)
];

// create nodes
for(let i=0;i<NODE_COUNT;i++){
  const geo = geometries[Math.floor(Math.random()*geometries.length)];
  const color = colors[Math.floor(Math.random()*colors.length)];
  const mat = new THREE.MeshBasicMaterial({color, transparent:true, opacity:0.8});
  const node = new THREE.Mesh(geo, mat);
  node.position.set((Math.random()-0.5)*10, (Math.random()-0.5)*6, (Math.random()-0.5)*6);
  node.userData.speed = Math.random()*0.002 + 0.001;
  nodes.push(node);
  scene.add(node);
}

// calculate nearest neighbors
function updateLines(){
  let idx = 0;
  nodes.forEach((node, i)=>{
    const dists = nodes.map((n,j)=>({j,dist: i!==j ? node.position.distanceTo(n.position) : Infinity}));
    dists.sort((a,b)=>a.dist-b.dist);
    for(let k=0;k<MAX_CONNECTIONS;k++){
      const other = nodes[dists[k].j];
      // positions
      linePositions[idx*3 + 0] = node.position.x;
      linePositions[idx*3 + 1] = node.position.y;
      linePositions[idx*3 + 2] = node.position.z;
      linePositions[idx*3 + 3] = other.position.x;
      linePositions[idx*3 + 4] = other.position.y;
      linePositions[idx*3 + 5] = other.position.z;
      // color gradient based on distance
      const c = 1 - dists[k].dist / 3;
      const col = new THREE.Color().setHSL(0.6, 1, Math.max(0.2, c*0.8));
      lineColors[idx*6 + 0] = col.r;
      lineColors[idx*6 + 1] = col.g;
      lineColors[idx*6 + 2] = col.b;
      lineColors[idx*6 + 3] = col.r;
      lineColors[idx*6 + 4] = col.g;
      lineColors[idx*6 + 5] = col.b;
      idx++;
    }
  });
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions.slice(0, idx*6), 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors.slice(0, idx*6), 3));
  lineGeo.computeBoundingSphere();
}

// animate nodes with pulsing and subtle trails
function animate(){
  requestAnimationFrame(animate);

  nodes.forEach(n=>{
    n.position.x += (Math.random()-0.5)*n.userData.speed;
    n.position.y += (Math.random()-0.5)*n.userData.speed;
    n.position.z += (Math.random()-0.5)*n.userData.speed;

    // pulsing glow
    const pulse = 0.6 + Math.sin(Date.now()*0.002 + n.position.x + n.position.y)*0.4;
    n.material.opacity = pulse;
    n.material.color.offsetHSL(0,0,(Math.sin(Date.now()*0.001+n.position.z)*0.05));
  });

  updateLines();

  // rotate scene slowly for 3D effect
  scene.rotation.y += 0.0015;
  renderer.render(scene, camera);
}
animate();

// mouse interaction for depth
document.addEventListener('mousemove', e=>{
  const mouseX = (e.clientX/window.innerWidth)*2 - 1;
  const mouseY = -(e.clientY/window.innerHeight)*2 + 1;
  scene.rotation.x = mouseY*0.15;
  scene.rotation.y = mouseX*0.15;
});

camera.position.z = 10;

// responsive
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
