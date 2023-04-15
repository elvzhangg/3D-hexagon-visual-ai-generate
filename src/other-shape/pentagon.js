import '/style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { Pane } from 'tweakpane'
import gsap from 'gsap'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



let renderer , scene , camera , control;
let geometry , materials , mesh;




let textureLoader = new THREE.TextureLoader();




const canvasWebGl = document.querySelector('canvas.webgl');

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const params = {
  data: 'test'
}

const stats = new Stats()
document.body.appendChild(stats.dom)






// Tweakpane for devolpment
// localhost:5173/#   Open tweakpane 
if(window.location.href.includes('#'))
{
  const pane = new Pane()
  pane.addInput(params, 'data')
}




function init()
{
  
  scene = new THREE.Scene()

  renderer = new THREE.WebGLRenderer({
    canvas: canvasWebGl,
    antialias: true
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


  camera = new THREE.PerspectiveCamera(45 , sizes.width / sizes.height , 0.1 , 3000 )
  camera.position.z = 14
  scene.add(camera)

  
  control = new OrbitControls(camera, canvasWebGl)
  control.enableDamping = true

  window.addEventListener('resize', () =>
  { 
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width , sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

 let light = new THREE.DirectionalLight(0xffffff, 1, 500 );
  scene.add( light );
  light.position.set(1800,500,1800);



  // let textures = [];
  // [
  //   "https://threejs.org/examples/textures/uv_grid_opengl.jpg",
  //   "https://threejs.org/examples/textures/brick_diffuse.jpg"
  // ].forEach(t => {
  //   textureLoader.load(t, tex => {
  //     textures.push(tex);
  //   });
  // })


  materials = [];
  for(let i = 1; i < 13; i++){
    let m = new THREE.MeshBasicMaterial({
      // color: Math.random() * 0x7f7f7f + 0x7f7f7f,
      map: textureLoader.load(`00${i}.jpg`)
      // map: textureLoader.load(`https://threejs.org/examples/textures/brick_diffuse.jpg`)
    });
    materials.push( m );
  }

  mesh = new THREE.Mesh(createDodecahedron(), materials);
  scene.add(mesh);


 

  // setInterval(()=>{
  // 	let m = materials[THREE.MathUtils.randInt(0, 11)];
  //   let t = textures[THREE.MathUtils.randInt(0, 1)];
  //   m.map = t;
  //   m.map.needsUpdate = true;
  //   m.color.set(Math.random() * 0x7f7f7f + 0x7f7f7f);
  // }, 100);



}
init()



let delta;
let fpsInterval, now, then , elapsed, startTime;
const clock = new THREE.Clock()
function LockFrame(fps)
{

  fpsInterval = 1000 / fps
  then = window.performance.now()
  startTime = then
  animate()
}
LockFrame(60)



function animate()
{
  requestAnimationFrame(animate)
  now  = window.performance.now()
  elapsed = now - then

  if(elapsed >= fpsInterval)
  {
    then = now - (elapsed % fpsInterval)
    const delta = clock.getDelta();
 
    

    stats.update()
    control.update()
    renderer.render( scene, camera );
  }
}


function createDodecahedron(){
	let geometry = new THREE.DodecahedronGeometry(5, 0);
	geometry.clearGroups();
  const base = new THREE.Vector2(0, 0.5);
  const center = new THREE.Vector2();
  const angle = THREE.MathUtils.degToRad(72);
  let baseUVs = [
    base.clone().rotateAround(center, angle * 1).addScalar(0.5),
    base.clone().rotateAround(center, angle * 2).addScalar(0.5),
    base.clone().rotateAround(center, angle * 3).addScalar(0.5),
    base.clone().rotateAround(center, angle * 4).addScalar(0.5),
    base.clone().rotateAround(center, angle * 0).addScalar(0.5)
  ];

  let uvs = [];
  let startIndex = 0;
  for (let i = 0; i < 12; i++){
    uvs.push(
      baseUVs[1].x, baseUVs[1].y,
      baseUVs[2].x, baseUVs[2].y,
      baseUVs[0].x, baseUVs[0].y,

      baseUVs[2].x, baseUVs[2].y,
      baseUVs[3].x, baseUVs[3].y,
      baseUVs[0].x, baseUVs[0].y,

      baseUVs[3].x, baseUVs[3].y,
      baseUVs[4].x, baseUVs[4].y,
      baseUVs[0].x, baseUVs[0].y
    );
    geometry.addGroup(startIndex, 9, i);
    startIndex += 9;
  }
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  // console.log(geometry);
  return geometry;
}


