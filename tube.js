




pathBezierCurve();


// создаем кривую линию
function pathBezierCurve()
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
	
	//createTube(points);				
}



// создаем трубу по заданному пути из точек
function createTube(points)
{
	var params = { extrusionSegments: 100, radiusSegments: 3, closed: false };
		
	var pipeSpline = new THREE.CatmullRomCurve3(points);
	pipeSpline.curveType = 'catmullrom';
	pipeSpline.tension = 0;
	
	var tubeGeometry = new THREE.TubeBufferGeometry( pipeSpline, params.extrusionSegments, 0.3, params.radiusSegments, params.closed );

	var tube = new THREE.Mesh( tubeGeometry, new THREE.LineBasicMaterial( { color : 0xff0000 } ) );	
	
	scene.add( tube );	
}



