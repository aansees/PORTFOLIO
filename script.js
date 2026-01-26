// -----------------
// Optimized Hero Nodes
// -----------------
const NODE_COUNT = 150; // slightly fewer
const MAX_CONNECTIONS = 4; // each node connects to max 4 closest neighbors
const nodes = [];
const positions = new Float32Array(NODE_COUNT * NODE_COUNT * 6); // max possible
const lineMat = new THREE.LineBasicMaterial({ color: 0x2ea043, transparent:true, opacity:0.2 });
const lineGeo = new THREE.BufferGeometry();
const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
scene.add(lineMesh);

// shapes for variety
const geometries = [
  new THREE.SphereGeometry(0.03, 8, 8),
  new THREE.BoxGeometry(0.05,0.05,0.05)
];

for(let i=0;i<NODE_COUNT;i++){
  const geo = geometries[Math.floor(Math.random()*geometries.length)];
  const mat = new THREE.MeshBasicMaterial({color: [0x2ea043,0x58a6ff,0xff6a00][Math.floor(Math.random()*3)], transparent:true, opacity:0.8});
  const node = new THREE.Mesh(geo, mat);
  node.position.set((Math.random()-0.5)*10, (Math.random()-0.5)*6, (Math.random()-0.5)*6);
  node.userData.speed = Math.random()*0.002 + 0.001;
  nodes.push(node);
  scene.add(node);
}

// connect nodes by nearest neighbors only
function updateLines(){
  let idx = 0;
  nodes.forEach((node, i)=>{
    // compute distances to all other nodes
    const dists = nodes.map((n,j)=>({j,dist: i!==j ? node.position.distanceTo(n.position) : Infinity}));
    dists.sort((a,b)=>a.dist-b.dist);
    for(let k=0;k<MAX_CONNECTIONS;k++){
      const other = nodes[dists[k].j];
      positions[idx++] = node.position.x;
      positions[idx++] = node.position.y;
      positions[idx++] = node.position.z;
      positions[idx++] = other.position.x;
      positions[idx++] = other.position.y;
      positions[idx++] = other.position.z;
    }
  });
  lineGeo.setAttribute('position', new THREE.BufferAttribute(positions.slice(0, idx), 3));
  lineGeo.computeBoundingSphere();
}

// animate
function animate(){
  requestAnimationFrame(animate);
  nodes.forEach(n=>{
    n.position.x += (Math.random()-0.5)*n.userData.speed;
    n.position.y += (Math.random()-0.5)*n.userData.speed;
    n.position.z += (Math.random()-0.5)*n.userData.speed;
    n.material.opacity = 0.6 + Math.sin(Date.now()*0.002 + n.position.x)*0.4;
  });
  updateLines();
  scene.rotation.y += 0.0015;
  renderer.render(scene, camera);
}
animate();
