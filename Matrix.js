/*Copyright (c) 2008 Seneca College

Licenced under the MIT License (http://www.c3dl.org/index.php/mit-license/)
*/
// Written By:		Mark Paruzel
// Date:			April 11, 2008
// Project:			Canvas 3D Library

// -----------------------------------------------------------------------------
// NOTE: This group of functions act uppon an array of sixteen values which
//       represent a Matrix Orientation. How a Matrix Works:
//
//       - An Orientation uses the 3 Axis in a 3D world: Up, Forward and Left 
//         (Right handed system).
//       - A 4x4 Matrix adds in a Translation into the matrix along with an 
//         Orientation.
// 
//       +-                             -+
//       |  Right.x, Up.x, Fwd.x, Pos.x  |
//       |  Right.y, Up.y, Fwd.y, Pos.y  |
//       |  Right.z, Up.z, Fwd.z, Pos.z  |
//       |  0.0,     0.0,  0.0,   1.0    |
//       +-                             -+
//
//       Array Indices:
//       +-               -+
//       |  0,  4,  8, 12  |
//       |  1,  5,  9, 13  |
//       |  2,  6, 10, 14  |
//       |  3,  7, 11, 15  |
//       +-               -+
// -----------------------------------------------------------------------------

function isValidMatrix(mat)
{
	// Check if the value being passed is an array
	if (mat instanceof Array)
	{
		// Must be array of 16 Values
		if (mat.length == 16)
		{
			for (var i = 0; i < 16; i++)
			{
				// Check for Bad values
				if (isNaN(mat[i])) return false;
			}

			return true;
		}
	}
	
	return false;
}

// -----------------------------------------------------------------------------

function makeIdentityMatrix()
{
	var mat = new Array(16);
	
	mat = [1.0, 0.0, 0.0, 0.0, 
		   0.0, 1.0, 0.0, 0.0, 
		   0.0, 0.0, 1.0, 0.0, 
		   0.0, 0.0, 0.0, 1.0];
	
	return mat;
}

// -----------------------------------------------------------------------------

function makeZeroMatrix()
{
	var mat = new Array(16);
	
	mat = [0.0, 0.0, 0.0, 0.0, 
		   0.0, 0.0, 0.0, 0.0, 
		   0.0, 0.0, 0.0, 0.0, 
		   0.0, 0.0, 0.0, 0.0];
	
	return mat;
}

function makeMatrix(e00, e01, e02, e03, e10, e11, e12, e13, e20, e21, e22, e23, e30, e31, e32, e33)
{
	var mat = new Array(!isNaN(e00) ? parseFloat(e00) : 0.0,
						!isNaN(e01) ? parseFloat(e01) : 0.0,
						!isNaN(e02) ? parseFloat(e02) : 0.0,
						!isNaN(e03) ? parseFloat(e03) : 0.0,
						!isNaN(e10) ? parseFloat(e10) : 0.0,
						!isNaN(e11) ? parseFloat(e11) : 0.0,
						!isNaN(e12) ? parseFloat(e12) : 0.0,
						!isNaN(e13) ? parseFloat(e13) : 0.0,
						!isNaN(e20) ? parseFloat(e20) : 0.0,
						!isNaN(e21) ? parseFloat(e21) : 0.0,
						!isNaN(e22) ? parseFloat(e22) : 0.0,
						!isNaN(e23) ? parseFloat(e23) : 0.0,
						!isNaN(e30) ? parseFloat(e30) : 0.0,
						!isNaN(e31) ? parseFloat(e31) : 0.0,
						!isNaN(e32) ? parseFloat(e32) : 0.0,
						!isNaN(e33) ? parseFloat(e33) : 0.0);
	return mat;
}

// -----------------------------------------------------------------------------

function makePoseMatrix(vecLeft, vecUp, vecFrwd, vecPos)
{
	if (isValidVector(vecLeft) && 
		isValidVector(vecUp) && 
		isValidVector(vecFrwd) && 
		isValidVector(vecPos))
	{
		var mat = makeZeroMatrix();
		// +-                            -+
		// |  Left.x, Up.x, Fwd.x, Pos.x  |
		// |  Left.y, Up.y, Fwd.y, Pos.y  |
		// |  Left.z, Up.z, Fwd.z, Pos.z  |
		// |  0.0,    0.0,  0.0,   1.0    |
		// +-                            -+
		
		// Left
		mat[0] = vecLeft[0];
		mat[4] = vecLeft[1];
		mat[8] = vecLeft[2];
		
		// Up
		mat[1] = vecUp[0];
		mat[5] = vecUp[1];
		mat[9] = vecUp[2];
		
		// Forward
		mat[2] = vecFrwd[0];
		mat[6] = vecFrwd[1];
		mat[10] = vecFrwd[2];
		
		// Position
		mat[3] = vecPos[0];
		mat[7] = vecPos[1];
		mat[11] = vecPos[2];
		
		return mat;
	}
	
	logWarning('makePoseMatrix() called with a parameters that are not valid');
	return null;	
}

// -----------------------------------------------------------------------------

function transposeMatrix(mat)
{
	if (isValidMatrix(mat))
	{
		var newMat = new Array(16);
		
		// Transpose this matrix
		newMat = [mat[0], mat[4], mat[8],  mat[12],
				  mat[1], mat[5], mat[9],  mat[13],
				  mat[2], mat[6], mat[10], mat[14],
				  mat[3], mat[7], mat[11], mat[15]];
				  
		return newMat;
	}
	
	logWarning('transposeMatrix() called with a parameter that is not a proper Matrix');
	return null;
}

// -----------------------------------------------------------------------------

function inverseMatrix(mat)
{
	if (isValidMatrix(mat))
	{
		var kInv = new Array(16);
		var fA0 = mat[ 0] * mat[ 5] - mat[ 1] * mat[ 4];
		var fA1 = mat[ 0] * mat[ 6] - mat[ 2] * mat[ 4];
		var fA2 = mat[ 0] * mat[ 7] - mat[ 3] * mat[ 4];
		var fA3 = mat[ 1] * mat[ 6] - mat[ 2] * mat[ 5];
		var fA4 = mat[ 1] * mat[ 7] - mat[ 3] * mat[ 5];
		var fA5 = mat[ 2] * mat[ 7] - mat[ 3] * mat[ 6];
		var fB0 = mat[ 8] * mat[13] - mat[ 9] * mat[12];
		var fB1 = mat[ 8] * mat[14] - mat[10] * mat[12];
		var fB2 = mat[ 8] * mat[15] - mat[11] * mat[12];
		var fB3 = mat[ 9] * mat[14] - mat[10] * mat[13];
		var fB4 = mat[ 9] * mat[15] - mat[11] * mat[13];
		var fB5 = mat[10] * mat[15] - mat[11] * mat[14];

		// Determinant
		var fDet = fA0 * fB5 - fA1 * fB4 + fA2 * fB3 + fA3 * fB2 - fA4 * fB1 + fA5 * fB0;
		
		// Account for a very small value
		if (Math.abs(fDet) <= 0.001)
		{
			logWarning('inverseMatrix() failed due to bad values');
			return null;
		}

		kInv[ 0] = + mat[ 5] * fB5 - mat[ 6] * fB4 + mat[ 7] * fB3;
		kInv[ 4] = - mat[ 4] * fB5 + mat[ 6] * fB2 - mat[ 7] * fB1;
		kInv[ 8] = + mat[ 4] * fB4 - mat[ 5] * fB2 + mat[ 7] * fB0;
		kInv[12] = - mat[ 4] * fB3 + mat[ 5] * fB1 - mat[ 6] * fB0;
		kInv[ 1] = - mat[ 1] * fB5 + mat[ 2] * fB4 - mat[ 3] * fB3;
		kInv[ 5] = + mat[ 0] * fB5 - mat[ 2] * fB2 + mat[ 3] * fB1;
		kInv[ 9] = - mat[ 0] * fB4 + mat[ 1] * fB2 - mat[ 3] * fB0;
		kInv[13] = + mat[ 0] * fB3 - mat[ 1] * fB1 + mat[ 2] * fB0;
		kInv[ 2] = + mat[13] * fA5 - mat[14] * fA4 + mat[15] * fA3;
		kInv[ 6] = - mat[12] * fA5 + mat[14] * fA2 - mat[15] * fA1;
		kInv[10] = + mat[12] * fA4 - mat[13] * fA2 + mat[15] * fA0;
		kInv[14] = - mat[12] * fA3 + mat[13] * fA1 - mat[14] * fA0;
		kInv[ 3] = - mat[ 9] * fA5 + mat[10] * fA4 - mat[11] * fA3;
		kInv[ 7] = + mat[ 8] * fA5 - mat[10] * fA2 + mat[11] * fA1;
		kInv[11] = - mat[ 8] * fA4 + mat[ 9] * fA2 - mat[11] * fA0;
		kInv[15] = + mat[ 8] * fA3 - mat[ 9] * fA1 + mat[10] * fA0;

		// Inverse using Determinant
		var fInvDet = 1.0 / fDet;
		kInv[ 0] *= fInvDet;
		kInv[ 1] *= fInvDet;
		kInv[ 2] *= fInvDet;
		kInv[ 3] *= fInvDet;
		kInv[ 4] *= fInvDet;
		kInv[ 5] *= fInvDet;
		kInv[ 6] *= fInvDet;
		kInv[ 7] *= fInvDet;
		kInv[ 8] *= fInvDet;
		kInv[ 9] *= fInvDet;
		kInv[10] *= fInvDet;
		kInv[11] *= fInvDet;
		kInv[12] *= fInvDet;
		kInv[13] *= fInvDet;
		kInv[14] *= fInvDet;
		kInv[15] *= fInvDet;

		// Check if our matrix is correct
		if (isValidMatrix(kInv))
		{
			return kInv;
		}

		// Just in case the calculation fails, return a null
		logWarning('inverseMatrix() failed due to math errors');
		return null;	
	}
	
	logWarning('inverseMatrix() called with a parameter that is not a proper Matrix');
	return null;

}

// -----------------------------------------------------------------------------

function matrixDeterminant(mat)
{
	if (isValidMatrix(mat))
	{
		var fA0 = mat[ 0] * mat[ 5] - mat[ 1] * mat[ 4];
		var fA1 = mat[ 0] * mat[ 6] - mat[ 2] * mat[ 4];
		var fA2 = mat[ 0] * mat[ 7] - mat[ 3] * mat[ 4];
		var fA3 = mat[ 1] * mat[ 6] - mat[ 2] * mat[ 5];
		var fA4 = mat[ 1] * mat[ 7] - mat[ 3] * mat[ 5];
		var fA5 = mat[ 2] * mat[ 7] - mat[ 3] * mat[ 6];
		var fB0 = mat[ 8] * mat[13] - mat[ 9] * mat[12];
		var fB1 = mat[ 8] * mat[14] - mat[10] * mat[12];
		var fB2 = mat[ 8] * mat[15] - mat[11] * mat[12];
		var fB3 = mat[ 9] * mat[14] - mat[10] * mat[13];
		var fB4 = mat[ 9] * mat[15] - mat[11] * mat[13];
		var fB5 = mat[10] * mat[15] - mat[11] * mat[14];
		
		// Construct the Determinant
		var fDet = fA0 * fB5 - fA1 * fB4 + fA2 * fB3 + fA3 * fB2 - fA4 * fB1 + fA5 * fB0;
		
		return fDet;	
	}
	
	logWarning('matrixDeterminant() called with a parameter that is not a proper Matrix');
	return null;	
}

// -----------------------------------------------------------------------------

function matrixAdjoint(mat)
{
	if (isValidMatrix(mat))
	{
		var mat = new Array(16);
		var fA0 = mat[ 0] * mat[ 5] - mat[ 1] * mat[ 4];
		var fA1 = mat[ 0] * mat[ 6] - mat[ 2] * mat[ 4];
		var fA2 = mat[ 0] * mat[ 7] - mat[ 3] * mat[ 4];
		var fA3 = mat[ 1] * mat[ 6] - mat[ 2] * mat[ 5];
		var fA4 = mat[ 1] * mat[ 7] - mat[ 3] * mat[ 5];
		var fA5 = mat[ 2] * mat[ 7] - mat[ 3] * mat[ 6];
		var fB0 = mat[ 8] * mat[13] - mat[ 9] * mat[12];
		var fB1 = mat[ 8] * mat[14] - mat[10] * mat[12];
		var fB2 = mat[ 8] * mat[15] - mat[11] * mat[12];
		var fB3 = mat[ 9] * mat[14] - mat[10] * mat[13];
		var fB4 = mat[ 9] * mat[15] - mat[11] * mat[13];
		var fB5 = mat[10] * mat[15] - mat[11] * mat[14];

		// Adjoint
		mat = [  mat[ 5] * fB5 - mat[ 6] * fB4 + mat[ 7] * fB3,
			   - mat[ 1] * fB5 + mat[ 2] * fB4 - mat[ 3] * fB3,
				 mat[13] * fA5 - mat[14] * fA4 + mat[15] * fA3,
			   - mat[ 9] * fA5 + mat[10] * fA4 - mat[11] * fA3,
			   - mat[ 4] * fB5 + mat[ 6] * fB2 - mat[ 7] * fB1,
			     mat[ 0] * fB5 - mat[ 2] * fB2 + mat[ 3] * fB1,
			   - mat[12] * fA5 + mat[14] * fA2 - mat[15] * fA1,
			     mat[ 8] * fA5 - mat[10] * fA2 + mat[11] * fA1,
			     mat[ 4] * fB4 - mat[ 5] * fB2 + mat[ 7] * fB0,
			   - mat[ 0] * fB4 + mat[ 1] * fB2 - mat[ 3] * fB0,
			     mat[12] * fA4 - mat[13] * fA2 + mat[15] * fA0,
			   - mat[ 8] * fA4 + mat[ 9] * fA2 - mat[11] * fA0,
			   - mat[ 4] * fB3 + mat[ 5] * fB1 - mat[ 6] * fB0,
			     mat[ 0] * fB3 - mat[ 1] * fB1 + mat[ 2] * fB0,
			   - mat[12] * fA3 + mat[13] * fA1 - mat[14] * fA0,
			     mat[ 8] * fA3 - mat[ 9] * fA1 + mat[10] * fA0];
				   
		return mat;
	}
	
	logWarning('matrixAdjoint() called with a parameter that is not a proper Matrix');
	return null;
}

// -----------------------------------------------------------------------------

function multiplyMatrixByScalar(mat, scalar)
{
	var matrix = new Array(16);
	
	if (isValidMatrix(mat) && !isNaN(scalar))
	{
		// Multiply each variable
		for (var i = 0; i < 16; i++)
		{
			matrix[i] = mat[i] * scalar;
		}
	
		return matrix;
	}
	
	logWarning('multiplyMatrixByScalar() called with a parameters that are invalid');
	return null;	
}

// -----------------------------------------------------------------------------

function divideMatrixByScalar(mat, scalar)
{
	var matrix = new Array(16);
	
	if (isValidMatrix(mat) && !isNaN(scalar) && scalar != 0.0)
	{
		// Multiply each variable
		for (var i = 0; i < 16; i++)
		{
			matrix[i] = mat[i] / scalar;
		}
	
		return matrix;
	}
	
	logWarning('multiplyMatrixByScalar() called with a parameters that are invalid');
	return null;	
}

// -----------------------------------------------------------------------------

function multiplyMatrixByMatrix(matOne, matTwo)
{
	var newMat = new Array(16);

	// Check to see if the value being passed is a Matrix
	if (!isValidMatrix(matOne) || !isValidMatrix(matTwo))
	{
		logWarning('multiplyMatrixByMatrix() called with a invalid parameters');
		return null;
	}
	
	// Do the multiplication
	newMat[ 0] = (matOne[ 0] * matTwo[ 0] + matOne[ 1] * matTwo[ 4] + matOne[ 2] * matTwo[ 8] + matOne[ 3] * matTwo[12]);
	newMat[ 1] = (matOne[ 0] * matTwo[ 1] + matOne[ 1] * matTwo[ 5] + matOne[ 2] * matTwo[ 9] + matOne[ 3] * matTwo[13]);
	newMat[ 2] = (matOne[ 0] * matTwo[ 2] + matOne[ 1] * matTwo[ 6] + matOne[ 2] * matTwo[10] + matOne[ 3] * matTwo[14]);
	newMat[ 3] = (matOne[ 0] * matTwo[ 3] + matOne[ 1] * matTwo[ 7] + matOne[ 2] * matTwo[11] + matOne[ 3] * matTwo[15]);
	newMat[ 4] = (matOne[ 4] * matTwo[ 0] + matOne[ 5] * matTwo[ 4] + matOne[ 6] * matTwo[ 8] + matOne[ 7] * matTwo[12]);
	newMat[ 5] = (matOne[ 4] * matTwo[ 1] + matOne[ 5] * matTwo[ 5] + matOne[ 6] * matTwo[ 9] + matOne[ 7] * matTwo[13]);
	newMat[ 6] = (matOne[ 4] * matTwo[ 2] + matOne[ 5] * matTwo[ 6] + matOne[ 6] * matTwo[10] + matOne[ 7] * matTwo[14]);
	newMat[ 7] = (matOne[ 4] * matTwo[ 3] + matOne[ 5] * matTwo[ 7] + matOne[ 6] * matTwo[11] + matOne[ 7] * matTwo[15]);
	newMat[ 8] = (matOne[ 8] * matTwo[ 0] + matOne[ 9] * matTwo[ 4] + matOne[10] * matTwo[ 8] + matOne[11] * matTwo[12]);
	newMat[ 9] = (matOne[ 8] * matTwo[ 1] + matOne[ 9] * matTwo[ 5] + matOne[10] * matTwo[ 9] + matOne[11] * matTwo[13]);
	newMat[10] = (matOne[ 8] * matTwo[ 2] + matOne[ 9] * matTwo[ 6] + matOne[10] * matTwo[10] + matOne[11] * matTwo[14]);
	newMat[11] = (matOne[ 8] * matTwo[ 3] + matOne[ 9] * matTwo[ 7] + matOne[10] * matTwo[11] + matOne[11] * matTwo[15]);
	newMat[12] = (matOne[12] * matTwo[ 0] + matOne[13] * matTwo[ 4] + matOne[14] * matTwo[ 8] + matOne[15] * matTwo[12]);
	newMat[13] = (matOne[12] * matTwo[ 1] + matOne[13] * matTwo[ 5] + matOne[14] * matTwo[ 9] + matOne[15] * matTwo[13]);
	newMat[14] = (matOne[12] * matTwo[ 2] + matOne[13] * matTwo[ 6] + matOne[14] * matTwo[10] + matOne[15] * matTwo[14]);
	newMat[15] = (matOne[12] * matTwo[ 3] + matOne[13] * matTwo[ 7] + matOne[14] * matTwo[11] + matOne[15] * matTwo[15]);

	if (isValidMatrix(newMat))
	{
		return newMat;
	}else{
		logWarning('multiplyMatrixByMatrix() matrix multiplication error');
		return null;
	}
}

// -----------------------------------------------------------------------------

function multiplyMatrixByVector(mat, vec)
{
	if (isValidMatrix(mat) && isValidVector(vec))
	{
		newVec = new Array(3);
			
		newVec[0] = (mat[ 0] * vec[0] + mat[ 1] * vec[1] + mat[ 2] * vec[2]);
		newVec[1] = (mat[ 4] * vec[0] + mat[ 5] * vec[1] + mat[ 6] * vec[2]);
		newVec[2] = (mat[ 8] * vec[0] + mat[ 9] * vec[1] + mat[10] * vec[2]);
		
		return newVec;	
	}
	
	logWarning('multiplyMatrixByVector() called with invalid parameters');
	return null;
}

// -----------------------------------------------------------------------------

function addMatrices(matOne, matTwo)
{
	if (isValidMatrix(matOne) && isValidMatrix(matTwo))
	{
		var m = new Array(16);
		
		for (var i = 0; i < 16; i++)
		{
			// Add each value of the matrix to its counterpart
			m[i] = matOne[i] + matTwo[i];
		}		

		return m;
	}
	
	logWarning('addMatrices() called with invalid parameters');
	return null;
}

// -----------------------------------------------------------------------------

function subtractMatrices(matOne, matTwo)
{
	if (isValidMatrix(matOne) && isValidMatrix(matTwo))
	{
		var m = new Array(16);
		
		for (var i = 0; i < 16; i++)
		{
			// Add each value of the matrix to its counterpart
			m[i] = matOne[i] - matTwo[i];
		}		

		return m;
	}
	
	logWarning('subtractMatrices() called with invalid parameters');
	return null;

}

// -----------------------------------------------------------------------------
