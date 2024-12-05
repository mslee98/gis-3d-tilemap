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

    const gui = new dat.GUI({ autoPlace: false });

    const guiContainer = document.querySelector("#guiContainer");
    guiContainer.appendChild(gui.domElement);

    gui.domElement.style.position = "absolute";
    gui.domElement.style.top = "10px";  // 원하는 위치
    gui.domElement.style.left = "10px"; // 원하는 위치
    gui.domElement.style.zIndex = "1000";

    // GUI 속성 추가
    const lightFolder = gui.addFolder("Light Position");
    lightFolder.add(light.position, "x", -500, 500);
    lightFolder.add(light.position, "y", -500, 500);
    lightFolder.add(light.position, "z", -500, 500);
    lightFolder.open();

    
    // 검은 배경에서 선명하게 보이도록 안개 색상 조정
    // scene.fog = new THREE.Fog(0xffffff, 1, 200);
    // scene.fog = FogExp2(0xffffff, 0.92);
    const fogShaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            fogColor: { value: new THREE.Color(0xffffff) },
            fogNear: { value: 1.0 },
            fogFar: { value: 200.0 },
        },
        vertexShader: `
            varying float fogDepth;
            void main() {
                fogDepth = -mvPosition.z;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 fogColor;
            uniform float fogNear;
            uniform float fogFar;
            varying float fogDepth;
            void main() {
                float fogFactor = smoothstep(fogNear, fogFar, fogDepth);
                vec3 color = mix(vec3(1.0, 1.0, 1.0), fogColor, fogFactor);
                gl_FragColor = vec4(color, 1.0);
            }
        `
    });

    group = new THREE.Group();

    var xy = map.mercator.latLonToMeters( -lat, lng, map.zoom);
    camera.position.x = 14135254.256059827;
    camera.position.y = 7679.137457212418;
    camera.position.z = -4513809.019715486;
    controls.target.x = xy[0];
    controls.target.z = xy[1];
    // camera.lookAt( controls.target );



    // var test_geo = new THREE.BoxGeometry(100,100,100,1,1,1);
    // var test_mar = new THREE.MeshPhongMaterial({color : 0x515151});
    // var test_mesh = new THREE.Mesh(test_geo, test_mar);
    // test_mesh.position.set(14135172.466141123,0,-4518391.85948968)
    // group.add(test_mesh);
    // scene.add( group );


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

    // light.position.copy( camera.position );
    // light.position.y += 1000;

    // renderer.setClearColor(0x6C7A8C, 1);
    renderer.render( scene, camera );

}