import * as THREE from 'three'
import { scene } from './main';
class Point {
    constructor(x, y, z) {
        if(x !== undefined && y !== undefined && z !== undefined){
            this.x = x.toFixed(3);
            this.y = y.toFixed(3);
            this.z = z.toFixed(3);
        }

        this.faces = [];
    }
}

Point.prototype.toString = function(){
    return '' + this.x + ',' + this.y + ',' + this.z;
}

var tao = 1.61803399;
var corners = [
    new Point(1000, tao * 1000, 0),
    new Point(-1000, tao * 1000, 0),
    new Point(1000,-tao * 1000,0),
    new Point(-1000,-tao * 1000,0),
    new Point(0,1000,tao * 1000),
    new Point(0,-1000,tao * 1000),
    new Point(0,1000,-tao * 1000),
    new Point(0,-1000,-tao * 1000),
    new Point(tao * 1000,0,1000),
    new Point(-tao * 1000,0,1000),
    new Point(tao * 1000,0,-1000),
    new Point(-tao * 1000,0,-1000)
];
let points = {};
for(var i = 0; i< corners.length; i++){
    points[corners[i]] = corners[i];
}



let _faceCount = 0;
class Face
{
    constructor(point1, point2, point3, register) 
    {
        this.id = _faceCount++;
        if(register == undefined){
            register = true;
        }
    
        this.points = [
            point1,
            point2,
            point3
        ];
        if(register){
            point1.registerFace(this);
            point2.registerFace(this);
            point3.registerFace(this);
        }
    }
}


console.log(corners[0]);
var faces = [
    new Face(corners[0], corners[1], corners[4], false),
]

console.log(faces);






const geometry = new THREE.BufferGeometry()

const vertices = new Float32Array( [
	 1.0,  tao * 1.0 ,  0.0,
	-1.0,  tao * 1.0 ,  0.0,
	 1.0, -tao * 1.0 ,  0.0,
    -1.0, -tao * 1.0 ,  0.0,
     0.0,  1.0,  tao  * 1.0 ,
     0.0, -1.0,  tao  * 1.0,
     0.0,  1.0, -tao  * 1.0,
     0.0, -1.0, -tao  * 1.0,
     tao * 1.0,  0.0,   1.0,
    -tao * 1.0,  0.0,   1.0,
     tao * 1.0,  0.0,  -1.0,
    -tao * 1.0,  0.0,  -1.0
] );

geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
const material = new THREE.PointsMaterial( 
{ 
    color: 0xff0000,
    size: 0.25 
});
const mesh = new THREE.Points( geometry, material );

// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh( geometry, material );
const axis = new THREE.AxesHelper(5)
scene.add(axis)
scene.add(mesh)