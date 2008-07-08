function makePerspective(fovy, aspect, znear, zfar)
{
    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;

    return makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
}

// glFrustum Implementation
function makeFrustum(left, right,
                     bottom, top,
                     znear, zfar)
{
    var X = 2 * znear / (right - left);
    var Y = 2 * znear / (top - bottom);
    var A = (right + left) / (right - left);
    var B = (top + bottom) / (top - bottom);
    var C = -(zfar + znear) / (zfar - znear);
    var D = -2 * zfar * znear / (zfar - znear);

    return new Array(X,	0,	0,	0,
					 0,	Y,	0,	0,
					 A,	B,	C,	-1,
					 0,	0,	D,	0);
}

// gluLookAt Implementation
function lookAt(eye, center, up)
{
	if ( isValidVector(eye) && isValidVector(center) && isValidVector(up))
	{
		// Figure out the Orientation
		var z = normalizeVector(subtractVectors(eye, center));
		var x = normalizeVector(vectorCrossProduct(up, z));
		var y = normalizeVector(vectorCrossProduct(z, x));
			
		// View Matrix
		return new makeMatrix(	x[0],	y[0],	z[0],	0.0,
								x[1],	y[1],	z[1],	0.0,
								x[2],	y[2],	z[2],	0.0,
								0.0,	0.0,	0.0,	1 
							);
	}
	
	logWarning('lookAt() called with a parameters that are not vectors');
	return null;
}

// var color = function(r, g, b, a){
// 	gl.material(gl.FRONT_AND_BACK, gl.AMBIENT, [r, g, b, a]);		
// }
// var scale = function(x, y, z){
// 	gl.scale(x, y, z);
// }
// var translate = function(x, y, z){
// 	gl.translate(x, y, z);
// }
// var rotate = function(a, x, y, z){
// 	gl.rotate(a, x, y, z);
// }
// var push = function(){
// 	gl.pushMatrix();
// }
// var pop = function(){
// 	gl.popMatrix();
// }
