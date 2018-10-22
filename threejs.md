# camera
定义了三维空间到二维屏幕的投影方式，用照相机类比。
照相机又分为正交投影照相机与透视投影照相机
**透视投影**：近大远小的效果
**正交投影**：对于在三维空间内平行的线，投影到二维空间中也一定是平行的。

**正交投影照像机：**

```
THREE.OrthographicCamera(left, right, top, bottom, near, far)
```
这六个参数分别代表正交投影照相机拍摄到的空间的六个面的位置，这六个面围成一个长方体，我们称其为视景体（Frustum）。只有在视景体内部（下图中的灰色部分）的物体才可能显示在屏幕上，而视景体外的物体会在显示之前被裁减掉。

为了保持照相机的横竖比例，需要保证(right - left)与(top - bottom)的比例与Canvas宽度与高度的比例一致

**透视投影照相机**
THREE.PerspectiveCamera(fov, aspect, near, far)

fov是视景体竖直方向上的张角（角度制）
aspect等于width / height，是照相机水平方向和竖直方向长度的比值，通常设为Canvas的横纵比例。
near和far分别是照相机到视景体最近、最远的距离，均为正值，且far应大于near。

# 几何形状
参数：几何形状（geometry）、材质（material）
几何形状最主要的功能是存储了一个物体的顶点信息。
1.立方体
THREE.CubeGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
2.平面

```
THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
```
3.球体

```
THREE.SphereGeometry(radius, segmentsWidth, segmentsHeight, phiStart, phiLength, thetaStart, thetaLength)
```
4.圆形

```
THREE.CircleGeometry(radius, segments, thetaStart, thetaLength)
```
5.圆柱体

```
THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)
```
6.正四面体
7.正八面体
8.正十二面体

```
THREE.TetrahedronGeometry(radius, detail)
THREE.OctahedronGeometry(radius, detail)
THREE.IcosahedronGeometry(radius, detail)
```
9.圆环面

```
THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc)
```

```
THREE.TorusKnotGeometry(radius, tube, radialSegments, tubularSegments, p, q, heightScale)
```
10.圆环结

```
THREE.TorusKnotGeometry(radius, tube, radialSegments, tubularSegments, p, q, heightScale)
```
11.文字形状

```
THREE.TextGeometry(text, parameters)
```


#材质
1.基本材质
使用基本材质（BasicMaterial）的物体，渲染后物体的颜色始终为该材质的颜色，而不会由于光照产生明暗、阴影效果。如果没有指定材质的颜色，则颜色是随机的。其构造函数是：

```
THREE.MeshBasicMaterial(opt)
```

```
new THREE.MeshBasicMaterial({
    color: 0xffff00,
    opacity: 0.75
});
```
接下来，我们介绍几个较为常用的属性。
**visible**：是否可见，默认为true
**side**：渲染面片正面或是反面，默认为正面THREE.FrontSide，可设置为反面THREE.BackSide，或双面THREE.DoubleSide
**wireframe**：是否渲染线而非面，默认为false
**color**：十六进制RGB颜色，如红色表示为0xff0000
**map**：使用纹理贴图，详见4.5节
对于基本材质，即使改变场景中的光源，使用该材质的物体也始终为颜色处处相同的效果。当然，这不是很具有真实感，因此，接下来我们将介绍更为真实的光照模型：Lambert光照模型以及Phong光照模型。

 2.lambert材质
 是符合lambert光照模型的材质，主要特点是只考虑漫反射而不考虑镜面反射的效果，因此对于金属，镜子等需要镜面反射效果的物体就不适应。
 
```
Idiffuse = Kd * Id * cos(theta)
```

```
new THREE.MeshLambertMaterial({
    color: 0xffff00
})
```
除此之外，还可以用ambient和emissive控制材质的颜色。
ambient表示对环境光的反射能力，只有当设置了AmbientLight后，该值才是有效的，材质对环境光的反射能力与环境光强相乘后得到材质实际表现的颜色。
emissive是材质的自发光颜色，可以用来表现光源的颜色。单独使用红色的自发光：

3.phong材质
考虑了镜面反射的效果，因此对于金属，镜面的表现尤为合适。
这里考虑高光的情况

```
var material = new THREE.MeshPhongMaterial({
    specular: 0xff0000
});
var sphere = new THREE.Mesh(new THREE.SphereGeometry(3, 20, 8), material);
```
可以通过shininess属性控制光照模型中的n值，当shininess值越大时，高光的光斑越小，默认值为30。我们将其设置为1000时：

```
new THREE.MeshPhongMaterial({
    specular: 0xff0000,
    shininess: 1000
});
```
4.法向材质

```
new THREE.MeshNormalMaterial()
```
材质的颜色与照相机与该物体的角度相关，下面我们只改变照相机位置，观察两个角度的颜色变化：

5.材质的纹理贴图
（1）单张图像应用于长方体
   选择图片导入纹理
   
```
var texture = THREE.ImageUtils.loadTexture('../img/0.png');
```
然后，将材质的map属性设置为texture：

```
var material = new THREE.MeshLambertMaterial({
    map: texture
});
```
这样就完成了将图片应用于材质的基本步骤。但是由于现在我们还没使用动画，画面只被渲染了一次，而在导入纹理之前，已经完成了这次渲染，因此看到的只是一片黑。所以，如果没有重绘函数（将在下一章介绍），就需要在完成导入纹理的步骤后，重新绘制画面，这是在回调函数中实现的：

```
var texture = THREE.ImageUtils.loadTexture('../img/0.png', {}, function() {
    renderer.render(scene, camera);
});
var material = new THREE.MeshLambertMaterial({
    map: texture
});
```

#网格

```
var material = new THREE.MeshLambertMaterial({
    color: 0xffff00
});
var geometry = new THREE.CubeGeometry(1, 2, 3);
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

#动画
fps:每秒画面重绘的次数。fps越大，动画效果越平滑，当fps小于20时，一般就能明显感受到画面的卡滞现象。
而对于Three.js动画而言，一般FPS在30到60之间都是可取的。

1.setinterval
2.requestAnimationFrame
```
function stop() {
    if (id !== null) {
        cancelAnimationFrame(id);
        id = null;
    }
}
```

```
function draw() {
    mesh.rotation.y = (mesh.rotation.y + 0.01) % (Math.PI * 2);
    renderer.render(scene, camera);
    id = requestAnimationFrame(draw);
}
```

使用stat.js记录FPS

```
https://github.com/mrdoob/stats.js/blob/master/build/stats.min.js
```


```
var stat = null;

function init() {
    stat = new Stats();
    stat.domElement.style.position = 'absolute';
    stat.domElement.style.right = '0px';
    stat.domElement.style.top = '0px';
    document.body.appendChild(stat.domElement);

    // Three.js init ...
}
```


```
function draw() {
    stat.begin();

    mesh.rotation.y = (mesh.rotation.y + 0.01) % (Math.PI * 2);
    renderer.render(scene, camera);

    stat.end();
}
```

#外部模型

```
https://github.com/mrdoob/three.js/tree/master/examples/js/loaders
```

支持的格式
```
*.obj
*.obj, *.mtl
*.dae
*.ctm
*.ply
*.stl
*.wrl
*.vtk
```

无材质的模型

```
//在init函数中，创建loader变量，用于导入模型：

var loader = new THREE.OBJLoader();

//loader导入模型的时候，接受两个参数，第一个表示模型路径，第二个表示完成导入后的回调函数，一般我们需要在这个回调函数中将导入的模型添加到场景中。

loader.load('../lib/port.obj', function(obj) {
    mesh = obj; //储存到全局变量中
    scene.add(obj);
});
//让茶壶旋转
function draw() {
    renderer.render(scene, camera);

    mesh.rotation.y += 0.01;
    if (mesh.rotation.y > Math.PI * 2) {
        mesh.rotation.y -= Math.PI * 2;
    }
}
```

这是由于默认的情况下，只有正面的面片被绘制，而如果需要双面绘制，需要这样设置：

```
var loader = new THREE.OBJLoader();
loader.load('../lib/port.obj', function(obj) {
    obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material.side = THREE.DoubleSide;
        }
    });

    mesh = obj;
    scene.add(obj);
});
```

#光与影
1.环境光
在设置环境光时，只需要指定光的颜色：
THREE.AmbientLight(hex)
其中，hex是十六进制的rgb信息

```
var light = new THREE.AmbientLight(0xffffff);
scene.add(light);
```


其实，环境光并不在乎物体材质的color属性，而是ambient属性。ambient属性的默认值是0xffffff。因此，如果将这两个长方体设置为：

```
var greenCube = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 2),
        new THREE.MeshLambertMaterial({ambient: 0x00ff00}));
greenCube.position.x = 3;
```

前面我们看到，当环境光不是白色或灰色的时候，渲染的效果往往会很奇怪。因此，环境光通常使用白色或者灰色，作为整体光照的基础。

2.点光源

点光源是不计光源大小，可以看作一个点发出的光源。点光源照到不同物体表面的亮度是线性递减的，因此，离点光源距离越远的物体会显得越暗。

THREE.PointLight(hex, intensity, distance)

其中，hex是光源十六进制的颜色值；intensity是亮度，缺省值为1，表示100%亮度；distance是光源最远照射到的距离，缺省值为0。


```
var light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(0, 1.5, 2);
scene.add(light);
```

3.平行光
对于任意平行的平面，平行光照射的亮度都是相同的，而与平面所在位置无关。
THREE.DirectionalLight(hex, intensity)

其中，hex是光源十六进制的颜色值；intensity是亮度，缺省值为1，表示100%亮度。

此外，对于平行光而言，设置光源位置尤为重要。

```
var light = new THREE.DirectionalLight();
light.position.set(2, 5, 3);
scene.add(light);
```

注意，这里设置光源位置并不意味着所有光从(2, 5, 3)点射出（如果是的话，就成了点光源），而是意味着，平行光将以矢量(-2, -5, -3)的方向照射到所有平面。因此，平面亮度与平面的位置无关，而只与平面的法向量相关。

4.聚光灯
THREE.SpotLight(hex, intensity, distance, angle, exponent)
相比点光源，多了angle和exponent两个参数。angle是聚光灯的张角，缺省值是Math.PI / 3，最大值是Math.PI / 2；exponent是光强在偏离target的衰减指数（target需要在之后定义，缺省值为(0, 0, 0)），缺省值是10。

在调用构造函数之后，除了设置光源本身的位置，一般还需要设置target：
light.position.set(x1, y1, z1);
light.target.position.set(x2, y2, z2);

除了设置light.target.position的方法外，如果想让聚光灯跟着某一物体移动（就像真的聚光灯！），可以target指定为该物体：

5.阴影
在Three.js中，能形成阴影的光源只有THREE.DirectionalLight与THREE.SpotLight；而相对地，能表现阴影效果的材质只有THREE.LambertMaterial与THREE.PhongMaterial。因而在设置光源和材质的时候，一定要注意这一点。

首先，我们需要在初始化时，告诉渲染器渲染阴影：
renderer.shadowMapEnabled = true;
然后，对于光源以及所有要产生阴影的物体调用：
xxx.castShadow = true;
对于接收阴影的物体调用：
xxx.receiveShadow = true;

比如场景中一个平面上有一个正方体，想要让聚光灯照射在正方体上，产生的阴影投射在平面上，那么就需要对聚光灯和正方体调用castShadow = true，对于平面调用receiveShadow = true。

#着色器（shader）
渲染：将模型数据在屏幕上显示出来的过程

顶点着色器

顶点着色器中的“顶点”指的正是Mesh中的顶点，对于每个顶点调用一次。因此，如果场景中有一个正方体，那么对八个顶点将各自调用一次顶点着色器，可以修改顶点的位置或者颜色等信息，然后传入片元着色器。

片元着色器
片元是栅格化之后，在形成像素之前的数据。片元着色器是每个片元会调用一次的程序，因此，片元着色器特别适合用来做图像后处理。

Three.js与着色器
WebGL强制需要程序员定义着色器，即使你只是希望采用默认的渲染方法。这似乎有些不近人情，尤其对于对图形学理解不多的开发者而言。
幸运的是，Three.js允许你不定义着色器（就像前面所有章节的例子）采用默认的方法渲染，而仅在你有需要时，才使用自定义的着色器，这大大减少了程序员的工作量，而且对于初学者而言，无疑是减少入门难度的福音。

最常发生错误的原因就是忘记float类型和int类型不会自动转换的，因此，当你想表达浮点数零的时候，一定要写成0.0而非0。当然，即使我在这里提醒大家了，你仍然会惊讶这一错误发生的频率之高！

顶点着色器

让我们一起来认识一下varing。它是WebGL定义的限定符（Qualifier），限定符用于数据类型（Type）之前，表明该变量的性质。

限定符：
const:常量
attribute：每个顶点对应不同的值
uniform：每个顶点对应相同的值
varying：从顶点着色器传递到片元着色器中

如果不写限定符，默认是只有当前文件中能访问。

所以，varying vec2 vUv;的意思是，声明了一个叫vUv的变量，它的类型为vec2，该变量是为了将顶点着色器中的信息传递到片元着色器中。

单独的着色器文件
使用单独的着色器文件，需要在javascript代码中导入着色器文件。我们假设顶点着色器定义在shader/my.vs文件中，片元着色器定义在shader/my.fs中。

可以使用Ajax完成导入文件的工作，而如果使用jQuery的get函数就可以更方便地实现。



