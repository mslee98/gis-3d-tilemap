//https://github.com/mapbox/earcut
var w = window.innerWidth;
var h = window.innerHeight;
var scene, camera, renderer, mesh, group;

var meshScale = 2;
var size = 512;

var mat, depth, light;
var tex_map;

//var lat = 37.5666805;
//var lng = 126.9784147;

//SAN FRANCISCO
var lat = 37.773972;
var lng = -122.431297;

//seoul
var lat = 37.5666805;
var lng = 126.9784147;

var zl  = 16;
var start = 0;

var controls;

window.onload = function(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, w / h, 1, 40000 );

    // renderer = new THREE.WebGLRenderer();
    renderer = new THREE.WebGLRenderer({
        logarithmicDepthBuffer:true,
        powerPreference: "high-performance"
    });
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, .8);

    renderer.setPixelRatio(window.devicePixelRatio);

    const threeCanvas = document.querySelector(".threeCanvas");
    threeCanvas.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls( camera );
    controls.maxPolarAngle = (Math.PI);

    light = new THREE.DirectionalLight(0xffffff, 10);
    // light.position.set(100, 1000, 1000);
    scene.add(light);

    // 안개색이 건물에 영향을 미치니 Material Basic으로 해도 상관 없어보임
    // 검은 배경에서 선명하게 보이도록 안개 색상 조정
    scene.fog = new THREE.Fog(0xffffff, 1, 200);
    // const fogShaderMaterial = new THREE.ShaderMaterial({
    //     uniforms: {
    //         fogColor: { value: new THREE.Color(0xffffff) },
    //         fogNear: { value: 1.0 },
    //         fogFar: { value: 200.0 },
    //     },
    //     vertexShader: `
    //         varying float fogDepth;
    //         void main() {
    //             fogDepth = -mvPosition.z;
    //             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    //         }
    //     `,
    //     fragmentShader: `
    //         uniform vec3 fogColor;
    //         uniform float fogNear;
    //         uniform float fogFar;
    //         varying float fogDepth;
    //         void main() {
    //             float fogFactor = smoothstep(fogNear, fogFar, fogDepth);
    //             vec3 color = mix(vec3(1.0, 1.0, 1.0), fogColor, fogFactor);
    //             gl_FragColor = vec4(color, 1.0);
    //         }
    //     `
    // });

    group = new THREE.Group();

    // 마르세유 지도 제작자 소스코드를 참고함
    // 메트카토르 투영법으로 위도경도를 미터로 변환하여 나타냄
    var xy = map.mercator.latLonToMeters( -lat, lng, map.zoom);


    camera.position.x = 14135254.256059827;
    camera.position.y = 7679.137457212418;
    camera.position.z = -4513809.019715486;
    controls.target.x = xy[0];
    controls.target.z = xy[1];
    // camera.lookAt( controls.target );

    scene.add( group );

    const loader = new THREE.OBJLoader();

    loader.load('/Sting-Sword-lowpoly.obj', function(object) {
        console.log("gltf", object)
        object.position.x = 14135172.466141123;
        object.position.y = 400
        object.position.z = -4518391.85948968;
        object.scale.x = 6;
        object.scale.y = 6;
        object.scale.z = 6;
        object.rotation.x = -Math.PI/2;
        object.traverse(function(child) {
            child.material = new THREE.MeshPhongMaterial({color : 0x515151});
        });
        


        group.add(object);
    });

    scene.add(group);

    camera.lookAt(group.position);
    
    builder.init(scene);

    map.init(size, true);
    map.setView( -lat, lng, zl );

    start = Date.now();
    //materials.dark();
    update();
    renderer.render(scene, camera);
};

window.onresize = function()
{
    w = window.innerWidth;
    h = window.innerHeight;
    renderer.setSize( w,h );
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
};

function update(){
    requestAnimationFrame(update);

    var ll = map.mercator.metersToLatLon( controls.target.x, -controls.target.z, map.zoom);
    map.setView(ll[0], ll[1]);

    renderer.render( scene, camera );

}