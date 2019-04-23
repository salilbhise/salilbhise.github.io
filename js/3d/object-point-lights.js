(function() {
    "use strict";

    var camera, scene, renderer, composer, controls;

    var light1, light2, light3, light4;

    var loader, mesh;

    var mouseX = 0, mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    init();
    animate();

    function init() {
        var hero = document.getElementById("hero");
        var container = document.createElement("div");
        container.className = "hero__three-container";
        hero.appendChild( container );

        // camera
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1500 );
        camera.position.z = 400;

        // scene
        scene = new THREE.Scene();

        // lights


        scene.add( new THREE.AmbientLight( 0x00000B ) );
        light1 = new THREE.PointLight( 0x007CFF, 1, 150 );
        scene.add( light1 );
        light2 = new THREE.PointLight( 0xFF0061, 1, 150 );
        scene.add( light2 );
        light3 = new THREE.PointLight( 0xA9AEFF, 1, 150 );
        scene.add( light3 );
        light4 = new THREE.PointLight( 0x1E222B, 1, 150  );
        light4.position.set(100, 0, 10);
        scene.add( light4 );

        // objects
        loader = new THREE.JSONLoader();
        loader.load( '3d/deer.js', function ( geometry ) {
            mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: 0xffffff, overdraw: 0.5 } ) );
            mesh.position.y = 10;
            mesh.scale.set(2.9,2.9,2.9);
            scene.add( mesh );
        } );

        //
        renderer = new THREE.CanvasRenderer({ alpha: true });
        renderer.setClearColor( 0x000000, 0 );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );

        //
        document.addEventListener( "mousemove", onDocumentMouseMove, false );
        window.addEventListener( "resize", onWindowResize, false );
    }
    function onDocumentMouseMove( event ) {
        mouseX = ( event.clientX - windowHalfX ) / 4;
        mouseY = ( event.clientY - windowHalfY ) / 4;
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
    //
    function animate() {
        camera.position.x += ( -mouseX - camera.position.x ) * .03;
        camera.position.y += ( mouseY - 80 - camera.position.y ) * .03;

        requestAnimationFrame( animate );
        render();
    }
    function render() {
        var time = Date.now() * 0.0005;
        light1.position.x = Math.sin( time * 0.7 ) * 30;
        light1.position.y = Math.cos( time * 0.5 ) * 40;
        light1.position.z = Math.cos( time * 0.3 ) * 30;
        light2.position.x = Math.cos( time * 0.3 ) * 30;
        light2.position.y = Math.sin( time * 0.5 ) * 40;
        light2.position.z = Math.sin( time * 0.7 ) * 30;
        light3.position.x = Math.sin( time * 0.7 ) * 30;
        light3.position.y = Math.cos( time * 0.3 ) * 40;
        light3.position.z = Math.sin( time * 0.5 ) * 30;
        camera.lookAt( scene.position );
        renderer.render( scene, camera );
    }
})();
