




pathBezierCurve();


// создаем кривую линию
function pathBezierCurve()
{
	
	var curve = new THREE.QuadraticBezierCurve3(
		new THREE.Vector3( -10, 0, -7 ),
		new THREE.Vector3( -5, 0, 1 ),
		new THREE.Vector3( 0, 0, -7 ),
	);

	var points = curve.getPoints( 40 ); 
	var geometry = new THREE.BufferGeometry().setFromPoints( points );

	var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

	// Create the final object to add to the scene
	var curveObject = new THREE.Line( geometry, material );			
	
	scene.add( curveObject );
	
	//createTube(points);



	drawLineOffset_1(points);
}


// создаем паралельные линии, со смещение от основной линии
function drawLineOffset_1(points)
{
	var path = [];
	
	for(var i = 0; i < points.length; i++)
	{ 
		path[i] = new THREE.Vector2( points[i].x, points[i].z );
	}
	
	var points_1 = getPointLineOffset_1(-0.2, path);	
	var geom = new THREE.BufferGeometry().setFromPoints(points_1);	
	var line = new THREE.Line(geom, new THREE.LineBasicMaterial({color: 0x777777 }));
	scene.add(line);

	var points_2 = getPointLineOffset_1(0.2, path);	
	var geom = new THREE.BufferGeometry().setFromPoints(points_2);	
	var line = new THREE.Line(geom, new THREE.LineBasicMaterial({color: 0x777777 }));
	scene.add(line);

	var points_3 = [];
	for(var i = 0; i < points_1.length; i++){ points_3[points_3.length] = points_1[i]; }
	for(var i = points_2.length - 1; i > -1; i--){ points_3[points_3.length] = points_2[i]; }
	
	createCurveWall(points_3);
}



// создаем кривую стену
function createCurveWall(points)
{
	var p2 = [];
	
	for ( var i = 0; i < points.length; i++ ) 
	{  
		p2[i] = new THREE.Vector2( points[i].x, points[i].z );		
	}
	
	var shape = new THREE.Shape( p2 );
	var geometry = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: -2 } );
	
	//var geometry = new THREE.ShapeGeometry( shape );
	
	var wall = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color : 0xcccccc, side : THREE.DoubleSide } ) );

	wall.rotation.set( Math.PI / 2, 0, 0 );	
	
	scene.add(wall);
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



function getPointLineOffset_1(offset, contour) 
{

	var result = [];

	var milty = offset * -1;
	
	offset = new THREE.BufferAttribute(new Float32Array([offset, 0, 0]), 3);


	for (var i = 0; i < contour.length; i++) 
	{
		var v1 = new THREE.Vector2().subVectors(contour[i - 1 < 0 ? contour.length - 1 : i - 1], contour[i]);
		var v2 = new THREE.Vector2().subVectors(contour[i + 1 == contour.length ? 0 : i + 1], contour[i]);
		
		
		if(i == 0)
		{			
			var v1 = new THREE.Vector2( contour[i + 1].x - contour[i].x, contour[i + 1].y - contour[i].y );
			v1 = new THREE.Vector2( v1.y, -v1.x ).normalize();
			
			v1.x *= milty;
			v1.y *= milty;
			
			v1.x += contour[i].x;
			v1.y += contour[i].y;				
	
			result.push(new THREE.Vector3(v1.x, 0, v1.y)); 			
			continue;
		}

		if(i == contour.length - 1)
		{
			var v1 = new THREE.Vector2( contour[i].x - contour[i - 1].x, contour[i].y - contour[i - 1].y );
			v1 = new THREE.Vector2( v1.y, -v1.x ).normalize();
			
			v1.x *= milty;
			v1.y *= milty;
			
			v1.x += contour[i].x;
			v1.y += contour[i].y;	
	
			result.push(new THREE.Vector3(v1.x, 0, v1.y)); 
			continue;
		}			
		
		let angle = v2.angle() - v1.angle();
		let halfAngle = angle * 0.5;

		let hA = halfAngle;
		let tA = v2.angle() + Math.PI * 0.5;

		let shift = Math.tan(hA - Math.PI * 0.5);
		let shiftMatrix = new THREE.Matrix4().set
		(
			1, 0, 0, 0, 
			-shift, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		);


		let tempAngle = tA;
		let rotationMatrix = new THREE.Matrix4().set
		(
			Math.cos(tempAngle), -Math.sin(tempAngle), 0, 0,
			Math.sin(tempAngle),  Math.cos(tempAngle), 0, 0,
			0,                    0, 1, 0,
			0,                    0, 0, 1
		);

		let translationMatrix = new THREE.Matrix4().set
		(
			1, 0, 0, contour[i].x,
			0, 1, 0, contour[i].y,
			0, 0, 1, 0,
			0, 0, 0, 1,
		);

		let cloneOffset = offset.clone();
		//console.log("cloneOffset", cloneOffset);
		shiftMatrix.applyToBufferAttribute(cloneOffset);
		rotationMatrix.applyToBufferAttribute(cloneOffset);
		translationMatrix.applyToBufferAttribute(cloneOffset);

		result.push(new THREE.Vector3(cloneOffset.getX(0), 0, cloneOffset.getY(0)));
	}


	return result;
}




