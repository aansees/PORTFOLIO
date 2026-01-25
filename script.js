// -----------------
// Hero: Dynamic 3D Nodes (shifted right)
// -----------------
const canvas = document.getElementById('hero-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: canvas, alpha:true, antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);

const NODE_COUNT = 200;
const NODE_OFFSET_X = 1.5; // Shift nodes to the right
const nodes = [];
const lines = new THREE.Group();
scene.add(lines);

const geometries = [
  new THREE.SphereGeometry(0.03, 12, 12),
  new THREE.BoxGeometry(0.05,0.05,0.05),
  new THREE.ConeGeometry(0.03,0.06,8)
];

for(let i=0;i<NODE_COUNT;i++){
  const geo = geometries[Math.floor(Math.random()*geometries.length)];
  const mat = new THREE.MeshBasicMaterial({
    color: [0x2ea043,0x58a6ff,0xff6a00][Math.floor(Math.random()*3)], 
    transparent:true, opacity:0.8
  });
  const node = new THREE.Mesh(geo, mat);
  
  // shifted to right
  node.position.set(
    (Math.random()-0.5)*10 + NODE_OFFSET_X, 
    (Math.random()-0.5)*6, 
    (Math.random()-0.5)*6
  );
  node.userData.speed = Math.random()*0.002 + 0.001;
  nodes.push(node);
  scene.add(node);
}

// connect nodes dynamically
function connectNodes(){
  lines.clear();
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const dist = nodes[i].position.distanceTo(nodes[j].position);
      if(dist<1.2){
        const mat = new THREE.LineBasicMaterial({color:0x2ea043, opacity:0.2, transparent:true});
        const points = [nodes[i].position,nodes[j].position];
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geo, mat);
        lines.add(line);
      }
    }
  }
}
connectNodes();

// animate nodes
function animate(){
  requestAnimationFrame(animate);
  nodes.forEach(n=>{
    n.position.x += (Math.random()-0.5)*n.userData.speed;
    n.position.y += (Math.random()-0.5)*n.userData.speed;
    n.position.z += (Math.random()-0.5)*n.userData.speed;
    n.material.opacity = 0.6 + Math.sin(Date.now()*0.002 + n.position.x)*0.4; // pulsing
  });
  connectNodes();
  scene.rotation.y += 0.0015;
  renderer.render(scene, camera);
}
animate();

// mouse interaction
document.addEventListener('mousemove', e=>{
  const mouseX = (e.clientX/window.innerWidth)*2 - 1;
  const mouseY = -(e.clientY/window.innerHeight)*2 + 1;
  scene.rotation.x = mouseY*0.12;
  scene.rotation.y = mouseX*0.12;
});

camera.position.z = 10;
scene.position.x = NODE_OFFSET_X; // shift whole scene

// -----------------
// Projects Section
// -----------------
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

// -----------------
// Lab Section (Professional)
// -----------------
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

// -----------------
// Skills Section
// -----------------
const skillsList = ["JavaScript","HTML/CSS","Node.js","React","Git/GitHub","Linux","Network Security","OWASP Top 10"];
const skillsGrid = document.getElementById('skills-grid');
skillsList.forEach(s=>{
  const span = document.createElement('span');
  span.textContent = s;
  skillsGrid.appendChild(span);
});

// -----------------
// Terminal Section
// -----------------
const terminalInput = document.getElementById('terminal-input');
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

// -----------------
// Responsive
// -----------------
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
