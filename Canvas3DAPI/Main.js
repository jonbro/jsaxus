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
	var scn = new Scene();
	
	// Attach to Canvas3D
	if (scn.createScene(canvasName))
	{
		var cam = new FreeCamera();
		
		// Cubes
		// for (var i = 0; i < 2; i++)
		// {
		// 	for (var j = 0; j < 2; j++)
		// 	{
				var n = new Cube();
				n.setAngularVel(new Vector(Math.random() * 0.001, 
										   Math.random() * 0.001, 
										   Math.random() * 0.001));
				n.setPosition(new Vector(1 * 5, 0, 1 * 5));
				scn.addObjectToScene(n);			
		// 	}
		// }

		// Camera stuff
		cam.setPosition(new Vector(-5.0, 10.0, -5.0));
		cam.setLookAtPoint(new Vector(5.0, 0.0, 5.0));
		scn.addCameraToScene(cam);
		
		// Render Loop
		scn.startScene();
	}
}
