
var gCanvas;
var gl;
var note;

var fs = -1;
var vs = -1;
var sp = -1;

var Manipulator;

/* Calculate normals at each vertex in vertices, by looking
 * at triangles formed by every face and averaging.
 */
function calculateNormals(vertices, faces)
{
    var nvecs = new Array(vertices.length);

    for (var i = 0; i < faces.length; i++) {
        var j0 = faces[i][0];
        var j1 = faces[i][1];
        var j2 = faces[i][2];

        var v1 = $V((vertices[j0]));
        var v2 = $V((vertices[j1]));
        var v3 = $V((vertices[j2]));

        var va = v2.subtract(v1);
        var vb = v3.subtract(v1);

        var n = va.cross(vb).toUnitVector();

        if (!nvecs[j0]) nvecs[j0] = [];
        if (!nvecs[j1]) nvecs[j1] = [];
        if (!nvecs[j2]) nvecs[j2] = [];

        nvecs[j0].push(n);
        nvecs[j1].push(n);
        nvecs[j2].push(n);
    }

    var normals = new Array(vertices.length);

    // now go through and average out everything
    for (var i = 0; i < nvecs.length; i++) {
        var count = nvecs[i].length;
        var x = 0;
        var y = 0;
        var z = 0;

        for (var j = 0; j < count; j++) {
            x += nvecs[i][j].elements[0];
            y += nvecs[i][j].elements[1];
            z += nvecs[i][j].elements[2];
        }

        normals[i] = [x/count, y/count, z/count];
    }

    return normals;
}


function getShader(id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript)
        return null;

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3)
            str += k.textContent;
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, 0x8B81 /*gl.COMPILE_STATUS*/) != 1) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function flatten(ar, numPerElement) {
    var result = [];
    for (var i = 0; i < ar.length; i++) {
        if (numPerElement && ar[i].length != numPerElement)
            throw "bad element inside array";
        for (var j = 0; j < ar[i].length; j++)
            result.push(ar[i][j]);
    }

    return result;
}

var count = 0;

function handleLoad() {
    note = document.getElementById("note");

    gCanvas = document.getElementById("canvas");
    gl = gCanvas.getContext("moz-glweb20");

    if (fs == -1) {
        fs = getShader("shader-fs");
        vs = getShader("shader-vs");

        sp = gl.createProgram();
        gl.attachShader(sp, vs);
        gl.attachShader(sp, fs);

        gl.linkProgram(sp);

        if (gl.getProgramParameter(sp, 0x8B82 /*gl.LINK_STATUS*/) != 1) {
            alert(gl.getProgramInfoLog(shader));
        }

        gl.useProgram(sp);
    }

    var va = gl.getAttribLocation(sp, "Vertex");
    var na = gl.getAttribLocation(sp, "Normal");
    var ca = gl.getAttribLocation(sp, "InColor");

    var mvUniform = gl.getUniformLocation(sp, "MVMatrix");
    var pmUniform = gl.getUniformLocation(sp, "PMatrix");
    var nmUniform = gl.getUniformLocation(sp, "NMatrix");

    var lightPosUniform = gl.getUniformLocation(sp, "LightPos");

    var geomNormals = gGeometry.normals;
    if (!geomNormals || geomNormals.length == 0)
        geomNormals = calculateNormals(gGeometry.vertices, gGeometry.faces);

    var vertices = flatten(gGeometry.vertices, 3);
    var indices = flatten(gGeometry.faces, 3);
    var normals = flatten(geomNormals, 3);

    // triangle
    if (0) {
        vertices = [ -0.4, 0.4, 0.0,
                     0.0, -0.4, 0.0,
                     0.4, 0.4, 0.0 ];
        normals = [ 0, 0, 1,
                    0, 0, 1,
                    0, 0, 1 ];
        indices = [0, 1, 2];
    }

    // cube
    if (0) {
        vertices = [  0.5, -0.5,  0.5, // +X
                      0.5, -0.5, -0.5,
                      0.5,  0.5, -0.5,
                      0.5,  0.5,  0.5,

                      0.5,  0.5,  0.5, // +Y
                      0.5,  0.5, -0.5,
                     -0.5,  0.5, -0.5,
                     -0.5,  0.5,  0.5,

                      0.5,  0.5,  0.5, // +Z
                     -0.5,  0.5,  0.5,
                     -0.5, -0.5,  0.5,
                      0.5, -0.5,  0.5,

                     -0.5, -0.5,  0.5, // -X
                     -0.5,  0.5,  0.5,
                     -0.5,  0.5, -0.5,
                     -0.5, -0.5, -0.5,

                     -0.5, -0.5,  0.5, // -Y
                     -0.5, -0.5, -0.5,
                      0.5, -0.5, -0.5,
                      0.5, -0.5,  0.5,

                     -0.5, -0.5, -0.5, // -Z
                     -0.5,  0.5, -0.5,
                      0.5,  0.5, -0.5,
                      0.5, -0.5, -0.5,
            ];

        normals = [ 1, 0, 0,
                    1, 0, 0,
                    1, 0, 0,
                    1, 0, 0,

                    0, 1, 0,
                    0, 1, 0,
                    0, 1, 0,
                    0, 1, 0,

                    0, 0, 1,
                    0, 0, 1,
                    0, 0, 1,
                    0, 0, 1,

                   -1, 0, 0,
                   -1, 0, 0,
                   -1, 0, 0,
                   -1, 0, 0,

                    0,-1, 0,
                    0,-1, 0,
                    0,-1, 0,
                    0,-1, 0,

                    0, 0,-1,
                    0, 0,-1,
                    0, 0,-1,
                    0, 0,-1
            ];

        indices = [];
        for (var i = 0; i < 6; i++) {
            indices.push(i*4 + 0);
            indices.push(i*4 + 1);
            indices.push(i*4 + 3);
            indices.push(i*4 + 1);
            indices.push(i*4 + 2);
            indices.push(i*4 + 3);
        }
    }

    var color = [];
    for (var i = 0; i < vertices.length/3; i++) {
        color.push(Math.random(1.0));
        color.push(Math.random(1.0));
        color.push(Math.random(1.0));
        color.push(1.0);
    }

    if (va != -1) {
        gl.vertexAttribPointer(va, 3, gl.FLOAT, vertices);
        gl.enableVertexAttribArray(va);
    }

    if (na != -1) {
        gl.vertexAttribPointer(na, 3, gl.FLOAT, normals);
        gl.enableVertexAttribArray(na);
    }

    if (ca != -1) {
        gl.vertexAttribPointer(ca, 4, gl.FLOAT, color);
        gl.enableVertexAttribArray(ca);
    }

    var redraw = function (newMatrix) {
        gl.clearColor(0.8, 0.8, 0.9, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);

        var MV = newMatrix;
        var P = makePerspective(60, 1, 0.1, 100);
        var N = MV.inverse().transpose().make3x3();
        
        var Light = $V([15.0, 15.0, 15.0, 1.0]);

	// Load our modelview, projection, and normal matrices
        gl.uniformMatrix(mvUniform, MV.flatten());
        gl.uniformMatrix(pmUniform, P.flatten());
        gl.uniformMatrix(nmUniform, N.flatten());

	// load our light, if the shader asks for one
        if (lightPosUniform != -1)
            gl.uniformf(lightPosUniform, Light.flatten());

	// do the draw
        gl.drawElements(gl.TRIANGLES, indices.length, indices);
        gl.swapBuffers();

        count++;
        if (count < 0)
            setTimeout(redraw, 100);
    }

    Manipulator = new OrbitManipulator(gCanvas, gl, redraw);
}

window.addEventListener("load", handleLoad, false);
