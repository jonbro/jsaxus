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
function Quaternion(newW, newX, newY, newZ)
{
    // Quat = W + X * i + Y * j + Z * k 
	var quat = new Array(4); // [0]=w, [1]=x, [2]=y, [3]=z
	
	// -------------------------------------------------------

	// Getters
	this.getW = function() { return quat[0]; }
	this.getX = function() { return quat[1]; }
	this.getY = function() { return quat[2]; }
	this.getZ = function() { return quat[3]; }
	
	// Create a Matrix from a Quaternion
	this.getMatrix = function()
	{
		newMat = new Matrix();
		
		var Tx  = 2.0 * quat[1];
		var Ty  = 2.0 * quat[2];
		var Tz  = 2.0 * quat[3];
		var Twx = Tx * quat[0];
		var Twy = Ty * quat[0];
		var Twz = Tz * quat[0];
		var Txx = Tx * quat[1];
		var Txy = Ty * quat[1];
		var Txz = Tz * quat[1];
		var Tyy = Ty * quat[2];
		var Tyz = Tz * quat[2];
		var Tzz = Tz * quat[3];
		
		// Setup a new Matrix out of this quaternion
		newMat.setMatrix([1.0 - (Tyy + Tzz),	Txy - Twz,				Txz + Twy,				0.0,
						  Txy + Twz,			1.0 - (Txx + Tzz),		Tyz - Twx,				0.0,
						  Txz - Twy,			Tyz + Twx,				1.0 - (Txx + Tyy),		0.0,
						  0.0,					0.0,					0.0,					1.0]
						 );
		
		return newMat;
	}
	
	// Convert to Axis Angle
	this.getAxisAngle = function(axisVec, angleScalar)
	{
		axisVec = new Vector();
		angleScalar = new Number();
		
		// Get the Length squared
		var sqLength = this.lengthSq();

		// If length is very small, its basically touching a world Axis
		if (sqLength > 0.001)
		{
			var invLength = invSqrt(sqLength);
			
			// Set the Angle
			angleScalar = 2.0 * Math.acos(quat[0]);
			
			// Set the Vector
			axisVec.set(quat[1] * invLength, quat[2] * invLength, quat[3] * invLength);
		}
		else
		{
			// Set world Axis
			angleScalar = 0.0;
			axisVec.set(1.0, 0.0, 0.0);
		}	
	}
		
	// Setters
	// Copy values from another Quaternion
	this.setFromQuat = function(newQuat)
	{
		if (newQuat instanceof Quaternion)
		{
			// Copy over the Quaternion values
			quat[0] = newQuat.getW();
			quat[1] = newQuat.getX();
			quat[2] = newQuat.getY();
			quat[3] = newQuat.getZ();
		}
	}		
	
	// Set this Quaternion from an Axis and Angle
	this.setFromAxisAngle = function(axisVec, angleScalar)
	{
		if (axisVec instanceof Vector &&
			!isNaN(angleScalar))
		{
			// q = cos(A/2) + sin(A/2) * (x*i + y*j + z*k)
			var halfAngle = 0.5 * angleScalar;
			var s = Math.sin(halfAngle);
			
			quat[0] = Math.cos(halfAngle);
			quat[1] = s * axisVec.getX();
			quat[2] = s * axisVec.getY();
			quat[3] = s * axisVec.getZ();
		}
	}
	
	// Create a Quaternion from a Rotation matrix
	this.setFromMatrix = function(newMat)
	{
		if (newMat instanceof Matrix)
		{
			var trace = newMat[0] + newMat[5] + newMat[10] + 1;
			var sqTrace;
			var s;
			
			if (trace > 0.0)
			{
				sqTrace = Math.sqrt(trace);
				
				s = 0.5 / sqTrace;
				quat[0] = 0.25 / s;
				quat[1] = (newMat[6] - newMat[9]) * s;
				quat[2] = (newMat[8] - newMat[2]) * s;
				quat[3] = (newMat[1] - newMat[4]) * s;
				
			}else{
				if (newMat[0] > newMat[5] && newMat[0] > newMat[10])
				{
					s = 2.0 * Math.sqrt(1.0 + newMat[0] - newMat[5] - newMat[10]);
					quat[1] = 0.25 * s;
					quat[2] = (newMat[1] - newMat[4]) / s;
					quat[3] = (newMat[2] - newMat[8]) / s;
					quat[0] = (newMat[9] - newMat[6]) / s;
				}else if(newMat[5] > newMat[10])
				{
					s = 2.0 * Math.sqrt(1.0 + newMat[5] - newMat[0] - newMat[10]);
					quat[1] = (newMat[1] - newMat[4]) / s;
					quat[2] = 0.25 * s;
					quat[3] = (newMat[9] - newMat[6]) / s;
					quat[0] = (newMat[2] - newMat[8]) / s;
				}else{
					s = 2.0 * Math.sqrt(1.0 + newMat[10] - newMat[0] - newMat[5]);
					quat[1] = (newMat[2] - newMat[8]) / s;
					quat[2] = (newMat[9] - newMat[6]) / s;
					quat[3] = 0.25 * s;
					quat[0] = (newMat[1] - newMat[4]) / s;
				}
			
			}
		}
	}
		
	// -------------------------------------------------------

	// Length Squared
	this.lengthSq = function()
	{
		return quat[1] * quat[1] + quat[2] * quat[2] + quat[3] * quat[3];
	}
	
	// Unit Length
	this.length = function()
	{
		return Math.sqrt(this.lengthSq());
	}
	
	// Add a Quaternion to this one
	this.addQuat = function(newQuat)
	{
		if (newQuat instanceof Quaternion)
		{
			quat[0] += newQuat.getW();
			quat[1] += newQuat.getX();
			quat[2] += newQuat.getY();
			quat[3] += newQuat.getZ();
		}
	}
	
	// Subtract a quaternion from this one
	this.subtractQuat = function(newQuat)
	{
		if (newQuat instanceof Quaternion)
		{
			quat[0] -= newQuat.getW();
			quat[1] -= newQuat.getX();
			quat[2] -= newQuat.getY();
			quat[3] -= newQuat.getZ();
		}	
	}
	
	// Multiply this quaternion plus another one
	this.multiplyQuat = function(scalar)
	{
		if (!isNaN(scalar))
		{
			for (var i = 0; i < 4; i++)
			{
				quat[i] *= scalar;
			}
		}
	}
	
	// Compute the conjugate and return its value
	this.conjugate = function()
	{
		var nQt = new Quaternion();
		
		if (newQuat instanceof Quaternion)
		{
			// Create a conjugate
			nQt.setFromQuat(quat[0], -quat[1], -quat[2], -quat[3]);
		}
		
		return nQt;
	}
	
	// Dot Product
	this.dot = function(newQuat)
	{
		var d = 0.0;
		
		d += quat[0] * newQuat.getW();
		d += quat[1] * newQuat.getX();
		d += quat[2] * newQuat.getY();
		d += quat[3] * newQuat.getZ();
		
		return d;	
	}

	// Unit Normalization
	this.normalize = function()
	{
		var len = length();
		var invLen = 1.0 / len;

		if (len > 0.001)
		{
			quat[0] *= invLen;
			quat[1] *= invLen;
			quat[2] *= invLen;
			quat[3] *= invLen;
		}
		else
		{
			// If Normalization Fails
			len = 0.0;
			quat[0] = 0.0;
			quat[1] = 0.0;
			quat[2] = 0.0;
			quat[3] = 0.0;
		}
   	}
   	
   	// Inverse Quaternion
   	this.inverse = function()
   	{
   	    var invQuat = new Quaternion(0.0, 0.0, 0.0, 0.0);
		var norm = 0.0;

		for (var i = 0; i < 4; i++)
		{
			norm += quat[i] * quat[i];
		}

		if (norm > 0.0)
		{
			var invNorm = 1.0 / norm;
			invQuat.setW(quat[0] * invNorm);
			invQuat.setX(-quat[1] * invNorm);
			invQuat.setY(-quat[2] * invNorm);
			invQuat.setZ(-quat[3] * invNorm);
		}

		return kInverse;
   	}
}
