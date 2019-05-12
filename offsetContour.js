





function createContour()
{
	var contour1 = [
		new THREE.Vector2(0, 0),
		new THREE.Vector2(1, 1),
		new THREE.Vector2(2, 1),
		new THREE.Vector2(2, 0),
		new THREE.Vector2(1, -1),
		new THREE.Vector2(1, 0)
	];

	for (let i = 0; i < 6; i++)
	{
		let points = OffsetContour(i * -0.1, contour1);
		console.log(points);
		let geom = new THREE.BufferGeometry().setFromPoints(points);
		geom.rotateX(-Math.PI * 0.5);
		let line = new THREE.LineLoop(geom, new THREE.LineBasicMaterial({color: 0x777777 + Math.random() * 0x777777}));
		scene.add(line);
	}	
}



function OffsetContour(offset, contour) 
{

	let result = [];

	offset = new THREE.BufferAttribute(new Float32Array([offset, 0, 0]), 3);
	console.log("offset", offset);

	for (let i = 0; i < contour.length; i++) 
	{
		let v1 = new THREE.Vector2().subVectors(contour[i - 1 < 0 ? contour.length - 1 : i - 1], contour[i]);
		let v2 = new THREE.Vector2().subVectors(contour[i + 1 == contour.length ? 0 : i + 1], contour[i]);
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

		let translationMatrix = new THREE.Matrix4().set(
		1, 0, 0, contour[i].x,
		0, 1, 0, contour[i].y,
		0, 0, 1, 0,
		0, 0, 0, 1,
		);

		let cloneOffset = offset.clone();
		console.log("cloneOffset", cloneOffset);
		shiftMatrix.applyToBufferAttribute(cloneOffset);
		rotationMatrix.applyToBufferAttribute(cloneOffset);
		translationMatrix.applyToBufferAttribute(cloneOffset);

		result.push(new THREE.Vector2(cloneOffset.getX(0), cloneOffset.getY(0)));
	}


	return result;
}


