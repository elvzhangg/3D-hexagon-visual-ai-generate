import '/style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { Pane } from 'tweakpane'
import gsap from 'gsap'

let renderer , scene , camera , control;
let geometry , material , pointCloud;
var opacityArray = [];
var q = ["pink", "red", "red", "red", "maroon", "maroon", "maroon"];


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



  let textureLoader = new THREE.TextureLoader();
  let earthTexture = textureLoader.load('earth.jpg');
  earthTexture.wrapS = THREE.RepeatWrapping;
  earthTexture.wrapT = THREE.RepeatWrapping;
  earthTexture.repeat.set(1, 1);
  geometry = new THREE.SphereGeometry(5,256,128)


  // Color each points
  let colors = [];
  let color = new THREE.Color();
  for (let i = 0; i < geometry.attributes.position.count; i++) 
  {
    color.set(q[Math.floor(Math.random() * ((q.length - 1) - 0) + 0)]);  // ! not necessary
    color.toArray(colors, i * 3);
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));



  // opacity
  for (var i = 0; i < geometry.attributes.position.count; i++) {
    opacityArray.push(Math.random());
  }



  var disk = textureLoader.load('circle.png');

  pointCloud = new THREE.Points(geometry, new THREE.ShaderMaterial({
    vertexColors: THREE.VertexColors,
    uniforms: {
      visibility: {
        value: earthTexture
      },
      shift: {
        value: 0
      },
      shape: {
        value: disk
      },
      size: {
        value: 0.2
      },
      scale: {
        value: window.innerHeight / 2
      }
    },
    vertexShader: `
        attribute vec3 color;

        uniform float scale;
        uniform float size;

        varying vec2 vUv;
        varying vec3 vColor;
        
        void main() {
        
          vUv = uv;
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          gl_PointSize = size * ( scale / length( mvPosition.xyz )) * (0.3 + sin(uv.y * 3.1415926) * 0.6 );
          gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform sampler2D visibility;
        uniform float shift;
        uniform sampler2D shape;

        varying vec2 vUv;
        varying vec3 vColor;
  
        void main() {

          vec2 uv = vUv;
          uv.x += shift;
          vec4 v = texture2D(visibility, uv);
          if (length(v.rgb) > 1.0) discard;
  
          gl_FragColor = vec4( vColor.rgb, 0.5);
          vec4 shapeData = texture2D( shape, gl_PointCoord );
          if (shapeData.a < 0.0625) discard;
          gl_FragColor = gl_FragColor * shapeData;
        }
    `,
    transparent: true
  }));
  scene.add(pointCloud);


  var blackGlobe = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    color: 0x120000
  }));
  blackGlobe.scale.setScalar(0.99);
  pointCloud.add(blackGlobe);

  pointCloud.position.z = -8

  gsap.to(pointCloud.position,{ z: 0, duration: 0.5, ease: "Back.inOut(1.7)"})






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
 
    
      for (var i = 0; i < geometry.attributes.position.count; i++) {
    
        opacityArray[i] += (Math.random() - 0.5) * 0.1; // adjust the opacity by a random amount
        opacityArray[i] = Math.max(0, Math.min(1, opacityArray[i])); // clamp the opacity value to between 0 and 1
        var color = new THREE.Color(q[Math.floor(Math.random() * q.length)]);
        geometry.attributes.color.setXYZ(i, color.r, color.g, color.b); // set the color attribute to the new color value
      }
      geometry.attributes.color.needsUpdate = true;



    stats.update()
    control.update()
    renderer.render( scene, camera );
  }
}




