/*Copyright (c) 2008 Catherine Leung, Mark Paruzel, Andrew Smith

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

function canvasMain(canvasName)
{
	scn = new Scene();
	scn.createScene('canvas');
	var cam = new FreeCamera();
	// Camera stuff
	cam.setPosition(new Vector(-5.0, 10.0, -5.0));
	cam.setLookAtPoint(new Vector(5.0, 0.0, 5.0));
	scn.addCameraToScene(cam);
	
	// Render Loop
	scn.startScene();
	
	
	
	// var scn = new Scene();
	// 
	// // Attach to Canvas3D
	// if (scn.createScene(canvasName))
	// {
	// 	var cam = new FreeCamera();
	// 	
	// 	// Cubes
	// 	for (var i = 0; i < 1; i++)
	// 	{
	// 		for (var j = 0; j < 1; j++)
	// 		{
	// 			var n = new Cube();
	// 			// n.setAngularVel(new Vector(Math.random() * 0.001, 
	// 			// 										   Math.random() * 0.001, 
	// 			// 										   Math.random() * 0.001));
	// 			n.setPosition(new Vector(i * 5, 0, j * 5));
	// 			scn.addObjectToScene(n);			
	// 		}
	// 	}
	// 
	// 	// Camera stuff
	// 	cam.setPosition(new Vector(-5.0, 10.0, -5.0));
	// 	cam.setLookAtPoint(new Vector(5.0, 0.0, 5.0));
	// 	scn.addCameraToScene(cam);
	// 	
	// 	// Render Loop
	// 	scn.startScene();
	// }
}

drawCube = function(glCanvas3D)
{
	if (glCanvas3D != null)
	{
		var buffers = {};
		var vertArray = new Array();
		var normArray = new Array();
		var colorArray = new Array();

		// This would be easier if we had an Index Buffer
		var vecArr = [up,					left,					dir,				// 1
					  up,					left,					dir.multiply(-1.0),	// 2
					  up,					left.multiply(-1.0),	dir.multiply(-1.0),	// 3
					  up.multiply(-1.0),	left.multiply(-1.0),	dir.multiply(-1.0),	// 4						  
					  up,					left.multiply(-1.0),	dir,				// 5						  
					  up.multiply(-1.0),	left.multiply(-1.0),	dir,				// 6						  
					  up.multiply(-1.0),	left,					dir,				// 7						  
					  up.multiply(-1.0),	left.multiply(-1.0),	dir.multiply(-1.0),	// 8						  
					  up.multiply(-1.0),	left,					dir.multiply(-1.0),	// 9						  
					  up,					left,					dir.multiply(-1.0),	// 10						  
					  up.multiply(-1.0),	left,					dir,				// 11						  
					  up,					left,					dir,				// 12						  
					  up,					left.multiply(-1.0),	dir,				// 13						  
					  up,					left.multiply(-1.0),	dir.multiply(-1.0),	// 14
					 ];
		
		// Using the vectors above, calculate the verticies
		for (var i = 0; i < (14 * 3); i += 3)
		{
			var v = new Vector();
			v.setFromVector(pos.add(vecArr[i]));
			v.setFromVector(v.add(vecArr[i + 1]));
			v.setFromVector(v.add(vecArr[i + 2]));
			
			// Set the individual Vertex Coords
			vertArray.push(v.getX());
			vertArray.push(v.getY());
			vertArray.push(v.getZ());
			
			// Calculate the Normals
			var n = new Vector(0.0, 0.0, 0.0);
			n.setFromVector(v.add(pos));
			n.normalize();
			
			normArray.push(n.getX());
			normArray.push(n.getY());
			normArray.push(n.getZ());
			
			// Set some colors
			colorArray.push(0.2); // R
			colorArray.push(0.4); // G
			colorArray.push(0.7); // B
			colorArray.push(1);	  // A
		}
		
		// Create Buffers				   
		buffers.vertex = glCanvas3D.createBuffer(glCanvas3D.STATIC_DRAW, 3, glCanvas3D.FLOAT, vertArray);
		buffers.normal = glCanvas3D.createBuffer(glCanvas3D.STATIC_DRAW, 3, glCanvas3D.FLOAT, normArray);
		buffers.color = glCanvas3D.createBuffer(glCanvas3D.STATIC_DRAW, 4, glCanvas3D.FLOAT, colorArray);

		// Apply the buffers to OpenGL
		glCanvas3D.enable(glCanvas3D.CULL_FACE);
		glCanvas3D.frontFace(glCanvas3D.CCW);
		glCanvas3D.vertexPointer(buffers.vertex);
		glCanvas3D.normalPointer(buffers.normal);
		glCanvas3D.colorPointer(buffers.color);

		// Flag OpenGL that we will be using buffers
		glCanvas3D.enableClientState(glCanvas3D.VERTEX_ARRAY);
		glCanvas3D.enableClientState(glCanvas3D.NORMAL_ARRAY);
		glCanvas3D.enableClientState(glCanvas3D.COLOR_ARRAY);

		// Draw
		glCanvas3D.drawArrays(glCanvas3D.TRIANGLE_STRIP, 0, 14);

		// Turn off Buffers
		glCanvas3D.disableClientState(glCanvas3D.VERTEX_ARRAY);
		glCanvas3D.disableClientState(glCanvas3D.NORMAL_ARRAY);
		glCanvas3D.disableClientState(glCanvas3D.COLOR_ARRAY);
	}
}

