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

// Global variable for Keeping track of this Class
var thisScn = null;

function Scene()
{
	var glCanvas3D		= null; // OpenGL Context (Canvas)
	var camera			= null; // Reference to a Camera type
	var objList			= new Array(); // An array of Objects to draw
	var exitFlag		= false; // Exits the mail loop
	var canvasHeight	= 0;
	var canvasWidth		= 0;
	var lastTimeTaken	= Date.now();
	var timerID			= 0;
	var clearColor		= new Array(0.4, 0.4, 0.4, 1.0);
	// -------------------------------------------------------
	
	// Getters
	this.getCamera = function() { return camera; }
	this.getObjListSize = function() { return objList.length; }
	this.getGL = function() { return glCanvas3D; }
	this.getObj = function(indxNum)
	{
		// Check if the indext that was asked for is inside the bounds of our array
		if (!isNaN(indxNum) && indxNum >= 0 && indxNum < objList.length)
		{
			// We do this because we dont want outsiders modifying the object list,
			// just the object themselves (ie. changing position, orientation, etc)
			return objList[indxNum];
		}
		
		return null;
	}
	
	// -------------------------------------------------------	
	
	// Acquire the OpenGL Context
	this.createScene = function(name)
	{
		var cvs = null;
		
		if (glCanvas3D == null)
		{
			// Get the Canvas Tag
			cvs = document.getElementById(name);
			
			// Try to get access to the OpenGL Canvas
			try
			{
				glCanvas3D = cvs.getContext('moz-gles11');			
			}catch (err)
			{
				alert("Canvas3D Not Initialized.\nThis is a problem with newer ATI cards. :(");
				glCanvas3D = null;
			}
			
			// Check the access to canvas
			if (glCanvas3D != null)
			{
				// Set our global (fake static variable) to be used in rendering
				thisScn = this;
				
				// Get the size of the Canvas Space for Aspect Ratio calculation
				canvasWidth = cvs.width;
				canvasHeight = cvs.height;
				
				// Success
				return true;
			}
			
			// Failed, ATI Problem?
			return false;
		}
		
		// Canvas already exists
		return false;
	}
	
	// Add a Camera to the Scene
	this.addCameraToScene = function(cam)
	{
		// Check to see if we were passed a correct Camera class
		if (cam instanceof ChaseCamera ||
			cam instanceof FreeCamera ||
			cam instanceof FixedCamera ||
			cam instanceof PanCamera)
		{
			camera = cam;
			return true;
		}	
		
		return false;
	}
	
	// Add objects to the scene
	this.addObjectToScene = function(obj)
	{
		// Check to see if we were passed a correct Camera class
		if (obj instanceof Model ||
			obj instanceof Primitive ||
			obj instanceof Cube)
		{
			objList.push(obj);

			return true;
		}	
		
		return false;
	}
	this.everyFrame = function(){
		//do nothing
		return true;
	}
	// Remove objects form the scene
	this.removeObjectFromScene = function(obj)
	{
		var i;
		
		// Check to see if we were passed a correct Camera class
		if (obj instanceof Model ||
			obj instanceof Primitive)
		{
			// Check against each item in the list
			for (i = 0; i < objList.length; i++)
			{
				if (objList[i] == obj)
				{
					// Remove the item
					objList.splice(i, 1);

					return true;
				}
			}
		}
		
		return false;
	}
	this.setClearColor = function(f1, f2, f3)
	{
		clearColor[0] = f1;
		clearColor[1] = f2;
		clearColor[2] = f3;
	}
	// Sets up OpenGL
	this.setupOpenGL = function()
	{
		if (glCanvas3D == null) return;
		
		// OpenGL Setup
		glCanvas3D.matrixMode(glCanvas3D.PROJECTION);
		glCanvas3D.loadIdentity();
		glCanvas3D.gluPerspective(45, canvasWidth / canvasHeight, 0.1, 200);
		glCanvas3D.matrixMode(glCanvas3D.MODELVIEW);
		glCanvas3D.loadIdentity();
		glCanvas3D.shadeModel(glCanvas3D.SMOOTH);
		// Lighting
		glCanvas3D.enable(glCanvas3D.LIGHTING);
		// glCanvas3D.light(glCanvas3D.LIGHT0, glCanvas3D.AMBIENT, [0.1, 0.1, 0.1, 1.0]);
		// glCanvas3D.light(glCanvas3D.LIGHT0, glCanvas3D.DIFFUSE, [1.0, 1.0, 1.0, 1.0]);
		// glCanvas3D.light(glCanvas3D.LIGHT0, glCanvas3D.SPECULAR, [1.0, 1.0, 1.0, 1.0]);
		glCanvas3D.light(glCanvas3D.LIGHT0, glCanvas3D.POSITION, [0.0, 270.0, 0.0, 1.0]);
		// glCanvas3D.light(glCanvas3D.LIGHT0, glCanvas3D.SPOT_CUTOFF, 180);
		// glCanvas3D.light(glCanvas3D.LIGHT0, glCanvas3D.SPOT_DIRECTION, [0.0, -1.0, 0.0, 1.0]);
		glCanvas3D.enable(glCanvas3D.LIGHT0);
	}
	
	// This is the main loop that controls rendering
	this.startScene = function()
	{
		var timeDate = new Date();
		var lastTimeTaken = timeDate.getMilliseconds();
		
		// Safety Checks
		if (glCanvas3D == null) return;
		if (camera == null) return;
		
		// Set it all up
		this.setupOpenGL();
		
		// Create a timer for this object
		timerID = setInterval(this.render, 25);
		
		// Start the timer
		lastTimeTaken = Date.now();
		this.render();
	}
	
	// Render Loop
	this.render = function()
	{
		// If a user wants to stop rendering, this is where it happens
		if (exitFlag)
		{
			timerID = clearInterval(timerID);
			return;
		}
		
		// Clear the screen
		glCanvas3D.clearColor(clearColor[0], clearColor[1], clearColor[2], 1.0);
		glCanvas3D.clear(glCanvas3D.COLOR_BUFFER_BIT | glCanvas3D.GL_DEPTH_BUFFER_BIT);
		
		// Enable Lights
		// Update the objects
		thisScn.updateObjects(Date.now() - lastTimeTaken);
		lastTimeTaken = Date.now();
		
		// Do Rendering
		thisScn.renderObjects(glCanvas3D);
		
		// Swap buffers to render
		glCanvas3D.swapBuffers();
	}
	
	// Updates all objects based on time
	this.updateObjects = function(timeElapsed)
	{
		// Update the Camera (If there is animation)
		camera.update(Date.now() - lastTimeTaken);
		
		// Update the rest of the objects individually
		for (var i = 0; i < objList.length; i++)
		{
			objList[i].update(timeElapsed);
		}
	}
	
	// Renders all objects to the screen
	this.renderObjects = function()
	{
		// Set the camera in world space
		camera.applyToWorld(glCanvas3D);

		// Render each object separately
		for (var i = 0; i < objList.length; i++)
		{
			objList[i].render(glCanvas3D);
		}
	}
	
	// Flags he main loop for exit
	this.stopScene = function()
	{
		// This flags the main loop to exit gracefully
		exitFlag = true;
	}
}
