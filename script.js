// -----------------
// Hero Canvas Setup
// -----------------
const canvas = document.getElementById('hero-canvas');
canvas.style.height = "60vh"; // constrain canvas height
canvas.style.width = "100%";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: canvas, alpha:true, antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 12;

// -----------------
// Nodes & Network
// -----------------
const NODE_COUNT = 100;
const MAX_CONNECTIONS = 3;
const nodes = [];
const linePositions = new Float32Array(NODE_COUNT * MAX_CONNECTIONS * 6);
const lineColors = new Float32Array(NODE_COUNT * MAX_CONNECTIONS * 6);

const lineMat = new THREE.LineBasicMaterial({vertexColors:true, transparent:true, opacity:0.35});
const lineGeo = new THREE.BufferGeometry();
const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
scene.add(lineMesh);

const colors = [0x58a6ff, 0xff6a00, 0x2ea043];
const geometries = [
  new THREE.SphereGeometry(0.04, 12, 12),
  new THREE.BoxGeometry(0.045,0.045,0.045)
];

// create nodes in spread out positions
for(let i=0;i<NODE_COUNT;i++){
  const geo = geometries[Math.floor(Math.random()*geometries.length)];
  const color = colors[Math.floor(Math.random()*colors.length)];
  const mat = new THREE.MeshBasicMaterial({color, transparent:true, opacity:0.8});
  const node = new THREE.Mesh(geo, mat);

  // spread nodes in 3D, avoiding overlapping text area (Y>0 is top)
  const x = (Math.random()-0.5)*10;
  const y = (Math.random()*4 - 2); // keep mostly within canvas top half
  const z = (Math.random()-0.5)*6;
  node.position.set(x,y,z);

  // velocity for smooth motion
  node.userData.vel = new THREE.Vector3(
    (Math.random()-0.5)*0.0015,
    (Math.random()-0.5)*0.0015,
    (Math.random()-0.5)*0.0015
  );

  nodes.push(node);
  scene.add(node);
}

// connect nodes by nearest neighbors
function updateLines(){
  let idx = 0;
  nodes.forEach((node,i)=>{
    const dists = nodes.map((n,j)=>({j,dist:i!==j?node.position.distanceTo(n.position):Infinity}));
    dists.sort((a,b)=>a.dist-b.dist);
    for(let k=0;k<MAX_CONNECTIONS;k++){
      const other = nodes[dists[k].j];
      linePositions[idx*3+0] = node.position.x;
      linePositions[idx*3+1] = node.position.y;
      linePositions[idx*3+2] = node.position.z;
      linePositions[idx*3+3] = other.position.x;
      linePositions[idx*3+4] = other.position.y;
      linePositions[idx*3+5] = other.position.z;

      // line color based on distance
      const c = 1 - dists[k].dist/4;
      const col = new THREE.Color().setHSL(0.6,1,Math.max(0.25,c*0.8));
      lineColors[idx*6+0] = col.r;
      lineColors[idx*6+1] = col.g;
      lineColors[idx*6+2] = col.b;
      lineColors[idx*6+3] = col.r;
      lineColors[idx*6+4] = col.g;
      lineColors[idx*6+5] = col.b;

      idx++;
    }
  });
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions.slice(0,idx*6),3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors.slice(0,idx*6),3));
  lineGeo.computeBoundingSphere();
}

// animate network
function animate(){
  requestAnimationFrame(animate);

  nodes.forEach(n=>{
    n.position.add(n.userData.vel);

    // bounce inside canvas box
    if(Math.abs(n.position.x) > 5) n.userData.vel.x *= -1;
    if(Math.abs(n.position.y) > 2.5) n.userData.vel.y *= -1;
    if(Math.abs(n.position.z) > 3) n.userData.vel.z *= -1;

    // pulsing glow
    const pulse = 0.6 + Math.sin(Date.now()*0.002 + n.position.x + n.position.y)*0.4;
    n.material.opacity = pulse;
  });

  updateLines();

  // slow rotation for 3D depth
  scene.rotation.y += 0.0012;
  renderer.render(scene, camera);
}
animate();

// mouse parallax
document.addEventListener('mousemove', e=>{
  const mx = (e.clientX/window.innerWidth)*2 -1;
  const my = -(e.clientY/window.innerHeight)*2 +1;
  scene.rotation.x = my*0.12;
  scene.rotation.y = mx*0.12;
});

// responsive
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// -----------------
// Keep the rest of your code exactly as-is
// -----------------

// Projects Section
const projects = [
  {name:"Secure Auth API",desc:"JWT auth with refresh tokens",tech:"Node • JWT • Security"},
  {name:"Password Checker",desc:"Check password strength & breaches",tech:"JS • Crypto"},
  {name:"Portfolio Site",desc:"Personal portfolio built with JS",tech:"HTML • CSS • JS"}
];
const projectGrid = document.getElementById('project-grid');
projects.forEach((p,i)=>{
  const div = document.createElement('div');
  div.className = 'project-card';
  div.innerHTML = `<h3>${p.name}</h3><p>${p.desc}</p><span>${p.tech}</span>`;
  projectGrid.appendChild(div);
  setTimeout(()=>div.classList.add('show'), i*200);
});

// Lab Section
const labProjects = [
  {title:"Password Tool",desc:"Analyze password safety",tech:"JS • Security",link:"#"},
  {title:"API Demo",desc:"Secure API endpoints",tech:"Node.js",link:"#"},
  {title:"Portfolio Generator",desc:"Automated portfolio script",tech:"HTML • JS",link:"#"}
];
const labGrid = document.getElementById('lab-grid');
labProjects.forEach((p,i)=>{
  const div = document.createElement('div');
  div.className = 'lab-card';
  div.innerHTML = `
    <h3>${p.title}</h3>
    <p>${p.desc}</p>
    <span>${p.tech}</span>
    <br>
    <a href="${p.link}" target="_blank">GitHub</a>
  `;
  labGrid.appendChild(div);
  setTimeout(()=>div.classList.add('show'), i*200);
});

// Skills Section
const skillsList = ["JavaScript","HTML/CSS","Node.js","React","Git/GitHub","Linux","Network Security","OWASP Top 10"];
const skillsGrid = document.getElementById('skills-grid');
skillsList.forEach(s=>{
  const span = document.createElement('span');
  span.textContent = s;
  skillsGrid.appendChild(span);
});

// Terminal Section
const terminalInput = document.getElementById('terminal-input');
console.log("Key pressed:", e.key, "Input value:", terminalInput.value);
const terminalOutput = document.getElementById('terminal-output');
terminalInput.addEventListener('keydown', function(e){
  if(e.key==='Enter'){
    const cmd = terminalInput.value.trim().toLowerCase();
    
    if(cmd==='help') terminalOutput.textContent='commands:\nwhoami\nprojects\nskills\nbanner';
    else if(cmd==='whoami') terminalOutput.textContent='Security-focused Developer';
    else if(cmd==='projects') terminalOutput.textContent = projects.map(p=>p.name).join('\n');
    else if(cmd==='skills') terminalOutput.textContent = skillsList.join(', ');
    else if(cmd==='banner'){
      terminalOutput.textContent = '🚀 Welcome to my cyberpunk portfolio!';
      nodes.forEach(n=>n.material.color.set(0x58a6ff));
      setTimeout(()=>nodes.forEach(n=>n.material.color.set(0x2ea043)),500);
    }
    else terminalOutput.textContent='Command not found';
    
    terminalInput.value='';
  }
});

// Responsive
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
// ================= BABY SECRET REDIRECT =================
// Keep your existing terminal listener intact, this is an additional listener
(function(){
  const terminalInput = document.getElementById('terminal-input');
  if(!terminalInput) return; // safety check

  terminalInput.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){
      const value = terminalInput.value.trim().toLowerCase();
      if(value === 'baby'){
        // optional: debug log
        console.log("Baby command detected → redirecting to secret page");
        // redirect to baby.html in same folder
        window.location.href = "baby.html";
      }
    }
  });
})();
