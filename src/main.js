import '/style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { Pane } from 'tweakpane'
import gsap from 'gsap'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Hexasphere } from './hexagon/hexagon';
import { Water } from 'three/examples/jsm/objects/Water'
import * as ColorTheif from 'colorthief'


let renderer , camera , control;
let geometry , material , sphere, sphere2 , water;
let meshMaterials;
let raycaster = new THREE.Raycaster()
let opacitEffectKey = 0
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


const textureWater = 'https://images.unsplash.com/photo-1579896052301-52bed413bc80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';

function init()
{
  
  scene = new THREE.Scene()

  renderer = new THREE.WebGLRenderer({
    canvas: canvasWebGl,
    antialias: true
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor( 0xffffff, 0);


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
    radius: 3.5, 
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
    step: 1,
    disabled: true, 
    hidden: true
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
// ColorTheifg

  // Texture Image

  let textureLoader = new THREE.TextureLoader();
  meshMaterials = [];



  for(let i = 1; i < 43; i++){


    let texture = textureLoader.load(`00${i}.jpg`)
    texture.flipY = false
    texture.center.x = 0.5
    texture.center.y = 0.5

    // Rotation slope
    // Hexagon
    if(i == 18  ) { texture.rotation = 1 }
    if(i == 20 || i == 11 || i == 5  || i == 33 || i == 17  || i == 34 || i == 42 || i == 38  || i == 23 || i == 32 || i == 29 || i == 40 ) { texture.rotation = 0.5 }
    if(i == 6  || i == 39 || i == 41  || i == 27 || i == 30 || i == 13 || i == 22) { texture.rotation = -0.5 }  
    if(i == 16) { texture.rotation = 0.45}  
    if(i == 14) { texture.rotation = -0.75} 
    if(i == 10) { texture.rotation = -0.65}  
    if(i == 12) { texture.rotation = -0.1}  
    if(i == 7)  { texture.rotation = 0.75}  
    if(i == 9)  { texture.rotation = -0.45}  
    if(i == 4)  { texture.rotation = 0.2}  

    // Pentagon

    texture.matrixAutoUpdate = true
    let m = new THREE.MeshBasicMaterial({
      map:texture,
      transparent: true,
    });
    meshMaterials.push( m );
  }

  sphere = new THREE.Group()
  sphere.name = 'hexagonSphere'
 
  
  createHexagonSphere3D(params.radius, params.subdivide, params.tileSize);
  // Detail 1 have 12 sides
  // Detail 2 have 42 sides
  // Detail 3 have 92 sides



  // let box = new THREE.BoxGeometry()
  // let materialBox = new THREE.MeshBasicMaterial({
  //   wireframe: true
  // })
  // let meshBox = new THREE.Mesh(box, materialBox)
  // scene.add(meshBox)
  // console.log(box);




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
const radiusOrbit = 7;
let HexagonTile;
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
    sphere.rotation.y += delta * 0.1
    angle -= 0.005;
    const x = center.x + radiusOrbit * Math.cos(angle);
    const z = center.z + radiusOrbit * Math.sin(angle);
    sphere2.position.set(x, 0 , z);

    water.material.uniforms[ 'time' ].value += 0.1 / 60.0;

    // sphere.children.forEach( mesh => {
    //   mesh.material.opacity = 0.4
    // })

    // Effect Camera Raycaster
    if(opacitEffectKey == 1) {
      OpacityRaycasterCameraEffect()
    }


    // console.log(scene.children);


    stats.update()
    control.update()
    renderer.render( scene, camera );
  }
}


function createHexagonSphere3D(radius, divisions, tileSize) 
{
    opacitEffectKey = 1
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
              new THREE.Vector3( 0.00,  0.87 , 0.00),
              new THREE.Vector3(-1.00,  0.25 , 0.00),
              new THREE.Vector3( 1.00,  0.25 , 0.00),
              new THREE.Vector3(-0.50, -0.87 , 0.00),
              new THREE.Vector3( 0.50, -0.87 , 0.00),
            ]; 

            // ! arrange order Something here
            //  Create 5 verteices
            uvArray = [
              // start bottom left (0,0)
              new THREE.Vector2 (1.00, 0.50),
              new THREE.Vector2 (0.50, 1.00),
              new THREE.Vector2 (0.00, 0.50),
              new THREE.Vector2 (0.25, 0.00),
              new THREE.Vector2 (0.75, 0.00),
            ];

          }
          
          // Hexagon Shape
          if(t.boundary.length == 6){
              // Create 6 verteices
              vertexArray = [
                new THREE.Vector3(1.0  , 0.00  , 0.00),
                new THREE.Vector3(0.5  , 0.87  , 0.00),
                new THREE.Vector3(-0.5 , 0.87  , 0.00),
                new THREE.Vector3(-1.0 , 0.00  , 0.00),
                new THREE.Vector3(-0.5 , -0.87 , 0.00),
                new THREE.Vector3(0.5  , -0.87 , 0.00),
              ]; 

               // Create 6 UV coordinate
              uvArray = [
                new THREE.Vector2(1, 0.5),
                new THREE.Vector2(0.75, 1.00),
                new THREE.Vector2(0.25, 1.00),
                new THREE.Vector2(0, 0.5),
                new THREE.Vector2(0.25, 0.00),
                new THREE.Vector2(0.75, 0.00),
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
            vertices[j * 3]     = bp.x;
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
            indices[i * 3]     = face[0];
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

 // Sphere2 small
  sphere2 = new THREE.Group().copy(sphere)
  sphere2.name = "hexagonSphere2"
  sphere2.position.x = 8
  sphere2.scale.set(0.25,0.25,0.25)
  sphere2.children.forEach( mesh => {
    mesh.name = "hexa2"
    // mesh.material.transparent = false
  })

  scene.add(sphere2)



function OpacityRaycasterCameraEffect() {
     // Raycaster
     raycaster.setFromCamera( new THREE.Vector2(), camera );   
     scene.children.forEach( model => {
      if(model.name == "hexagonSphere")
      {
        HexagonTile = model
        model.children.forEach(hexatile => {
          hexatile.material.opacity = 0.4
          //  gsap.to( hexatile.material.opacity, {opacity: 0, duration: 1})    
        })
      }
    })
  
     var objects = raycaster.intersectObjects(scene.children);
     if (objects.length > 0) {
        for (var i in objects) 
        {
          if(objects[i].object.name == "hexa"){
            // console.log(objects[i].object.name);
            objects[ i ].object.material.opacity = 1    
            // gsap.to(objects[ i ].object.material, {opacity: 1, duration: 1})        
            // gsap.to(objects[ i ].object.material, {color: 'red' , duration: 1})        
            
            // gsap.to(objects[ i ].object.material, {opacity: 0.4, duration: 1 ,delay: 1})        
          }
        }
     } 
}



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

// Texture Flip
// sphere.children[17].rotation.z = Math.PI
// sphere.children[12].rotation.y = Math.PI


// sphere.children[17].material.opacity = 1
// console.log(sphere.children[0].material);


const createReflector = () => {
  const m_geo = new THREE.CircleGeometry( 4, 32 );
  water = new Water( m_geo, {
    textureWidth: 2048 ,
    textureHeight: 2048 ,
    waterNormals: new THREE.TextureLoader().load( textureWater, function ( texture ) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    } ),
    waterColor: 0xCCCCEE,
    distortionScale: 1.2
  } );
  water.material.uniforms[ 'size' ].value = 2;
  water.rotation.x = -Math.PI / 2;
  water.position.y = -3.75
  return water;
}
scene.add(createReflector())