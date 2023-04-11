import '/style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { Pane } from 'tweakpane'
import gsap from 'gsap'

let renderer , scene , camera , control;
let geometry , material , mesh;


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

  geometry = new THREE.DodecahedronGeometry(5, 0)
  material = new THREE.MeshStandardMaterial({
    color: 'gray'
  })
  mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

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




