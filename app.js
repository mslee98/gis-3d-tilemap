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
    camera = new THREE.PerspectiveCamera( 75, w / h,1, 40000 );

    // renderer = new THREE.WebGLRenderer();
    renderer = new THREE.WebGLRenderer({
        logarithmicDepthBuffer:true,
        powerPreference: "high-performance"
    });
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, .8);

    renderer.setPixelRatio(window.devicePixelRatio);

    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls( camera );
    controls.maxPolarAngle = (Math.PI);

    // scene.add( new THREE.AmbientLight(0x101010) );
    // AmbientLight 추가 (희미한 환경광)
    scene.add(new THREE.AmbientLight(0x222222)); // 어두운 회색빛
    light = new THREE.PointLight( 0x000000, 1, 0 );
    scene.add( light );
    
    // 검은 배경에서 선명하게 보이도록 안개 색상 조정
    scene.fog = new THREE.Fog(0xffffff, 1, 200);

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