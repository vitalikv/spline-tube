<!DOCTYPE html>
<html lang="en">
	<head>
		<title>three.js webgl - geometry - spline extrusion</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
		<style>
			body {
				font-family: Monospace;
				background-color: #f0f0f0;
				margin: 0px;
				overflow: hidden;
			}

			#info {
				position: absolute;
				top: 0px;
				width: 100%;
				padding: 5px;
				font-family:Monospace;
				font-size:13px;
				text-align:center;
			}
		</style>
	</head>
	<body>

		<div id="container"></div>

		<script src="js/three.min.js"></script>
		<script src="js/OrbitControls.js"></script>
		<script src="offsetContour.js"></script>
		

		

		<script src="js/stats.min.js"></script>
		<script src="js/dat.gui.min.js"></script>

		<script>

		var container, stats;

		var camera, scene, renderer, splineCamera, cameraHelper, cameraEye;
		
		// scene
		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0xffffff );		

		var binormal = new THREE.Vector3();
		var normal = new THREE.Vector3();

		var points = [
			new THREE.Vector3( 5+0, 0, 0 ), 
			new THREE.Vector3( 5+2, 0, 0 ),
			new THREE.Vector3( 5+2, 0, 3 ), 
			new THREE.Vector3( 5+4, 0, 3 ),
			new THREE.Vector3( 5+7, 0, 3 ), 
			new THREE.Vector3( 5+9, 0, 0 ),
			new THREE.Vector3( 5+12, 2, 3 ), 
			new THREE.Vector3( 5+14, 0, 3 ),
		];

		var pipeSpline = new THREE.CatmullRomCurve3(points);
pipeSpline.curveType = 'catmullrom';
pipeSpline.tension = 0;
console.log(pipeSpline);

		var parent, tubeGeometry, mesh;

		var params = {
			spline: 'GrannyKnot',
			scale: 4,
			extrusionSegments: 100,
			radiusSegments: 3,
			closed: false,
			animationView: false,
			lookAhead: false,
			cameraHelper: false,
		};

		var material = new THREE.MeshLambertMaterial( { color: 0xff00ff } );

		var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.3, wireframe: true, transparent: true } );

		function addTube() {

			if ( mesh !== undefined ) {

				parent.remove( mesh );
				mesh.geometry.dispose();

			}

			var extrudePath = pipeSpline;

			tubeGeometry = new THREE.TubeBufferGeometry( extrudePath, params.extrusionSegments, 0.3, params.radiusSegments, params.closed );

			addGeometry( tubeGeometry );
		}


		function addGeometry( geometry ) {

			// 3D shape

			mesh = new THREE.Mesh( geometry, material );
			var wireframe = new THREE.Mesh( geometry, wireframeMaterial );
			mesh.add( wireframe );

			parent.add( mesh );

		}

		function animateCamera() {

			cameraHelper.visible = params.cameraHelper;
			cameraEye.visible = params.cameraHelper;

		}
		
		wallBezierCurve();
		
		function wallBezierCurve()
		{
			
			var curve = new THREE.QuadraticBezierCurve3(
				new THREE.Vector3( -10, 0, -7 ),
				new THREE.Vector3( -5, 0, 1 ),
				new THREE.Vector3( 0, 0, -7 ),
			);

			var points = curve.getPoints(  ); 
			var geometry = new THREE.BufferGeometry().setFromPoints( points );

			var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

			// Create the final object to add to the scene
			var curveObject = new THREE.Line( geometry, material );			
			
			scene.add( curveObject );
			
		var pipeSpline2 = new THREE.CatmullRomCurve3(points);

pipeSpline.curveType = 'catmullrom';
pipeSpline.tension = 0;			

			

			var tubeGeometry = new THREE.TubeBufferGeometry( pipeSpline2, params.extrusionSegments, 0.3, params.radiusSegments, params.closed );

			var mesh1 = new THREE.Mesh( tubeGeometry, material );	scene.add( mesh1 );					
		}
		
		
		createContour();
		
		//createSpline();
		
		function createSpline()
		{
			
			var curve = new THREE.SplineCurve( [
				new THREE.Vector2( -10, 0 ),
				new THREE.Vector2( -5, 5 ),
				new THREE.Vector2( 0, 0 ),
				new THREE.Vector2( 5, -5 ),
				new THREE.Vector2( 10, 0 )
			] );

			var points = curve.getPoints(  ); 
			
			var points = [
				new THREE.Vector3( -10, 0, 0 ),
				new THREE.Vector3( -5, 0, 5 ),
				new THREE.Vector3( 5, 0, -5 ),
				new THREE.Vector3( 10, 0, 0 )
			];			
			
			var geometry = new THREE.BufferGeometry().setFromPoints( points );  

			var material = new THREE.LineBasicMaterial( { color : 0x000000 } );

			// Create the final object to add to the scene
			var splineObject = new THREE.Line( geometry, material );			
			
			scene.add( splineObject );
			
			
			var circle = createSpline_2();
			var shape = new THREE.Shape( circle );
			var mat = new THREE.MeshLambertMaterial( { color : 0xff00ff, side : THREE.DoubleSide } );
			
			for ( var i = 0; i < points.length - 1; i++ )
			{
				var dist = points[i].distanceTo( points[i+1] );
				
				var tube = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: dist } ), mat );	

				tube.position.copy( points[i] );
				
				scene.add( tube );
			}
	
		}
		

		
		
		function createSpline_2()
		{
			
			var points = createCircleSpline();	


			function createCircleSpline()
			{
				var count = 48;
				var circle = [];
				var g = (Math.PI * 2) / count;
				
				for ( var i = 0; i < count; i++ )
				{
					var angle = g * i;
					circle[i] = new THREE.Vector3();
					circle[i].x = Math.sin(angle);
					circle[i].y = Math.cos(angle);
					//circle[i].y = 0;
				}

				return circle;
			}			
			
			var geometry = new THREE.BufferGeometry().setFromPoints( points );  

			var material = new THREE.LineBasicMaterial( { color : 0x000000 } );

			// Create the final object to add to the scene
			var splineObject = new THREE.Line( geometry, material );			
			
			scene.add( splineObject );
			
			return points;
		}
		

		init();
		animate();

		function init() {

			container = document.getElementById( 'container' );

			// camera

			camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.01, 10000 );
			camera.position.set( 20, 10, 20 );



			// light

			var light = new THREE.DirectionalLight( 0xffffff );
			light.position.set( 0, 10, 10 );
			scene.add( light );
			
			var light_1 = new THREE.AmbientLight( 0xffffff, 0.6 );
			scene.add( light_1 ); 			

			// tube

			parent = new THREE.Object3D();
			scene.add( parent );

			splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
			parent.add( splineCamera );

			cameraHelper = new THREE.CameraHelper( splineCamera );
			scene.add( cameraHelper );

			addTube();

			// debug camera

			cameraEye = new THREE.Mesh( new THREE.SphereBufferGeometry( 5 ), new THREE.MeshBasicMaterial( { color: 0xdddddd } ) );
			parent.add( cameraEye );

			cameraHelper.visible = params.cameraHelper;
			cameraEye.visible = params.cameraHelper;

			// renderer

			renderer = new THREE.WebGLRenderer( { antialias: false } );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			container.appendChild( renderer.domElement );

			// stats

			stats = new Stats();
			container.appendChild( stats.dom );

			// dat.GUI

			var gui = new dat.GUI( { width: 300 } );

			var folderGeometry = gui.addFolder( 'Geometry' );

			folderGeometry.add( params, 'scale', 2, 10 ).step( 2 ).onChange( function () {

				setScale();

			} );
			folderGeometry.add( params, 'extrusionSegments', 50, 500 ).step( 50 ).onChange( function () {

				addTube();

			} );
			folderGeometry.add( params, 'radiusSegments', 2, 12 ).step( 1 ).onChange( function () {

				addTube();

			} );
			folderGeometry.add( params, 'closed' ).onChange( function () {

				addTube();

			} );
			folderGeometry.open();

			var folderCamera = gui.addFolder( 'Camera' );
			folderCamera.add( params, 'animationView' ).onChange( function () {

				animateCamera();

			} );
			folderCamera.add( params, 'lookAhead' ).onChange( function () {

				animateCamera();

			} );
			folderCamera.add( params, 'cameraHelper' ).onChange( function () {

				animateCamera();

			} );
			folderCamera.open();

			var controls = new THREE.OrbitControls( camera, renderer.domElement );

			window.addEventListener( 'resize', onWindowResize, false );

		}

		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );

		}

		//

		function animate() {

			requestAnimationFrame( animate );

			render();
			stats.update();

		}

		function render() {

			// animate camera along spline

			var time = Date.now();
			var looptime = 20 * 1000;
			var t = ( time % looptime ) / looptime;

			var pos = tubeGeometry.parameters.path.getPointAt( t );
			pos.multiplyScalar( params.scale );

			// interpolation

			var segments = tubeGeometry.tangents.length;
			var pickt = t * segments;
			var pick = Math.floor( pickt );
			var pickNext = ( pick + 1 ) % segments;

			binormal.subVectors( tubeGeometry.binormals[ pickNext ], tubeGeometry.binormals[ pick ] );
			binormal.multiplyScalar( pickt - pick ).add( tubeGeometry.binormals[ pick ] );

			var dir = tubeGeometry.parameters.path.getTangentAt( t );
			var offset = 15;

			normal.copy( binormal ).cross( dir );

			// we move on a offset on its binormal

			pos.add( normal.clone().multiplyScalar( offset ) );

			splineCamera.position.copy( pos );
			cameraEye.position.copy( pos );

			// using arclength for stablization in look ahead

			var lookAt = tubeGeometry.parameters.path.getPointAt( ( t + 30 / tubeGeometry.parameters.path.getLength() ) % 1 ).multiplyScalar( params.scale );

			// camera orientation 2 - up orientation via normal

			if ( ! params.lookAhead ) lookAt.copy( pos ).add( dir );
			splineCamera.matrix.lookAt( splineCamera.position, lookAt, normal );
			splineCamera.rotation.setFromRotationMatrix( splineCamera.matrix, splineCamera.rotation.order );

			cameraHelper.update();

			renderer.render( scene, params.animationView === true ? splineCamera : camera );

		}

	</script>
	
	<?if(1==2){?>
	<script src="js/ThreeCSG.js"></script> 
	<script src="terrianAB.js"></script>
	<?}?>
	
	</body>
</html>
