var renderer;
var width;
var height;
var elements = []
var controller
var clock =new THREE.Clock()

//根据页面的宽高创建渲染器，并添加到容器中
function initThree() {
    width = window.innerWidth
    height = window.innerHeight
    renderer = new THREE.WebGLRenderer({
       antialias:true
    })
    renderer.setSize(width,height)
    renderer.setClearColor(0x000000,1.0)
    renderer.shadowMap.enabled = true 
    renderer.shadowMapSoft = true 
    document.getElementById('main').appendChild(renderer.domElement)
}


var scene 
function initScene() {
    scene = new THREE.Scene()
}
var camera 
function initCamera() {
    camera = new THREE.PerspectiveCamera(45,width/height,1,1000)
    camera.position.set(-200,50,0)
    // camera.up.set(0,1,0)
    camera.lookAt(new THREE.Vector3(0,0,0))
    // controller = new THREE.OrbitControls(camera, renderer.domElement);
    // controller.target = origPoint;//设置控制点
}
var light 
function initLight() {
    //环境光
    let ambient = new THREE.AmbientLight(0x999999);
    scene.add(ambient);

    /*太阳光*/
    let sunLight = new THREE.PointLight(0xddddaa,1.5,500);
    sunLight.position.set(0, 0, 0)
    scene.add(sunLight);
}
function initObject() {
    //坐标轴
    var xmat = new THREE.LineBasicMaterial({ color: 0xff0000 });
    var xgeo = new THREE.Geometry();
    xgeo.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(300, 0, 0)
    );
    var xline = new THREE.Line(xgeo, xmat);
    scene.add(xline);
    var ymat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    var ygeo = new THREE.Geometry();
    ygeo.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 300, 0)
    );
    var yline = new THREE.Line(ygeo, ymat);
    scene.add(yline);
    var zmat = new THREE.LineBasicMaterial({ color: 0x0000ff });
    var zgeo = new THREE.Geometry();
    zgeo.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 300)
    );
    var zline = new THREE.Line(zgeo, zmat);
    scene.add(zline);

    /*sun skin pic*/
    let sunSkinPic = THREE.TextureLoader('./sunCore.jpg', {}, function() {
        renderer.render(scene, camera);
    });
    /*sun*/
    Sun = new THREE.Mesh( new THREE.SphereGeometry( 12 ,16 ,16 ),
        new THREE.MeshLambertMaterial({
        emissive: 0xdd4422,
        map: sunSkinPic
        })
    );

    scene.add(Sun)

    const Earth = new THREE.Mesh(new THREE.SphereGeometry(5,16,16),
            new THREE.MeshLambertMaterial({
                color:'rgb(46,69,119)',
                // emissive:'rgb(46,69,119)'
            })
        )
    Earth.position.z=-40
    scene.add(Earth)
    elements.push(Earth)
    initPlanet(40)
    const Mercury = new THREE.Mesh(new THREE.SphereGeometry(20,16,16),
            new THREE.MeshLambertMaterial({
                color:'rgb(124,131,203)',
                // emissive:'rgb(124,131,203)'
            })
        )
        Mercury.position.z=-180
    scene.add(Mercury)
    elements.push(Mercury)
    initPlanet(180)
    const Venus = new THREE.Mesh(new THREE.SphereGeometry(2,16,16),
            new THREE.MeshLambertMaterial({
                color:'rgb(190,138,44)',
                // emissive:'rgb(190,138,44)'
            })
        )
        Venus.position.z=-20
    scene.add(Venus)
    elements.push(Venus)
    initPlanet(20)
    const Mars = new THREE.Mesh(new THREE.SphereGeometry(4,16,16),
            new THREE.MeshLambertMaterial({
                color:'rgb(210,81,16)',
                // emissive:'rgb(210,81,16)'
            })
        )
        Mars.position.z=-130
    scene.add(Mars)
    elements.push(Mars)
    initPlanet(130)
    const Jupiter = new THREE.Mesh(new THREE.SphereGeometry(5,16,16),
            new THREE.MeshLambertMaterial({
                color:'rgb(234,208,101)',
                // emissive:'rgb(234,208,101)'
            })
        )
        Jupiter.position.z=-60
    scene.add(Jupiter)
    elements.push(Jupiter)
    initPlanet(Jupiter)
    const Saturn = new THREE.Mesh(new THREE.SphereGeometry(4,16,16),
            new THREE.MeshLambertMaterial({
                color:'rgb(210,140,39)',
                // emissive:'rgb(210,140,39)'
            })
        )
        Saturn.position.z=-70
    scene.add(Saturn)
    elements.push(Saturn)
    initPlanet(70)
    const Uranus = new THREE.Mesh(new THREE.SphereGeometry(9,16,16),
            new THREE.MeshLambertMaterial({
                color:'rgb(49,168,218)',
                // emissive:'rgb(49,168,218)'
            })
        )
        Uranus.position.z=-120
    scene.add(Uranus)
    elements.push(Uranus)
    initPlanet(120)

    
    

}
function initPlanet(distance) {
    /*轨道*/
    let track = new THREE.Mesh( new THREE.RingGeometry (distance-0.2, distance+0.2, 64,1),
      new THREE.MeshBasicMaterial( { color: 0x888888, side: THREE.DoubleSide } )
    );
    track.rotation.x = - Math.PI / 2;
    scene.add(track);
  }
function threeStart() {
    initThree()
    initCamera()
    initScene()
    initLight()
    initObject()
    makeStars()
    render()
    //controller = new THREE.FirstPersonControls(camera,renderer.domElement)

    // //视角控制
    controller = new THREE.OrbitControls(camera, renderer.domElement);
    controller.target = new THREE.Vector3(0, 1, 0);//设置控制点

    stat = new Stats()
    stat.domElement.style.position = 'absolute';
    stat.domElement.style.right = '0px';
    stat.domElement.style.top = '0px';
    document.body.appendChild(stat.domElement);

    window.requestAnimationFrame(()=>{moveEachStar()})
}

function render() {
    renderer.clear()
    renderer.render(scene,camera)
    window.requestAnimationFrame(render)
}

function moveEachStar(){
    var arr = [0.3,0.1,0.2,0.4,0.3,0.6,0.3,0.2,0.3,0.1]
    for(var i=0;i<elements.length;i++){
        rotateAroundWorldY(elements[i],arr[i]*Math.PI/180);
    }
    window.requestAnimationFrame(moveEachStar)
    /*限制相机在xyz正负400以内*/
    camera.position.x = THREE.Math.clamp( camera.position.x, -400, 400 );
    camera.position.y = THREE.Math.clamp( camera.position.y, -400, 400 );
    camera.position.z = THREE.Math.clamp( camera.position.z, -400, 400 );
    
}

function rotateAroundWorldY(obj,rad){
    var x0 = obj.position.x 
    var z0 = obj.position.z 

    var q = new THREE.Quaternion()
    q.setFromAxisAngle(new THREE.Vector3(0,1,0),rad)

    obj.quaternion.premultiply(q) 
    obj.position.x = Math.cos(rad)*x0+Math.sin(rad)*z0 
    obj.position.z = Math.cos(rad)*z0-Math.sin(rad)*x0 
}

function makeStars() {
    const particles = 20000
    const bufferGeometry = new THREE.BufferGeometry()

    let positions = new Float32Array(particles*3)
    let colors = new Float32Array(particles*3)

    let color = new THREE.Color() 
    const gap =600
    for(let i=0;i<positions.length;i+=3){
        /*-2gap < x < 2gap */
        let x = ( Math.random() * gap *2 )* (Math.random()<.5? -1 : 1);
        let y = ( Math.random() * gap *2 )* (Math.random()<.5? -1 : 1);
        let z = ( Math.random() * gap *2 )* (Math.random()<.5? -1 : 1);

        /*找出x,y,z中绝对值最大的一个数*/
        let biggest = Math.abs(x) > Math.abs(y) ? Math.abs(x) > Math.abs(z) ?　'x' : 'z' :
            Math.abs(y) > Math.abs(z) ? 'y' : 'z';

        let pos = { x, y, z};

        /*如果最大值比n要小（因为要在一个距离之外才出现星星）则赋值为n（-n）*/
        if(Math.abs(pos[biggest]) < gap) pos[biggest] = pos[biggest] < 0 ? -gap : gap;

        x = pos['x'];
        y = pos['y'];
        z = pos['z'];

        positions[ i ]     = x;
        positions[ i + 1 ] = y;
        positions[ i + 2 ] = z;

        let hasColor = Math.random() > 0.3;
        let vx, vy, vz;

        if(hasColor){
            vx = (Math.random()+1) / 2 ;
            vy = (Math.random()+1) / 2 ;
            vz = (Math.random()+1) / 2 ;
        }else{
            vx = 1 ;
            vy = 1 ;
            vz = 1 ;
        }

        color.setRGB( vx, vy, vz );

        colors[ i ]     = color.r;
        colors[ i + 1 ] = color.g;
        colors[ i + 2 ] = color.b;
        
    }
    bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    bufferGeometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    bufferGeometry.computeBoundingSphere();

    /*星星的material*/
    let material = new THREE.PointsMaterial( { size: 4, vertexColors: THREE.VertexColors } );
    let particleSystem = new THREE.Points( bufferGeometry, material );
    scene.add( particleSystem );
    

}