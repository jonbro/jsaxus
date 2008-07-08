/*Copyright (c) 2008 Seneca College

Licenced under the MIT License (http://www.c3dl.org/index.php/mit-license/)
*/
// Written By:		Mark Paruzel
// Date:			March 23, 2008
// Project:			Canvas 3D Library

// -----------------------------------------------------------------------------
// NOTE: This group of functions act uppon an array of three values which
//       represent a vector in 3D space. The values of the array each hold the
//       values of the X, Y, and Z coordinates on each axis. 
// -----------------------------------------------------------------------------

function isValidVector(vecArr)
{
	// Check if the value being passed is an array
	if (vecArr instanceof Array)
	{
		// Must be array of 3 Values
		if (vecArr.length == 3)
		{
			for (var i = 0; i < 3; i++)
			{
				// Check for Bad values
				if (isNaN(vecArr[i]))
					return false;
			}

			return true;
		}
	}
	
	return false;
}

// -----------------------------------------------------------------------------

function makeVector(newX, newY, newZ)
{
	var vec = new Array(!isNaN(newX) ? parseFloat(newX) : 0.0,
						!isNaN(newY) ? parseFloat(newY) : 0.0,
						!isNaN(newZ) ? parseFloat(newZ) : 0.0);
	
	return vec;
}

// -----------------------------------------------------------------------------

function normalizeVector(vec)
{
	if (isValidVector(vec))
	{
		var compr = vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2];
		
		// Sometimes this can become invalid
		if (!isNaN(compr))
		{
			var ln = Math.sqrt(compr);

			// If the length is greater then zero, return the normalized Vector
			if (!isNaN(ln) && ln != 0.0)
			{
				// Normalization
				//!! do we really need to make a new one here?
				var newVec = new Array(vec[0] != 0.0 ? vec[0] / ln : 0.0,
									   vec[1] != 0.0 ? vec[1] / ln : 0.0,
									   vec[2] != 0.0 ? vec[2] / ln : 0.0);
				
				return newVec;
			}		
		}
	}

	logWarning('normalizeVector() called with a parameter that\'s not a vector');
	return null;
}

// -----------------------------------------------------------------------------

function vectorDotProduct(vecOne, vecTwo)
{
	// Sanity Check
	if (isValidVector(vecOne) && isValidVector(vecTwo))
	{
		var vOneNorm = normalizeVector(vecOne);
		var vTwoNorm = normalizeVector(vecTwo);
		
		// Dot product of two vectors
		return parseFloat(vOneNorm[0] * vTwoNorm[0] + vOneNorm[1] * vTwoNorm[1] + vOneNorm[2] * vTwoNorm[2]);
	}
	
	logWarning('vectorDotProduct() called with a parameter that\'s not a vector');
	return null;
}

// -----------------------------------------------------------------------------

function vectorCrossProduct(vecOne, vecTwo)
{
	// Sanity Check
	if (isValidVector(vecOne) && isValidVector(vecTwo))
	{
		var thisVec = vecOne;
		var inVec = vecTwo;
		
		// Normalize the Units first            
		normalizeVector(inVec);
		normalizeVector(thisVec);

		// Perform a Cross Product
		var newVec = makeVector((thisVec[1] * inVec[2] - thisVec[2] * inVec[1]),
								(thisVec[2] * inVec[0] - thisVec[0] * inVec[2]),
								(thisVec[0] * inVec[1] - thisVec[1] * inVec[0]));
		
		return newVec;
	}
	
	logWarning('vectorCrossProduct() called with a parameter that\'s not a vector');
	return null;
}

// -----------------------------------------------------------------------------

function vectorLength(vec)
{
	var len;
	
	if (isValidVector(vec))
	{
		// Figure out the length
		len = vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2];
		
		return Math.sqrt(len);
	}

	logWarning('vectorLength() called with a parameter that\'s not a vector');
	return null;	
}

// -----------------------------------------------------------------------------

function vectorLengthSq(vec)
{
	var len;
	
	if (isValidVector(vec))
	{
		// Figure out the length
		len = vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2];
		
		return len;
	}

	logWarning('vectorLengthSq() called with a parameter that\'s not a vector');
	return null;	
}

// -----------------------------------------------------------------------------

function addVectors(vecOne, vecTwo)
{
	if (isValidVector(vecOne) && isValidVector(vecTwo))
	{
		var vec = makeVector(vecOne[0] + vecTwo[0],
							 vecOne[1] + vecTwo[1],
							 vecOne[2] + vecTwo[2]);
		
		return vec;
	}
	
	logWarning('addVectors() called with invalid parameters');
	return null;
}

// -----------------------------------------------------------------------------

function subtractVectors(vecOne, vecTwo)
{
	if (isValidVector(vecOne) && isValidVector(vecTwo))
	{
		var vec = makeVector(vecOne[0] - vecTwo[0],
							 vecOne[1] - vecTwo[1],
							 vecOne[2] - vecTwo[2]);
		
		return vec;
	}
	
	logWarning('subtractVectors() called with invalid parameters');
	return null;
}

// -----------------------------------------------------------------------------

function multiplyVector(vec, scalar)
{
	if (isValidVector(vec) && !isNaN(scalar))
	{
		var newVec = makeVector(vec[0] * scalar,
		 						vec[1] * scalar,
		 						vec[2] * scalar);
		
		return newVec;
	}
	
	logWarning('multiplyVector() called with invalid parameters');
	return null;
}

// -----------------------------------------------------------------------------

function divideVector(vec, scalar)
{
	if (isValidVector(vec) && !isNaN(scalar))
	{
		var newVec = makeVector(vec[0] / scalar,
								vec[1] / scalar,
								vec[2] / scalar);
		
		return newVec;
	}
	
	logWarning('divideVector() called with invalid parameters');
	return null;
}

// -----------------------------------------------------------------------------

function multiplyVectorByVector(vecOne, vecTwo)
{
	if (isValidVector(vecOne) && isValidVector(vecTwo))
	{
		var newVec = makeVector(vecOne[0] * vecTwo[0],
								vecOne[1] * vecTwo[1],
								vecOne[2] * vecTwo[2]);
								
		return newVec;
	}
	
	logWarning('multiplyVectorByVector() called with invalid parameters');
	return null;
}

// -----------------------------------------------------------------------------

function isVectorEqual(vecOne, vecTwo)
{
	// Sanity Check
	if (isValidVector(vecOne) && isValidVector(vecTwo))
	{
		return (vecOne[0] == vecTwo[0] && vecOne[1] == vecTwo[1] && vecOne[2] == vecTwo[2]);
	}
	
	logWarning('isVectorEqual() called with invalid parameters');
	return null;
}

// -----------------------------------------------------------------------------

function isVectorZero(vec)
{
	if (isValidVector(vec))
	{
		// Check for a tolerance
		return ((-TOLERANCE < vec[0] && vec[0] < TOLERANCE) && 
				(-TOLERANCE < vec[1] && vec[1] < TOLERANCE) && 
				(-TOLERANCE < vec[2] && vec[2] < TOLERANCE));
	}
	
	return false;
}

// -----------------------------------------------------------------------------