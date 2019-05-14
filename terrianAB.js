


function createGeometryCube(x, y, z)
{
	var geometry = new THREE.Geometry();
	x /= 2;
	z /= 2;
	var vertices = [
				new THREE.Vector3(-x,0,z),
				new THREE.Vector3(-x,y,z),
				new THREE.Vector3(x,y,z),
				new THREE.Vector3(x,0,z),
				new THREE.Vector3(x,0,-z),
				new THREE.Vector3(x,y,-z),
				new THREE.Vector3(-x,y,-z),
				new THREE.Vector3(-x,0,-z),
			];	
			
	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
				new THREE.Face3(4,7,6),
				new THREE.Face3(6,5,4),				
				new THREE.Face3(0,1,6),
				new THREE.Face3(6,7,0),					
				new THREE.Face3(1,2,5),
				new THREE.Face3(5,6,1),				
				new THREE.Face3(2,3,4),
				new THREE.Face3(4,5,2),				
				new THREE.Face3(3,0,7),
				new THREE.Face3(7,4,3),
			];
	
	var uvs3 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs4 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];	

	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(0.95,1),
			];
	var uvs2 = [
				new THREE.Vector2(0.95,1),
				new THREE.Vector2(1-0.95,1),
				new THREE.Vector2(0,0),
			];				


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs3, uvs4, uvs3, uvs4, uvs3, uvs4, uvs1, uvs2, uvs3, uvs4, uvs3, uvs4];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;		
	
	return geometry;
}





var cube1 = new THREE.Mesh( createGeometryCube(1.2, 3.2, 1.2), new THREE.MeshLambertMaterial( { color : 0xff00ff } ) );
cube1.position.y = 0.8;
scene.add( cube1 );  


var cube2 = new THREE.Mesh( createGeometryCube(10.2, 1.2, 10.2), new THREE.MeshLambertMaterial( { color : 0x3AA413 } ) );
scene.add( cube2 );  

MeshBSP();

// вырезаем отверстие под окно/дверь 
function MeshBSP()
{  

	var wdBSP = new ThreeBSP( cube1 );    
	var wallBSP = new ThreeBSP( cube2 ); 			// копируем выбранную стену	
	var newBSP = wallBSP.subtract( wdBSP );				// вычитаем из стены объект нужной формы
	
	cube2.geometry = newBSP.toGeometry();	
	
	cube2.geometry.computeFaceNormals();

	var intersectObj = wallBSP.intersect( wdBSP ).toMesh( new THREE.MeshLambertMaterial( { color : 0xff00ff } ) );
	scene.add( intersectObj );
	intersectObj.position.y = 3;
	
	scene.remove( cube1 );	 	
}