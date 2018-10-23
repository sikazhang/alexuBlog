
var renderer;
var width;
var height;
var origPoint = new THREE.Vector3(0,0,0)
var raycaster = new THREE.Raycaster() 
var mouse = new THREE.Vector2() 
var intersect 
var startPoint 
var movePoint
var initStatus = []
window.requestAnimFrame = (function() {//如果有变化则可能还需要requestAnimationFrame刷新
    return window.requestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           window.webkitRequestAnimationFrame;
})();

function threeStart() {
    initThree()
    initCamera()
    initScene()
    initLight()
    initObject()
    render()

    renderer.domElement.addEventListener('mousedown',startCube,false)
    renderer.domElement.addEventListener('mousemove',moveCube,false)
    renderer.domElement.addEventListener('mouseup',stopCube,false)

    renderer.domElement.addEventListener('touchstart',startCube,false)
    renderer.domElement.addEventListener('touchmove',moveCube,false)
    renderer.domElement.addEventListener('touchend',stopCube,false)

    //视角控制
    controller = new THREE.OrbitControls(camera, renderer.domElement);
    controller.target = new THREE.Vector3(0, 0, 0);//设置控制点
}

//根据页面的宽高创建渲染器，并添加到容器中
function initThree() {
    width = window.innerWidth
    height = window.innerHeight
    renderer = new THREE.WebGLRenderer({
       antialias:true
    })
    renderer.setSize(width,height)
    renderer.setClearColor(0xFFFFFF,1.0)
    document.getElementById('canvas').appendChild(renderer.domElement)
}

var camera 
var controller
function initCamera() {
    camera = new THREE.PerspectiveCamera(45,width/height,1,1000)
    camera.position.set(200,400,600)
    camera.up.set(0,1,0)
    camera.lookAt(origPoint)
    controller = new THREE.OrbitControls(camera, renderer.domElement);
    controller.target = origPoint;//设置控制点
}

var scene 
function initScene() {
    scene = new THREE.Scene()
}

var light 
function initLight() {
    light = new THREE.AmbientLight(0xfefefe)
    scene.add(light)
}

var cubeParams = {
    x:-75,
    y:75,
    z:75,
    num:3,
    len:50,
    colors:['rgba(255,193,37,1)','rgba(0,191,255,1)',
    'rgba(50,205,50,1)','rgba(178,34,34,1)',
    'rgba(255,255,0,1)','rgba(255,255,255,1)']
}

function SimpleCube(x,y,z,num,len,colors) {
    var cubes = []
    for(var i=0;i<num;i++) {
        for(var j=0;j<num*num;j++) {
            var cubegeo = new THREE.BoxGeometry(len,len,len)
            var materials = []
            var myFaces = []
            //一个小正方体有六个面，每个面使用相同材质的纹理，但是颜色不一样
            myFaces.push(faces(colors[0]));
            myFaces.push(faces(colors[1]));
            myFaces.push(faces(colors[2]));
            myFaces.push(faces(colors[3]));
            myFaces.push(faces(colors[4]));
            myFaces.push(faces(colors[5]));
            for(var k=0;k<6;k++){
                var texture = new THREE.Texture(myFaces[k])
                texture.needsUpdate = true 
                materials.push(new THREE.MeshLambertMaterial({
                    map:texture
                }))
            }

            var cube = new THREE.Mesh(cubegeo,materials)
            cube.position.x = (x+len/2) + (j%num)*len
            cube.position.y = (y-len/2)-parseInt(j/num)*len
            cube.position.z = (z-len/2) - i*len
            cubes.push(cube)
        }
    }
    return cubes
}
var cubes
function initObject() {
    //坐标轴
    var xmat = new THREE.LineBasicMaterial({ color: 0xff0000 });
    var xgeo = new THREE.Geometry();
    xgeo.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(300, 0, 0)
    );
    var xline = new THREE.Line(xgeo, xmat);
    //scene.add(xline);
    var ymat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    var ygeo = new THREE.Geometry();
    ygeo.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 300, 0)
    );
    var yline = new THREE.Line(ygeo, ymat);
    //scene.add(yline);
    var zmat = new THREE.LineBasicMaterial({ color: 0x0000ff });
    var zgeo = new THREE.Geometry();
    zgeo.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 300)
    );
    var zline = new THREE.Line(zgeo, zmat);
    //scene.add(zline);

    cubes = SimpleCube(cubeParams.x,cubeParams.y,cubeParams.z,cubeParams.num,cubeParams.len,cubeParams.colors);
    for(var i=0;i<cubes.length;i++){
        var item = cubes[i];
        scene.add(cubes[i]);//并依次加入到场景中
    }
}
//生成透明正方体
var cubegeo = new THREE.BoxGeometry(150,150,150)
var hex = 0x000000
for(var i=0;i<cubegeo.faces.length;i+=2){
    cubegeo.faces[i].color.setHex(hex)
    cubegeo.faces[i+1].color.setHex(hex)
}
var cubemat = new THREE.MeshBasicMaterial({vertexColors:THREE.FaceColors,opacity:0,transparent:true})
var cube = new THREE.Mesh(cubegeo,cubemat)
cube.cubeType = 'coverCube'
scene.add(cube)



//生成一块黑色边框的大正方形其内部是某种颜色填充的圆角小正方形的canvas画布，用来充当纹理选啊染模仿中小正方体的某个面
function faces(rgbaColor) {
    var canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    var context = canvas.getContext('2d')
    if(context) {
        context.fillStyle = 'rgba(0,0,0,1)'
        context.fillRect(0,0,256,256)
        context.rect(16,16,224,224)
        context.lineJoin = 'round'
        context.lineWidth = 16
        context.fillStyle = rgbaColor
        context.strokeStyle = rgbaColor 
        context.stroke()
        context.fill()
    }

    return canvas
}
function render() {
    renderer.clear()
    renderer.render(scene,camera)
    window.requestAnimationFrame(render)
}



var isRotating = false
var enabled = true 

var xLine = new THREE.Vector3(1,0,0)
var xLineAd = new THREE.Vector3(-1,0,0)
var yLine = new THREE.Vector3(0,1,0)
var yLineAd = new THREE.Vector3(0,-1,0)
var zLine = new THREE.Vector3(0,0,1)
var zLineAd = new THREE.Vector3(0,0,-1)

//根据滑动时的亮点确定转动向量，然后判断转动向量和着六个方向向量夹角最小的方向即为转动方向。
var normalize
function getDirection(vector3){
    var direction 
    var xAngle = vector3.angleTo(xLine)
    var xAngleAd = vector3.angleTo(xLineAd)
    var yAngle = vector3.angleTo(yLine)
    var yAngleAd = vector3.angleTo(yLineAd)
    var zAngle = vector3.angleTo(zLine)
    var zAngleAd = vector3.angleTo(zLineAd)
    var minAngle = min([xAngle,xAngleAd,yAngle,yAngleAd,zAngle,zAngleAd])

    switch(minAngle){
        case xAngle:
            direction = 0;
            if(normalize.equals(yLine)){
                direction = direction+0.1;//绕z轴顺时针
            }else if(normalize.equals(yLineAd)){
                direction = direction+0.2;//绕z轴逆时针
            }else if(normalize.equals(zLine)){
                direction = direction+0.3;//绕y轴逆时针
            }else{
                direction = direction+0.4;//绕y轴顺时针
            }
            break;
        case xAngleAd:
            direction = 1;
            if(normalize.equals(yLine)){
                direction = direction+0.1;//绕z轴顺时针
            }else if(normalize.equals(yLineAd)){
                direction = direction+0.2;//绕z轴逆时针
            }else if(normalize.equals(zLine)){
                direction = direction+0.3;//绕y轴逆时针
            }else{
                direction = direction+0.4;//绕y轴顺时针
            }
            break;
        case yAngle:
            direction = 2;
            if(normalize.equals(zLine)){
                direction = direction+0.1;//绕z轴顺时针
            }else if(normalize.equals(zLineAd)){
                direction = direction+0.2;//绕z轴逆时针
            }else if(normalize.equals(xLine)){
                direction = direction+0.3;//绕y轴逆时针
            }else{
                direction = direction+0.4;//绕y轴顺时针
            }
            break;
        case yAngleAd:
            direction = 3;
            if(normalize.equals(zLine)){
                direction = direction+0.1;//绕z轴顺时针
            }else if(normalize.equals(zLineAd)){
                direction = direction+0.2;//绕z轴逆时针
            }else if(normalize.equals(xLine)){
                direction = direction+0.3;//绕y轴逆时针
            }else{
                direction = direction+0.4;//绕y轴顺时针
            }
            break;
        case zAngle:
            direction = 4;
            if(normalize.equals(yLine)){
                direction = direction+0.1;//绕z轴顺时针
            }else if(normalize.equals(yLineAd)){
                direction = direction+0.2;//绕z轴逆时针
            }else if(normalize.equals(xLine)){
                direction = direction+0.3;//绕y轴逆时针
            }else{
                direction = direction+0.4;//绕y轴顺时针
            }
            break;
        case zAngleAd:
            direction = 5;
            if(normalize.equals(yLine)){
                direction = direction+0.1;//绕z轴顺时针
            }else if(normalize.equals(yLineAd)){
                direction = direction+0.2;//绕z轴逆时针
            }else if(normalize.equals(xLine)){
                direction = direction+0.3;//绕y轴逆时针
            }else{
                direction = direction+0.4;//绕y轴顺时针
            }
            break;
    }
    return direction
}

function rotateAroundWorldY(obj,rad){
    var x0 = obj.position.x 
    var z0 = obj.position.z 

    var q = new THREE.Quaternion()
    q.setFromAxisAngle(new threeStart.Vector3(0,1,0,),rad)

    obj.quaternion.premultiply(q) 
    obj.position.x = Math.cos(rad)*x0+Math.sin(rad)*z0 
    obj.postion.z = Math.cos(rad)*z0+Math.sin(rad)*z0 

}
function rotateAroundWorldZ(obj,rad){
    var x0 = obj.position.x;
    var y0 = obj.position.y;
    var q = new THREE.Quaternion(); 
    q.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), rad );
    obj.quaternion.premultiply( q );
    //obj.rotateZ(rad);
    obj.position.x = Math.cos(rad)*x0-Math.sin(rad)*y0;
    obj.position.y = Math.cos(rad)*y0+Math.sin(rad)*x0;
}
function rotateAroundWorldX(obj,rad){
    var y0 = obj.position.y;
    var z0 = obj.position.z;
    var q = new THREE.Quaternion(); 
    q.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), rad );
    obj.quaternion.premultiply( q );
    //obj.rotateX(rad);
    obj.position.y = Math.cos(rad)*y0-Math.sin(rad)*z0;
    obj.position.z = Math.cos(rad)*z0+Math.sin(rad)*y0;
}
function stopCube(){
    intersect = null 
    startPoint = null
}

function moveCube(event) {
    getIntersects(event)
    if(intersect){

    }
}

//获取操作焦点及该焦点所在平面的法向量
function getIntersects(event) {
    //触摸事件和鼠标事件获得坐标的方式有点区别
    if(event.touches){
        var touch = event.touches[0];
        mouse.x = (touch.clientX / width)*2 - 1;
        mouse.y = -(touch.clientY / height)*2 + 1;
    }else{
        mouse.x = (event.clientX / width)*2 - 1;
        mouse.y = -(event.clientY / height)*2 + 1;
    }
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children)
    if(intersects.length){
        try{
            if(intersects[0].object.cubeType==='coverCube'){
                intersect = intersects[1];
                normalize = intersects[0].face.normal;
            }else{
                intersect = intersects[0];
                normalize = intersects[1].face.normal;
            }
        }catch(err){
            //nothing
        }
    }
}