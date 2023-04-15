import '/style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { Pane } from 'tweakpane'
import gsap from 'gsap'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Hexasphere } from './hexagon-reverse/hexagon';


let renderer , scene , camera , control;
let geometry , material , mesh, mesh2;




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

  // materials = [];
  // for(let i = 1; i < 28; i++){
  //   let m = new THREE.MeshBasicMaterial({
  //     // color: Math.random() * 0x7f7f7f + 0x7f7f7f,
  //     map: textureLoader.load(`00${i}.jpg`)
  //   });
  //   materials.push( m );
  // }

  // mesh = new THREE.Mesh(createIcosahedron(4,1), materials);
  // scene.add(mesh);
  // mesh.position.z = -5

  // gsap.to(mesh.position, {z : 0, duration: 0.5, ease: "Back.inOut(1.5)"})


  // mesh2 = mesh = new THREE.Mesh(createIcosahedron(1,1), materials); 
  // mesh2.position.x = 6
  // scene.add(mesh2);


  

  var img = document.getElementById("projection");
  var projectionCanvas = document.createElement('canvas');
  var projectionContext = projectionCanvas.getContext('2d');

  projectionCanvas.width = img.width;
  projectionCanvas.height = img.height;
  projectionContext.drawImage(img, 0, 0, img.width, img.height);
  

  var pixelData = null;

  var maxLat = -100;
  var maxLon = 0;
  var minLat = 0;
  var minLon = 0;


  var isLand = function(lat, lon)
  {

      var x = parseInt(img.width * (lon + 180) / 360);
      var y = parseInt(img.height * (lat+90) / 180);

      if(pixelData == null){
          pixelData = projectionContext.getImageData(0,0,img.width, img.height);
      }
      return pixelData.data[(y * pixelData.width + x) * 4] === 0;
  };

  var meshMaterials = [];
  meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x7cfc00, transparent: true}));
  meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x397d02, transparent: true}));
  meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x77ee00, transparent: true}));
  meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x61b329, transparent: true}));
  meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x83f52c, transparent: true}));
  meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x83f52c, transparent: true}));
  meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x4cbb17, transparent: true}));
  meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x00ee00, transparent: true}));
  meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x00aa11, transparent: true}));

  var oceanMaterial = []
  oceanMaterial.push(new THREE.MeshBasicMaterial({color: 0x0f2342, transparent: true}));
  oceanMaterial.push(new THREE.MeshBasicMaterial({color: 0x0f1e38, transparent: true}));



  var introTick = 0;
  var seenTiles = {};
  var currentTiles = [];


  var createScene = function(radius, divisions, tileSize){
      introTick = -1;
      while(scene.children.length > 0){ 
          scene.remove(scene.children[0]); 
      }
      var hexasphere = new Hexasphere(radius, divisions, tileSize);
      console.log(hexasphere);

      // var testGeometry = new THREE.BufferGeometry()
      // console.log(testGeometry);

      for(var i = 0; i< hexasphere.tiles.length; i++)
        {
            var t = hexasphere.tiles[i];
            var latLon = t.getLatLon(hexasphere.radius);

            // Creatd With BefferGeometry Instead of Geometry 
            // Because deprecated
            var geometry = new THREE.BufferGeometry();

            // It's depend of each vertex if have 5 vertex will adding with 5 stucture
            // And it's have 6 vertex will adding with 6 structure
            let vertexArray;                  
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
            }
            
            if(t.boundary.length == 6){
                // Create 6 verteices
                vertexArray = [
                  new THREE.Vector3(0, 0, 0),
                  new THREE.Vector3(1, 0, 0),
                  new THREE.Vector3(0, 1, 0),
                  new THREE.Vector3(0, 0, 1),
                  new THREE.Vector3(1, 1, 1),
                  new THREE.Vector3(1, 1, 1),
                ]; 
            }

            const vertices = new Float32Array(vertexArray.length * 3); // 6 vertices * 3 values per vertex
            // take vertex from hexasphere put into buffergeometry
            for(var j = 0; j< t.boundary.length; j++){
           
              var bp = t.boundary[j];
              vertices[j * 3] = bp.x;
              vertices[j * 3 + 1] = bp.y;
              vertices[j * 3 + 2] = bp.z;
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            console.log(geometry);


            // Create Faces
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
            

            if(isLand(latLon.lat, latLon.lon)){
                material = meshMaterials[Math.floor(Math.random() * meshMaterials.length)]
            } else {
                material = oceanMaterial[Math.floor(Math.random() * oceanMaterial.length)]
            }

            material.opacity = 0.3;

            var mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            hexasphere.tiles[i].mesh = mesh;

        }


  };
  
  createScene(5, 3, .95);


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
