import '/style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { Pane } from 'tweakpane'
import gsap from 'gsap'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Hexasphere } from './hexagon/hexagon';


let renderer , scene , camera , control;
let geometry , material , mesh, mesh2;


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


  // Texture Image

  let textureLoader = new THREE.TextureLoader();
  var meshMaterials = [];
  for(let i = 1; i < 31; i++){
    let m = new THREE.MeshBasicMaterial({
      // color: Math.random() * 0x7f7f7f + 0x7f7f7f,
      map:textureLoader.load(`00${i}.jpg`)
    });
    meshMaterials.push( m );
  }

  let createScene = function(radius, divisions, tileSize) 
  {
      // Calling Hexaspher class
      var hexasphere = new Hexasphere(radius, divisions, tileSize);
      console.log(hexasphere);

      for(var i = 0; i< hexasphere.tiles.length; i++)
      {
            var t = hexasphere.tiles[i];

            // Creatd With BefferGeometry Instead of Geometry 
            // Because deprecated
            var geometry = new THREE.BufferGeometry();

            // It's depend of each vertex if have 5 vertex will adding with 5 stucture
            // And it's have 6 vertex will adding with 6 structure
            let vertexArray;       
            let uvArray;
            
            // Pentagon Shape
            if(t.boundary.length == 5)
            {
              // Create 5 verteices
              vertexArray = [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(1, 1, 1),
              ]; 

              // ! arrange order Something here
              //  Create 5 verteices
              uvArray = [
                new THREE.Vector2(0.5, 0.5),
                new THREE.Vector2(1, 1),
                new THREE.Vector2(0, 1),
                new THREE.Vector2(0, 0),
                new THREE.Vector2(1, 0)
              ];

            }
            
            // Hexagon Shape
            if(t.boundary.length == 6){
                // Create 6 verteices
                vertexArray = [
                  new THREE.Vector3(1, 0, 0),
                  new THREE.Vector3(0, 1, 0),
                  new THREE.Vector3(0, 0, 1),
                  new THREE.Vector3(0, 1, 0),
                  new THREE.Vector3(1, 0, 0),
                  new THREE.Vector3(0, 0, 1),
                ]; 

                // ! arrange order Something here
                 // Create 6 verteices
                uvArray = [
                  new THREE.Vector2(0.5, 0.5),
                  new THREE.Vector2(1, 0.75),
                  new THREE.Vector2(1, 0.25),
                  new THREE.Vector2(0.5, 0),
                  new THREE.Vector2(0, 0.25),
                  new THREE.Vector2(0, 0.75)
                ];

            }

            // Create uv for mapping texture images
            const uvAttribute = new THREE.BufferAttribute(new Float32Array(uvArray.length * 2), 2);
            
            // Create vertex for geometry
            const vertices = new Float32Array(vertexArray.length * 3); // 6 vertices * 3 values per vertex
            
            // take vertex from hexasphere put into buffergeometry
            for(var j = 0; j< t.boundary.length; j++){
           
              // value from Hexasphere class and put it into 'position'
              var bp = t.boundary[j];
              vertices[j * 3] = bp.x;
              vertices[j * 3 + 1] = bp.y;
              vertices[j * 3 + 2] = bp.z;

              // take a structure from above and put it into 'uv'
              uvAttribute.setXY(j, uvArray[j].x, uvArray[j].y);
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            geometry.setAttribute('uv', uvAttribute);



            // Create Faces
            // 15 =~ pentagon
            // 18 =~ hexagon
            let faces;
            if(geometry.attributes.position.array.length == 15){
              faces = [
                [0, 1, 2],
                [0, 2, 3],
                [0, 3, 4],
              ];
            }

             if(geometry.attributes.position.array.length == 18){
              faces = [
                [0, 1, 2],
                [0, 2, 3],
                [0, 3, 4],
                [0, 4, 5]
              ];
            }

            const indices = new Uint16Array(faces.length * 3);
    
            for (let i = 0; i < faces.length; i++) {
              const face = faces[i];
              indices[i * 3] = face[0];
              indices[i * 3 + 1] = face[1];
              indices[i * 3 + 2] = face[2];
            }
            
            geometry.setIndex(new THREE.BufferAttribute(indices, 1));
            

            // Material
            material = meshMaterials[i]



            var mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            hexasphere.tiles[i].mesh = mesh;
            // console.log(mesh);
      }
  };
  
  createScene(5, 2, .95);


  let box = new THREE.BoxGeometry()
  console.log(box)


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


const center = new THREE.Vector3(0, 0, 0);
let angle = 0;
const radius = 6;
function animate()
{
  requestAnimationFrame(animate)
  now  = window.performance.now()
  elapsed = now - then

  if(elapsed >= fpsInterval)
  {
    then = now - (elapsed % fpsInterval)
    const delta = clock.getDelta();
    // angle += 0.01;
    // const x = center.x + radius * Math.cos(angle);
    // const z = center.z + radius * Math.sin(angle);
    // mesh2.position.set(x, 0 , z);




    stats.update()
    control.update()
    renderer.render( scene, camera );
  }
}
