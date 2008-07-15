var gl;
var startup = function(){
	var canvas = document.getElementById('c');
	try {gl = canvas.getContext('moz-gles11'); } catch (e) {}
	if (! gl)
	{
		alert("Sorry, your browser does not have the moz-gles11 canvas extension");
		canvas.parentNode.replaceChild(canvas.firstChild, canvas);
	}else{
		
		gl.matrixMode(gl.PROJECTION);
		gl.loadIdentity();
		gl.multMatrix(makePerspective(45, canvas.width / canvas.height, 0.1, 100));

		gl.matrixMode(gl.MODELVIEW);

		gl.clearColor(0.4, 0.1, 0.1, 1);

		// gl.enable(gl.FOG);
		// gl.fogParameter(gl.FOG_MODE, gl.LINEAR);
		// gl.fogParameter(gl.FOG_START, 3.7);
		// gl.fogParameter(gl.FOG_END, 4.5);
		// gl.fogParameter(gl.FOG_COLOR, background);

		gl.enable(gl.DEPTH_TEST);
		gl.cullFace(gl.BACK);
		gl.enable(gl.CULL_FACE);


		gl.enable(gl.LIGHTING);
		gl.light(gl.LIGHT0, gl.AMBIENT, [1, 1, 1, 1]);
		gl.light(gl.LIGHT0, gl.DIFFUSE, [1, 1, 1, 1]);
		gl.light(gl.LIGHT0, gl.POSITION, [100, 0, 500, 0]);
		gl.light(gl.LIGHT0, gl.SPECULAR, [1, 1, 1, 1]);
		gl.material(gl.FRONT_AND_BACK, gl.SPECULAR, [4,4,4,1]);
		gl.material(gl.FRONT_AND_BACK, gl.SHININESS, 32);
		gl.enable(gl.LIGHT0);
		gl.enableClientState(gl.NORMAL_ARRAY);
				// 
				// 
				// 
				// 
				// 
				// gl.matrixMode(gl.PROJECTION);
				// gl.multMatrix(makePerspective(45, canvas.width / canvas.height, 0.1, 100));
				// 
				// gl.matrixMode(gl.MODELVIEW);
				// gl.loadIdentity();
				// gl.enable(gl.CULL_FACE);
				// gl.frontFace(gl.CCW);
				// gl.cullFace(gl.BACK);
				// // gl.enable(gl.DEPTH_TEST);
				// // gl.cullFace(gl.BACK);
				// // gl.clearDepth(1.0)
				// // Lighting
				// gl.enable(gl.LIGHTING);
				// gl.light(gl.LIGHT0, gl.AMBIENT, [0.1, 0.1, 0.1, 1.0]);
				// gl.light(gl.LIGHT0, gl.DIFFUSE, [1.0, 1.0, 1.0, 1.0]);
				// gl.light(gl.LIGHT0, gl.SPECULAR, [1.0, 1.0, 1.0, 1.0]);
				// gl.light(gl.LIGHT0, gl.POSITION, [0.0, 270.0, 0.0, 1.0]);
				// gl.light(gl.LIGHT0, gl.SPOT_CUTOFF, 180);
				// gl.light(gl.LIGHT0, gl.SPOT_DIRECTION, [0.0, -1.0, 0.0, 1.0]);
				// gl.enable(gl.LIGHT0);
				
	}
}
