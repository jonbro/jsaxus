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
		gl.multMatrix(makePerspective(45, canvas.width / canvas.height, 0.1, 200));
		
		gl.matrixMode(gl.MODELVIEW);
		gl.loadIdentity();
		
		// Lighting
		gl.enable(gl.LIGHTING);
		gl.light(gl.LIGHT0, gl.AMBIENT, [0.1, 0.1, 0.1, 1.0]);
		gl.light(gl.LIGHT0, gl.DIFFUSE, [1.0, 1.0, 1.0, 1.0]);
		gl.light(gl.LIGHT0, gl.SPECULAR, [1.0, 1.0, 1.0, 1.0]);
		gl.light(gl.LIGHT0, gl.POSITION, [0.0, 270.0, 0.0, 1.0]);
		gl.light(gl.LIGHT0, gl.SPOT_CUTOFF, 180);
		gl.light(gl.LIGHT0, gl.SPOT_DIRECTION, [0.0, -1.0, 0.0, 1.0]);
		gl.enable(gl.LIGHT0);
		
	}
}
