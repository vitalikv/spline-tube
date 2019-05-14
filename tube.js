




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



	drawLineOffset_1(points);
}


// создаем линии
function drawLineOffset_1(points)
{
	var path = [];
	
	for(var i = 0; i < points.length; i++)
	{ 
		path[i] = new THREE.Vector2( points[i].x, points[i].z );
	}
	
	var points = getPointLineOffset_1(-0.2, path);	
	var geom = new THREE.BufferGeometry().setFromPoints(points);	
	var line = new THREE.Line(geom, new THREE.LineBasicMaterial({color: 0x777777 }));
	scene.add(line);

	var points = getPointLineOffset_1(0.2, path);	
	var geom = new THREE.BufferGeometry().setFromPoints(points);	
	var line = new THREE.Line(geom, new THREE.LineBasicMaterial({color: 0x777777 }));
	scene.add(line);		
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
console.log("offset", offset);
	offset = new THREE.BufferAttribute(new Float32Array([offset, 0, 0]), 3);
	

		
console.log("contour.length", contour);



	for (var i = 0; i < contour.length; i++) 
	{
		var v1 = new THREE.Vector2().subVectors(contour[i - 1 < 0 ? contour.length - 1 : i - 1], contour[i]);
		var v2 = new THREE.Vector2().subVectors(contour[i + 1 == contour.length ? 0 : i + 1], contour[i]);
		
		if(i == 20)
		{
			v1 = new THREE.Vector2().subVectors(contour[i + 1], contour[i]);
			v1 = new THREE.Vector2( v1.y, -v1.x ).normalize().add(contour[i]);
		}

		if(20 == contour.length - 1)
		{
			v2 = new THREE.Vector2().subVectors(contour[i], contour[i - 1]);
			v2 = new THREE.Vector2( v2.y, -v2.x );  console.log(22222, v2);
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




