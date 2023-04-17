import '/style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { Pane } from 'tweakpane'
import gsap from 'gsap'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Hexasphere } from './hexagon/hexagon';


let renderer , camera , control;
let geometry , material , sphere;
let meshMaterials;
export let scene
const canvasWebGl = document.querySelector('canvas.webgl');

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
  // width: 500,
  // height: 500
}



const stats = new Stats()
document.body.appendChild(stats.dom)






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
  control.enablePan = false
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

  let axis = new THREE.AxesHelper(15)
  // scene.add(axis)

  const params = {
    radius: 5, 
    subdivide:2, 
    tileSize: .95,
    sides: 0
  }
  const pane = new Pane()
  setTimeout(()=> {
    params.sides = sphere.children.length
    pane.addMonitor(params, 'sides')
  },1)
 
  pane.addInput(params, 'radius', {
    min: 1,
    max: 10
  }).on('change', removeChangeModel);
  pane.addInput(params, 'subdivide', {
    min: 1,
    max: 5,
    step: 1
  }).on('change', removeChangeModel);
  pane.addInput(params, 'tileSize', {
    min: 0,
    max: 1,
    step: 0.001
  }).on('change', removeChangeModel);
  
  
  function removeChangeModel()
  {
    scene.children.forEach(element => 
    {   
        if(element.name == 'hexagonSphere'){
  
          scene.remove(element)
          sphere.clear()
        }
        createHexagonSphere3D(params.radius, params.subdivide, params.tileSize);
        params.sides = sphere.children.length
        // console.log(params);
        // console.log(sphere.children.length);

      });
  }


  //  let light = new THREE.DirectionalLight(0xffffff, 1, 500 );
  //   scene.add( light );
  //   light.position.set(1800,500,1800);


  // Texture Image

  let textureLoader = new THREE.TextureLoader();
  meshMaterials = [];
  for(let i = 1; i < 43; i++){
    let texture = textureLoader.load(`00${i}.jpg`)
    texture.flipY = false
    let m = new THREE.MeshBasicMaterial({
      // color: Math.random() * 0x7f7f7f + 0x7f7f7f,
      map:texture,
      transparent: true,
      // wireframe: true
    });
    meshMaterials.push( m );
  }



  sphere = new THREE.Group()
  sphere.name = 'hexagonSphere'
 
  
  createHexagonSphere3D(params.radius, params.subdivide, params.tileSize);
  // Detail 1 have 12 sides
  // Detail 2 have 42 sides
  // Detail 3 have 92 sides



  let box = new THREE.BoxGeometry()


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
   
  
    // Animation Colors
    // sphere.children[getRandomInt(0, sphere.children.length)].material.color = new THREE.Color(Math.random() * 0xffffff)
    // sphere.rotation.y += delta * 0.1

  
    stats.update()
    control.update()
    renderer.render( scene, camera );
  }
}


function createHexagonSphere3D(radius, divisions, tileSize) 
{
    // Calling Hexaspher class
    var hexasphere = new Hexasphere(radius, divisions, tileSize);
    // console.log(hexasphere);

    // for(var i = 0; i< 3; i++)
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
              new THREE.Vector2 (0.5, 0.0),
              new THREE.Vector2 (1.0, 0.5),
              new THREE.Vector2 (0.8, 1.0),
              new THREE.Vector2 (0.2, 1.0),
              new THREE.Vector2 (0.0, 0.4),
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
                // best
                // new THREE.Vector2(0.5, 0.5),
                // new THREE.Vector2(0.8, 0.65),
                // new THREE.Vector2(0.6, 0.85),
                // new THREE.Vector2(0.4, 0.85),
                // new THREE.Vector2(0.2, 0.65),
                // new THREE.Vector2(0.2, 0.35),

            
                new THREE.Vector2 (0.4, 0.0),
                new THREE.Vector2 (1.0, 0.5),
                new THREE.Vector2 (0.8, 1.0),
                new THREE.Vector2 (0.25, 1.0),
                new THREE.Vector2 (0.0, 0.5),

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
          }
          
          
          for(var z = 0; z< uvArray.length; z++)
          {
            // take a structure from above and put it into 'uv'
            uvAttribute.setXY(z, uvArray[z].x, uvArray[z].y);
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
          mesh.name = 'hexa'
          sphere.add(mesh)
          hexasphere.tiles[i].mesh = mesh;
    }
    scene.add(sphere)

    // Animation Scales 
    // let scales = sphere.children.map( hexa=> hexa.scale)

    // gsap.to(scales, { x: 1.025  ,y: 1.025 , z:1.025 , 
    //   stagger: {
    //   from: "random",
    //   amount: 2.5,
    //   each: 1,
    //   ease: 'Power3.in',
    //   repeat: -1,
    //   yoyo: true
    // } }) 


  
    //  Animation opacity
    // let materialsOpacity = sphere.children.map( hexa=> hexa.material)
    // gsap.to(materialsOpacity, { opacity: 0.4 , duration: 1.25 , ease: "elastic.inOut", stagger: 0.1 , yoyo: true , repeat: -1}) 




};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}





// Moving Sphere

/** Animation */
 
// Animation Group transion
sphere.position.z = -10
gsap.to(sphere.position, {z: 0, duration: 1, ease: "Back.inOut(1.1)"})

sphere.children[17].rotation.z = Math.PI
sphere.children[12].rotation.y = Math.PI
// sphere.children[24].rotation.y = -Math.PI
