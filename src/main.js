console.log('%cCreated By: Supadet Pinsuwannabut', 'background-color:red ;color: white; font-size: 30px; font-weight: bold');
console.log('https://github.com/ToonKru3');
import '/style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { Pane } from 'tweakpane'
import gsap from 'gsap'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Hexasphere } from './hexagon/hexagon';
import { Water } from 'three/examples/jsm/objects/Water'


let renderer , camera , control;
let geometry , material , sphere, sphere2 , sphere3 , water;
let meshMaterials;
let params;
let raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2();
let particularGruop
let modularGruop
let isRotateSphere = false
let opacitEffectKey = false
let isWaterAnimation = true
export let scene
const canvasWebGl = document.querySelector('canvas.webgl');
let pane; 
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
  // width: 500,
  // height: 500
}



const stats = new Stats()
document.body.appendChild(stats.dom)


const textureWater = 'https://images.unsplash.com/photo-1579896052301-52bed413bc80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
const manager = new THREE.LoadingManager();
let textureLoader = new THREE.TextureLoader(manager);

let percentage;
manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
  percentage = (itemsLoaded / itemsTotal) * 100
  document.querySelector('.loading').innerHTML = `${percentage.toFixed(1)}%`
};  

manager.onLoad = function ( ) {

  // document.querySelector('.loading').style.opacity = percentage
  gsap.to('.loading', { opacity: 0 , display: 'none' })

  gsap.to(sphere.position,  {z: 0, duration: 1, ease: "Back.inOut(1.1)" , onComplete: () => {
      isRotateSphere = true
  }})

  gsap.to(sphere2.position, { z: 0, duration: 1, ease: "Back.inOut(1.1)"})
  gsap.to(sphere3.position, { z: 0, duration: 1, ease: "Back.inOut(1.1)"})
};




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
  camera.position.z = 25
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

  params = {
    zCamera: 25,
    sphere1: {
      radius: 3.54, 
      subdivide: 3, 
      tileSize: .98,
      sides: 0,
    },
    sphere2: {
      radius: 4.51, 
      subdivide:2, 
      tileSize: .98,
      sides: 0,
    },
    sphere3: {
      radius: 3.04, 
      subdivide:2, 
      tileSize: .98,
      sides: 0,
    }
  }
  pane = new Pane({
    title: 'Setting Parameters',
    expanded:  false
  })


  // Sphere1
  let Folder0 = pane.addFolder({
    title: "Camera",
  })

  Folder0.addInput(camera.position, 'z' , {
    min: 0,
    max: 50,
    step: 1,
  }).on('change', () => manager.onLoad());

  // Sphere1
  let Folder1 = pane.addFolder({
    title: "Sphere1",
  })

  setTimeout(()=> {
    params.sphere1.sides = sphere.children.length
    Folder1.addMonitor(params.sphere1, 'sides')
  }, 1)
 
  Folder1.addInput(params.sphere1, 'radius', {
    min: 1,
    max: 10
  }).on('change', () => removeChangeModel(sphere));
  Folder1.addInput(params.sphere1, 'subdivide', {
    min: 1,
    max: 5,
    step: 1,
    disabled: true, 
    hidden: true
  }).on('change', () => removeChangeModel(sphere));
  Folder1.addInput(params.sphere1, 'tileSize', {
    min: 0,
    max: 1,
    step: 0.001
  }).on('change', () => removeChangeModel(sphere));


   // Sphere2
   let Folder2 = pane.addFolder({
    title: "Sphere2"
  })

  setTimeout(()=> {
    params.sphere2.sides = sphere2.children.length
    Folder2.addMonitor(params.sphere2, 'sides')
  }, 1)
 
  Folder2.addInput(params.sphere2, 'radius', {
    min: 1,
    max: 10
  }).on('change', () => removeChangeModel(sphere2));
  Folder2.addInput(params.sphere2, 'subdivide', {
    min: 1,
    max: 5,
    step: 1,
    disabled: true, 
    hidden: true
  }).on('change', () => removeChangeModel(sphere2));
  Folder2.addInput(params.sphere2, 'tileSize', {
    min: 0,
    max: 1,
    step: 0.001
  }).on('change', () => removeChangeModel(sphere2));


  // Sphere2
  let Folder3 = pane.addFolder({
    title: "Sphere3"
  })

  setTimeout(()=> {
    params.sphere3.sides = sphere3.children.length
    Folder3.addMonitor(params.sphere3, 'sides')
  }, 1)

  Folder3.addInput(params.sphere3, 'radius', {
    min: 1,
    max: 10
  }).on('change', () => removeChangeModel(sphere3));
  Folder3.addInput(params.sphere3, 'subdivide', {
    min: 1,
    max: 5,
    step: 1,
    disabled: true, 
    hidden: true
  }).on('change', () => removeChangeModel(sphere3));
  Folder3.addInput(params.sphere3, 'tileSize', {
    min: 0,
    max: 1,
    step: 0.001
  }).on('change', () => removeChangeModel(sphere3));



  function removeChangeModel(objectGroup)
  {
    scene.children.forEach(element => 
      {   
        if(element.name == 'hexagonSphere' && element.name == objectGroup.name){  
          scene.remove(element)
          sphere.clear()
          createHexagonSphere3D(params.sphere1.radius, params.sphere1.subdivide, params.sphere1.tileSize, sphere);
          params.sphere1.sides = sphere.children.length
        }

        if(element.name == 'hexagonSphere2' && element.name == objectGroup.name){  
          scene.remove(element)
          sphere2.clear()
          createHexagonSphere3D(params.sphere2.radius, params.sphere2.subdivide, params.sphere2.tileSize, sphere2);
          params.sphere2.sides = sphere2.children.length
        }

        if(element.name == 'hexagonSphere3' && element.name == objectGroup.name){  
          scene.remove(element)
          sphere3.clear()
          createHexagonSphere3D(params.sphere3.radius, params.sphere3.subdivide, params.sphere3.tileSize, sphere3);
          params.sphere3.sides = sphere3.children.length
        }
      });
  }


  //  let light = new THREE.DirectionalLight(0xffffff, 1, 500 );

  //   light.position.set(1800,500,1800);


    // var light = new THREE.SpotLight(0xFFFFFF, 3);
    // light.position.set(5, 5, 2);
    // light.castShadow = true;
    // light.shadow.mapSize.width = 10000;
    // light.shadow.mapSize.height = light.shadow.mapSize.width;
    // light.penumbra = 0.5;
    // scene.add( light );

    // var lightBack = new THREE.PointLight(0x0FFFFF, 1);
    // lightBack.position.set(0, -3, -1);
    // scene.add(lightBack);


  // Texture Image
  

  

  sphere = new THREE.Group()
  sphere.name = 'hexagonSphere'
  sphere.position.y = 0.5
  sphere.position.z = -30
  // Sphere1 Big
  createHexagonSphere3D(params.sphere1.radius, params.sphere1.subdivide, params.sphere1.tileSize ,sphere);
  
  
  
  // Sphere2 small
  sphere2 = new THREE.Group()
  sphere2.name = "hexagonSphere2"
  sphere2.position.y = 2.5
  sphere2.position.z = -30
  sphere2.position.x = 6.0

  createHexagonSphere3D(params.sphere2.radius, params.sphere2.subdivide, params.sphere2.tileSize , sphere2)
  sphere2.scale.set(0.5,0.5,0.5)
  sphere2.children.forEach( mesh => {
    mesh.name = "hexa2"
  })


  // Sphere3 small
  sphere3 = new THREE.Group()
  sphere3.name = "hexagonSphere3"
  sphere3.position.y = 2.5
  sphere3.position.z = -30
  sphere3.position.x = -6.0

  createHexagonSphere3D(params.sphere2.radius, params.sphere2.subdivide, params.sphere2.tileSize , sphere3)
  sphere3.scale.set(0.5,0.5,0.5)
  sphere3.children.forEach( mesh => {
    mesh.name = "hexa3"
  })


  






  
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
const radiusOrbit = 6;
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
    var time = performance.now() * 0.0003;


    //---
    if(isRotateSphere) {
      sphereRotationMove(time)
    }
 
    // Water Aniamtion
    if(isWaterAnimation) {
      water.material.uniforms[ 'time' ].value += 0.1 / 60.0;
    }

    
    // Effect Camera Raycaster
    if(opacitEffectKey == 1) {
      OpacityRaycasterCameraEffect()
    }


    
    // Animation Colors
    // sphere.children[getRandomInt(0, sphere.children.length)].material.color = new THREE.Color(Math.random() * 0xffffff)
    // sphere.rotation.y += delta * 0.1


    // Animation Orbit Sceond Sphere2
    // angle -= 0.005;
    // const x = center.x + radiusOrbit * Math.cos(angle);
    // const z = center.z + radiusOrbit * Math.sin(angle);
    // sphere2.position.set(x, 0 , z);

    stats.update()
    control.update()
    renderer.render( scene, camera );
  }
}

// Detail 1 have 12 sides
// Detail 2 have 42 sides
// Detail 3 have 92 sides
function createHexagonSphere3D(radius, divisions, tileSize , objectGroup) 
{
    opacitEffectKey = 1
    // Calling Hexaspher class
    var hexasphere = new Hexasphere(radius, divisions, tileSize);
    TextureImageTile(objectGroup)
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
          objectGroup.add(mesh)
          hexasphere.tiles[i].mesh = mesh;
    }
    scene.add(objectGroup)



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




function TextureImageTile(objectGroup) {
  meshMaterials = [];
  let sphereCount = objectGroup.name.slice(-1); 
  if(objectGroup.name.slice(-1) == 'e') { sphereCount =  1 }
  let loopSubdivision = sphereCount == 1 ? 93 : 43

  // Start : 44
  for(let i = 1; i < loopSubdivision ; i++) {
    let texture = textureLoader.load(`./sphere${sphereCount}/new/00${i}.jpg`)
    texture.flipY = false
    texture.center.x = 0.5
    texture.center.y = 0.5

    // Sphere1
    // Rotation slope
    // Hexagon

    // Tomorrow : Arrang Color
    if(sphereCount == 1) {
      if(i == 56 || i == 25 || i == 55 || i == 1  || i == 51 || i == 80 || i == 81 || i == 26 || i == 65 || i == 32 || i == 47 || i == 85 || i == 90 || i == 84 || i == 91 || i == 54 ) { texture.rotation = -0.5 }
      if(i == 64 || i == 7  || i == 77 || i == 24 || i == 69 || i == 31 || i == 35 || i == 30 || i == 20 || i == 87 || i == 67 || i == 76 || i == 11 || i == 53 || i == 83 || i == 63 || i == 5  || i == 8  || i == 89 || i == 82 || i == 52 || i == 68 || i == 23 || i == 22 || i == 16 || i == 15 || i == 17 || i == 61 ) { texture.rotation = 0.5 }
      if(i == 48 ) { texture.rotation = -0.25 }
      if(i == 88 ) { texture.rotation =  0.25 }
      if(i == 79 || i == 78 || i == 10  ) { texture.rotation = -0.75 }
      if(i == 60 || i == 21 ) { texture.rotation = 0.75 }
      if(i == 37) { texture.rotation = -1}
    }

    // Sphere2
    // Rotation slope
    // Hexagon
    if(sphereCount == 2) {
      if(i == 18  ) { texture.rotation = 1 }
      if(i == 43 || i == 8  || i == 20 || i == 11 || i == 5  || i == 33 || i == 17  || i == 34 || i == 42 || i == 38  || i == 23 || i == 32 || i == 29 || i == 40 ) { texture.rotation = 0.5 }
      if(i == 10 || i == 6  || i == 39 || i == 41 || i == 30 || i == 13 ) { texture.rotation = -0.5 }  
      if(i == 16) { texture.rotation = 0.45}  
      if(i == 14) { texture.rotation = -0.75} 
      if(i == 10) { texture.rotation = -0.65}  
      if(i == 12) { texture.rotation = -0.1}  
      if(i == 7)  { texture.rotation = 0.75}  
      if(i == 9)  { texture.rotation = -0.45}  
      if(i == 4)  { texture.rotation = 0.2}  
      // if(i == 8)  { texture.rotation = 0.5}  
    }

    // Sphere3
    // Rotation slope
    // Hexagon
    if(sphereCount == 3 ) {
      if(i == 18  ) { texture.rotation = 1 }
      if(i == 8  || i == 20 || i == 11 || i == 5  || i == 33 || i == 17  || i == 34 || i == 42 || i == 38  || i == 23 || i == 32 || i == 29 || i == 40 ) { texture.rotation = 0.5 }
      if(i == 10 || i == 39 || i == 41 || i == 30 || i == 13 ) { texture.rotation = -0.5 }  
      if(i == 16) { texture.rotation = 0.45}  
      if(i == 14) { texture.rotation = -0.75} 
      if(i == 10) { texture.rotation = -0.65}  
      if(i == 12) { texture.rotation = -0.1}  
      if(i == 7)  { texture.rotation = 0.75}  
      if(i == 9)  { texture.rotation = -0.45}  
      if(i == 4)  { texture.rotation = 0.2}  
      if(i == 21 || i == 6  )  { texture.rotation = -0.25}  
    }

  
    // Pentagon


    texture.matrixAutoUpdate = true
    let m = new THREE.MeshBasicMaterial({
      map:texture,
      transparent: true,
    });
    meshMaterials.push( m );
  }

}



function sphereRotationMove(time) {
  // sphere.rotation.x += 0.0005;
  // sphere.rotation.y += 0.0005;
  // sphere.rotation.z += 0.0005;
  
  // sphere.position.x = -Math.sin(sphere.rotation.x * 10) + 0
  // sphere.position.y = -Math.cos(sphere.rotation.x * 10) + 1.5
  // sphere.position.z =  Math.sin(sphere.rotation.x * 10) + 0


  sphere2.rotation.x += 0.0005;

  sphere2.position.x =  Math.sin(sphere2.rotation.x * 10) + 6.0
  sphere2.position.y =  Math.cos(sphere2.rotation.x * 10) + 1.5
  sphere2.position.z =  Math.sin(sphere2.rotation.x * 10) * 2.5


  sphere3.rotation.x += 0.0005;

  sphere3.position.x = -Math.sin(sphere3.rotation.x * 10) - 6.0
  sphere3.position.y =  Math.cos(sphere3.rotation.x * 10) + 1.5
  sphere3.position.z = -Math.sin(sphere3.rotation.x * 10) * 2.5


}



function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;


    raycaster.setFromCamera( pointer, camera );
    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( scene.children );
    let prevObject =  null
    for ( let i = 0; i < intersects.length; i ++ ) {
      console.log(intersects);
      if(intersects[ i ].object.position.z == 1) 
      {
        gsap.to(intersects[ i ].object.position , { z: 0})
      } else 
      {
        if(intersects[ i ].object.material.opacity == 1 && intersects[ i ].object.name == 'hexa') 
        {

          isRotateSphere = false
          gsap.to(sphere.position  , { z: -30 })
          gsap.to(sphere2.position , { z: -30 })
          gsap.to(sphere3.position , { z: -30 })
          // Water
          gsap.to(water.position   , { z: -30 })
          water.visible = false
          opacitEffectKey = false
    
          // Sphere1
          sphere.children.forEach( mesh => {
            gsap.to(mesh.material  , { opacity: 0})
          })
          // Sphere2
          sphere2.children.forEach( mesh => {
            gsap.to(mesh.material  , { opacity: 0})
          })
          // Sphere3
          sphere3.children.forEach( mesh => {
            gsap.to(mesh.material  , { opacity: 0})
          })

   
          // intersects[ i ].object.material.map.center.x = 0.5
          // intersects[ i ].object.material.map.center.y = 0.5

          intersects[ i ].object.material.map.rotation = 1
          let geometry = new THREE.PlaneGeometry(15, 15, 15, 15)
          let material = new THREE.MeshBasicMaterial({
            transparent: 1,
            opacity: 0, 
            map : intersects[ i ].object.material.map
          })
          let mesh = new THREE.Mesh(geometry,material)
          mesh.position.z = -15
          scene.add(mesh)
          gsap.to(mesh.position, {z: 0 , ease: "Back.in(1.6)"});
          gsap.to(mesh.material, {opacity: 1});

          control.enableRotate = false
          control.reset()
          console.log();

        }

      }


    }


}



window.addEventListener( 'click', onPointerMove );