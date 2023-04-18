function vector(p1, p2){
    return {
        x: p2.x - p1.x,
        y: p2.y - p1.y,
        z: p2.z - p1.z
    }

}

function pointingAwayFromOrigin(p, v){
    return ((p.x * v.x) >= 0) && ((p.y * v.y) >= 0) && ((p.z * v.z) >= 0)
}


// !! NOT WORKS
function calculateSurfaceNormal(p1, p2, p3){

    let U = vector(p1, p2)
    let V = vector(p1, p3)
    
    let N = {
        x: U.y * V.z - U.z * V.y,
        y: U.z * V.x - U.x * V.z,
        z: U.x * V.y - U.y * V.x
    };

    return N;

}

export class Tile {
    constructor(centerPoint, hexSize) {
        if(hexSize == undefined){
            hexSize = 1;
        }
        hexSize = Math.max(.01, Math.min(1.0, hexSize));
        this.centerPoint = centerPoint;

        this.faces = centerPoint.getOrderedFaces();
        this.boundary = [];
        this.neighborIds = []; // this holds the centerpoints, will resolve to references after
        this.neighbors = []; // this is filled in after all the tiles have been created

        var neighborHash = {};
        for(var f=0; f< this.faces.length; f++){
            // build boundary
            this.boundary.push(this.faces[f].getCentroid().segment(this.centerPoint, hexSize));

            // get neighboring tiles
            var otherPoints = this.faces[f].getOtherPoints(this.centerPoint);
            for(var o = 0; o < 2; o++){
                neighborHash[otherPoints[o]] = 1;
            }

        }

        this.neighborIds = Object.keys(neighborHash);

        // Some of the faces are pointing in the wrong direction
        // Fix this.  Should be a better way of handling it
        // than flipping them around afterwards

        var normal = calculateSurfaceNormal(this.boundary[1], this.boundary[2], this.boundary[3]);

        if(!pointingAwayFromOrigin(this.centerPoint, normal)){
            this.boundary.reverse();
        }
    
    }
}


Tile.prototype.toString = function(){
    return this.centerPoint.toString();
};

Tile.prototype.getLatLon = function(radius, boundaryNum){
    var point = this.centerPoint;
    if(typeof boundaryNum == "number" && boundaryNum < this.boundary.length){
        point = this.boundary[boundaryNum];
    }
    var phi = Math.acos(point.y / radius); //lat 
    var theta = (Math.atan2(point.x, point.z) + Math.PI + Math.PI / 2) % (Math.PI * 2) - Math.PI; // lon
    
    // theta is a hack, since I want to rotate by Math.PI/2 to start.  sorryyyyyyyyyyy
    return {
        lat: 180 * phi / Math.PI - 90,
        lon: 180 * theta / Math.PI
    };
};
