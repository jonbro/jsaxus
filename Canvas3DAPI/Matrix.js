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

function Matrix()
{
	var matrix = [0.0, 0.0, 0.0, 0.0, 
				  0.0, 0.0, 0.0, 0.0, 
				  0.0, 0.0, 0.0, 0.0, 
				  0.0, 0.0, 0.0, 0.0];
			 
	// ----------------------------------------------------------------

	// Getters
	this.getMatrix = function()
	{
		var newArr = new Array(16);
		
		// Copy over the values to a new Array of numbers
		for (var i = 0; i < 16; i++)
		{
			newArr[i] = matrix[i];
		}
		
		return newArr;
	}
	
	// Setters
	this.setMatrix = function(newMatArray)
	{
		if (newMatArray instanceof Array)
		{
			if (newMatArray.length == 16)
			{
				// Iterate through all values in the Array
				for (var i = 0; i < 16; i++)
				{
					if (isNaN(newMatArray[i]))
					{
						// If somehow the passed Matrix has bad numbers, make identity and return
						matrix.identity();
						alert('Element ' + i + ' given to setMatrix is not a number');
						return;
					} else {
						// Copy each value over to our matrix
						matrix[i] = newMatArray[i];
					}
				}			
			} else {
				alert('Array gven to setMatrix has ' + newMatArray.length + ' instead of 16 elements');
			}
		
		} else if (newMatArray instanceof Matrix)
		{
			// Set from another matrix
			matrix = newMatArray.getMatrix();
		} else {
			alert('setMatrix() given something that\'s not an array or a matrix');
		}
	}

	// ----------------------------------------------------------------


	// Create an Identity Matrix
	this.identity = function()
	{
		// Construct an Identity Matrix
		matrix = [1.0, 0.0, 0.0, 0.0, 
				  0.0, 1.0, 0.0, 0.0, 
				  0.0, 0.0, 1.0, 0.0, 
				  0.0, 0.0, 0.0, 1.0];	
	}

	// Transpose this Matrix
	this.transpose = function()
	{
		// Transpose this matrix to Column Major
		matrix = [matrix[0], matrix[4], matrix[8],  matrix[12],
				  matrix[1], matrix[5], matrix[9],  matrix[13],
				  matrix[2], matrix[6], matrix[10], matrix[14],
				  matrix[3], matrix[7], matrix[11], matrix[15]];
	}

	// Inverse a Matrix
	this.inverse = function()
	{
		var kInv = new Matrix();
		var fA0 = matrix[ 0] * matrix[ 5] - matrix[ 1] * matrix[ 4];
		var fA1 = matrix[ 0] * matrix[ 6] - matrix[ 2] * matrix[ 4];
		var fA2 = matrix[ 0] * matrix[ 7] - matrix[ 3] * matrix[ 4];
		var fA3 = matrix[ 1] * matrix[ 6] - matrix[ 2] * matrix[ 5];
		var fA4 = matrix[ 1] * matrix[ 7] - matrix[ 3] * matrix[ 5];
		var fA5 = matrix[ 2] * matrix[ 7] - matrix[ 3] * matrix[ 6];
		var fB0 = matrix[ 8] * matrix[13] - matrix[ 9] * matrix[12];
		var fB1 = matrix[ 8] * matrix[14] - matrix[10] * matrix[12];
		var fB2 = matrix[ 8] * matrix[15] - matrix[11] * matrix[12];
		var fB3 = matrix[ 9] * matrix[14] - matrix[10] * matrix[13];
		var fB4 = matrix[ 9] * matrix[15] - matrix[11] * matrix[13];
		var fB5 = matrix[10] * matrix[15] - matrix[11] * matrix[14];

		// Determinant
		var fDet = fA0 * fB5 - fA1 * fB4 + fA2 * fB3 + fA3 * fB2 - fA4 * fB1 + fA5 * fB0;
		
		// Account for a very small value
		if (Math.abs(fDet) <= 0.001)
		{
			return null;
		}

		kInv.matrix[ 0] = + matrix[ 5] * fB5 - matrix[ 6] * fB4 + matrix[ 7] * fB3;
		kInv.matrix[ 4] = - matrix[ 4] * fB5 + matrix[ 6] * fB2 - matrix[ 7] * fB1;
		kInv.matrix[ 8] = + matrix[ 4] * fB4 - matrix[ 5] * fB2 + matrix[ 7] * fB0;
		kInv.matrix[12] = - matrix[ 4] * fB3 + matrix[ 5] * fB1 - matrix[ 6] * fB0;
		kInv.matrix[ 1] = - matrix[ 1] * fB5 + matrix[ 2] * fB4 - matrix[ 3] * fB3;
		kInv.matrix[ 5] = + matrix[ 0] * fB5 - matrix[ 2] * fB2 + matrix[ 3] * fB1;
		kInv.matrix[ 9] = - matrix[ 0] * fB4 + matrix[ 1] * fB2 - matrix[ 3] * fB0;
		kInv.matrix[13] = + matrix[ 0] * fB3 - matrix[ 1] * fB1 + matrix[ 2] * fB0;
		kInv.matrix[ 2] = + matrix[13] * fA5 - matrix[14] * fA4 + matrix[15] * fA3;
		kInv.matrix[ 6] = - matrix[12] * fA5 + matrix[14] * fA2 - matrix[15] * fA1;
		kInv.matrix[10] = + matrix[12] * fA4 - matrix[13] * fA2 + matrix[15] * fA0;
		kInv.matrix[14] = - matrix[12] * fA3 + matrix[13] * fA1 - matrix[14] * fA0;
		kInv.matrix[ 3] = - matrix[ 9] * fA5 + matrix[10] * fA4 - matrix[11] * fA3;
		kInv.matrix[ 7] = + matrix[ 8] * fA5 - matrix[10] * fA2 + matrix[11] * fA1;
		kInv.matrix[11] = - matrix[ 8] * fA4 + matrix[ 9] * fA2 - matrix[11] * fA0;
		kInv.matrix[15] = + matrix[ 8] * fA3 - matrix[ 9] * fA1 + matrix[10] * fA0;

		// Inverse using Determinant
		var fInvDet = 1.0 / fDet;
		kInv.matrix[ 0] *= fInvDet;
		kInv.matrix[ 1] *= fInvDet;
		kInv.matrix[ 2] *= fInvDet;
		kInv.matrix[ 3] *= fInvDet;
		kInv.matrix[ 4] *= fInvDet;
		kInv.matrix[ 5] *= fInvDet;
		kInv.matrix[ 6] *= fInvDet;
		kInv.matrix[ 7] *= fInvDet;
		kInv.matrix[ 8] *= fInvDet;
		kInv.matrix[ 9] *= fInvDet;
		kInv.matrix[10] *= fInvDet;
		kInv.matrix[11] *= fInvDet;
		kInv.matrix[12] *= fInvDet;
		kInv.matrix[13] *= fInvDet;
		kInv.matrix[14] *= fInvDet;
		kInv.matrix[15] *= fInvDet;

		// Just in case the calculation fails, return a zero
		return kInv;
	}

	// Matrix determinant
	this.determinant = function()
	{
		var fA0 = matrix[ 0] * matrix[ 5] - matrix[ 1] * matrix[ 4];
		var fA1 = matrix[ 0] * matrix[ 6] - matrix[ 2] * matrix[ 4];
		var fA2 = matrix[ 0] * matrix[ 7] - matrix[ 3] * matrix[ 4];
		var fA3 = matrix[ 1] * matrix[ 6] - matrix[ 2] * matrix[ 5];
		var fA4 = matrix[ 1] * matrix[ 7] - matrix[ 3] * matrix[ 5];
		var fA5 = matrix[ 2] * matrix[ 7] - matrix[ 3] * matrix[ 6];
		var fB0 = matrix[ 8] * matrix[13] - matrix[ 9] * matrix[12];
		var fB1 = matrix[ 8] * matrix[14] - matrix[10] * matrix[12];
		var fB2 = matrix[ 8] * matrix[15] - matrix[11] * matrix[12];
		var fB3 = matrix[ 9] * matrix[14] - matrix[10] * matrix[13];
		var fB4 = matrix[ 9] * matrix[15] - matrix[11] * matrix[13];
		var fB5 = matrix[10] * matrix[15] - matrix[11] * matrix[14];
		
		// Construct the Determinant
		var fDet = fA0 * fB5 - fA1 * fB4 + fA2 * fB3 + fA3 * fB2 - fA4 * fB1 + fA5 * fB0;
		
		return fDet;
	}

	// Adjoin calculation
	this.adjoint = function()
	{	
		var mat = new Matrix();
		var fA0 = mat.matrix[ 0] * mat.matrix[ 5] - mat.matrix[ 1] * mat.matrix[ 4];
		var fA1 = mat.matrix[ 0] * mat.matrix[ 6] - mat.matrix[ 2] * mat.matrix[ 4];
		var fA2 = mat.matrix[ 0] * mat.matrix[ 7] - mat.matrix[ 3] * mat.matrix[ 4];
		var fA3 = mat.matrix[ 1] * mat.matrix[ 6] - mat.matrix[ 2] * mat.matrix[ 5];
		var fA4 = mat.matrix[ 1] * mat.matrix[ 7] - mat.matrix[ 3] * mat.matrix[ 5];
		var fA5 = mat.matrix[ 2] * mat.matrix[ 7] - mat.matrix[ 3] * mat.matrix[ 6];
		var fB0 = mat.matrix[ 8] * mat.matrix[13] - mat.matrix[ 9] * mat.matrix[12];
		var fB1 = mat.matrix[ 8] * mat.matrix[14] - mat.matrix[10] * mat.matrix[12];
		var fB2 = mat.matrix[ 8] * mat.matrix[15] - mat.matrix[11] * mat.matrix[12];
		var fB3 = mat.matrix[ 9] * mat.matrix[14] - mat.matrix[10] * mat.matrix[13];
		var fB4 = mat.matrix[ 9] * mat.matrix[15] - mat.matrix[11] * mat.matrix[13];
		var fB5 = mat.matrix[10] * mat.matrix[15] - mat.matrix[11] * mat.matrix[14];

		// Adjoint
		mat.set([  mat.matrix[ 5] * fB5 - mat.matrix[ 6] * fB4 + mat.matrix[ 7] * fB3,
				 - mat.matrix[ 1] * fB5 + mat.matrix[ 2] * fB4 - mat.matrix[ 3] * fB3,
				   mat.matrix[13] * fA5 - mat.matrix[14] * fA4 + mat.matrix[15] * fA3,
				 - mat.matrix[ 9] * fA5 + mat.matrix[10] * fA4 - mat.matrix[11] * fA3,
				 - mat.matrix[ 4] * fB5 + mat.matrix[ 6] * fB2 - mat.matrix[ 7] * fB1,
				   mat.matrix[ 0] * fB5 - mat.matrix[ 2] * fB2 + mat.matrix[ 3] * fB1,
				 - mat.matrix[12] * fA5 + mat.matrix[14] * fA2 - mat.matrix[15] * fA1,
				   mat.matrix[ 8] * fA5 - mat.matrix[10] * fA2 + mat.matrix[11] * fA1,
				   mat.matrix[ 4] * fB4 - mat.matrix[ 5] * fB2 + mat.matrix[ 7] * fB0,
				 - mat.matrix[ 0] * fB4 + mat.matrix[ 1] * fB2 - mat.matrix[ 3] * fB0,
				   mat.matrix[12] * fA4 - mat.matrix[13] * fA2 + mat.matrix[15] * fA0,
				 - mat.matrix[ 8] * fA4 + mat.matrix[ 9] * fA2 - mat.matrix[11] * fA0,
				 - mat.matrix[ 4] * fB3 + mat.matrix[ 5] * fB1 - mat.matrix[ 6] * fB0,
				   mat.matrix[ 0] * fB3 - mat.matrix[ 1] * fB1 + mat.matrix[ 2] * fB0,
				 - mat.matrix[12] * fA3 + mat.matrix[13] * fA1 - mat.matrix[14] * fA0,
				   mat.matrix[ 8] * fA3 - mat.matrix[ 9] * fA1 + mat.matrix[10] * fA0]);
				   
		return mat;
	}

	// Multiply the matrix by a scalar factor
	this.multiplyByScalar = function(scalar)
	{
		if (!isNaN(scalar))
		{
			// Multiply each variable
			for (var i = 0; i < 16; i++)
			{
				matrix[i] *= scalar;
			}
		}
	}

	// Divide the matrix by a scalar factor
	this.divideByScalar = function(scalar)
	{
		// Divide the matrix by scalar
		if (!isNaN(scalar))
		{
			this.multiplyByScalar(mat, 1 / scalar);		
		}
	}

	// Multiply two matricies together
	this.multiplyByMatrix = function(mat)
	{
		var newMat = new Matrix();

		// Check to see if the value being passed is a Matrix
		if (!(mat instanceof Matrix))
		{
			return newMat;
		}
		
		newMat.matrix[0] = (matrix[ 0] * mat.matrix[ 0] +
							matrix[ 1] * mat.matrix[ 4] +
							matrix[ 2] * mat.matrix[ 8] +
							matrix[ 3] * mat.matrix[12]);

		newMat.matrix[1] = (matrix[ 0] * mat.matrix[ 1] +
							matrix[ 1] * mat.matrix[ 5] +
							matrix[ 2] * mat.matrix[ 9] +
							matrix[ 3] * mat.matrix[13]);

		newMat.matrix[2] = (matrix[ 0] * mat.matrix[ 2] +
							matrix[ 1] * mat.matrix[ 6] +
							matrix[ 2] * mat.matrix[10] +
							matrix[ 3] * mat.matrix[14]);

		newMat.matrix[3] = (matrix[ 0] * mat.matrix[ 3] +
							matrix[ 1] * mat.matrix[ 7] +
							matrix[ 2] * mat.matrix[11] +
							matrix[ 3] * mat.matrix[15]);

		newMat.matrix[4] = (matrix[ 4] * mat.matrix[ 0] +
							matrix[ 5] * mat.matrix[ 4] +
							matrix[ 6] * mat.matrix[ 8] +
							matrix[ 7] * mat.matrix[12]);

		newMat.matrix[5] = (matrix[ 4] * mat.matrix[ 1] +
							matrix[ 5] * mat.matrix[ 5] +
							matrix[ 6] * mat.matrix[ 9] +
							matrix[ 7] * mat.matrix[13]);

		newMat.matrix[6] = (matrix[ 4] * mat.matrix[ 2] +
							matrix[ 5] * mat.matrix[ 6] +
							matrix[ 6] * mat.matrix[10] +
							matrix[ 7] * mat.matrix[14]);

		newMat.matrix[7] = (matrix[ 4] * mat.matrix[ 3] +
							matrix[ 5] * mat.matrix[ 7] +
							matrix[ 6] * mat.matrix[11] +
							matrix[ 7] * mat.matrix[15]);

		newMat.matrix[8] = (matrix[ 8] * mat.matrix[ 0] +
							matrix[ 9] * mat.matrix[ 4] +
							matrix[10] * mat.matrix[ 8] +
							matrix[11] * mat.matrix[12]);

		newMat.matrix[9] = (matrix[ 8] * mat.matrix[ 1] +
							matrix[ 9] * mat.matrix[ 5] +
							matrix[10] * mat.matrix[ 9] +
							matrix[11] * mat.matrix[13]);

		newMat.matrix[10] = (matrix[ 8] * mat.matrix[ 2] +
							matrix[ 9] * mat.matrix[ 6] +
							matrix[10] * mat.matrix[10] +
							matrix[11] * mat.matrix[14]);

		newMat.matrix[11] = (matrix[ 8] * mat.matrix[ 3] +
							matrix[ 9] * mat.matrix[ 7] +
							matrix[10] * mat.matrix[11] +
							matrix[11] * mat.matrix[15]);

		newMat.matrix[12] = (matrix[12] * mat.matrix[ 0] +
							matrix[13] * mat.matrix[ 4] +
							matrix[14] * mat.matrix[ 8] +
							matrix[15] * mat.matrix[12]);

		newMat.matrix[13] = (matrix[12] * mat.matrix[ 1] +
							matrix[13] * mat.matrix[ 5] +
							matrix[14] * mat.matrix[ 9] +
							matrix[15] * mat.matrix[13]);

		newMat.matrix[14] = (matrix[12] * mat.matrix[ 2] +
							matrix[13] * mat.matrix[ 6] +
							matrix[14] * mat.matrix[10] +
							matrix[15] * mat.matrix[14]);

		newMat.matrix[15] = (matrix[12] * mat.matrix[ 3] +
							matrix[13] * mat.matrix[ 7] +
							matrix[14] * mat.matrix[11] +
							matrix[15] * mat.matrix[15]);
	    
		return newMat;		
	}

	// Multiply a Vector by a Matrix
	this.multiplyByVector = function(vec)
	{
		newVec = new Vector();
			
		if (vec instanceof Vector)
		{
			newVec.setX(matrix[ 0] * vec.getX() + matrix[ 1] * vec.getY() + matrix[ 2] * vec.getZ());
			newVec.setY(matrix[ 4] * vec.getX() + matrix[ 5] * vec.getY() + matrix[ 6] * vec.getZ());
			newVec.setZ(matrix[ 8] * vec.getX() + matrix[ 9] * vec.getY() + matrix[10] * vec.getZ());
		}
		
		return newVec;
	}

	// Add two matricies together
	this.addMatrix = function(mat)
	{
		var m = new Matrix();
		
		if (mat instanceof Matrix)
		{
			for (var i = 0; i < 16; i++)
			{
				// Add each value of the matrix to its counterpart
				m.matrix[i] = matrix[i] + mat.matrix[i];
			}		
		}

		return m;
	}

	// Subtract the values of two matricies
	this.subtractMatrix = function(mat)
	{
		var m = new Matrix();
		
		if (mat instanceof Matrix)
		{
			for (var i = 0; i < 16; i++)
			{
				// Add each value of the matrix to its counterpart
				m.matrix[i] = matrix[i] - mat.matrix[i];
			}		
		}

		return m;
	}
}
