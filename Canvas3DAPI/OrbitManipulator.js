/*
 * Orbit Manipulator
 */

function OrbitManipulator (canvasElement, glContext, redrawFunction)
{
    this.canvas = canvasElement;
    this.gl = glContext;
    this.redrawFunction = redrawFunction;

    this.updateMatrix();
    this.redrawFunction(this.mvMatrix);

    var self = this;
    canvasElement.addEventListener('mousedown', function (evt) { return self.onMouseDown(evt); }, false);
    canvasElement.addEventListener('mouseup', function (evt) { return self.onMouseUp(evt); }, false);
    canvasElement.addEventListener('mousemove', function (evt) { return self.onMouseMove(evt); }, false);
    canvasElement.addEventListener('mousein', function (evt) { return self.onMouseIn(evt); }, false);
    canvasElement.addEventListener('mouseout', function (evt) { return self.onMouseOut(evt); }, false);
    canvasElement.addEventListener('DOMMouseScroll', function (evt) { return self.onMouseScroll(evt); }, false);
}

function xevtpos(evt) {
    return 2 * ((evt.clientX + document.body.scrollLeft) / evt.target.width) - 1;
}

function yevtpos(evt) {
    return 2 * ((evt.clientY + document.body.scrollTop)  / evt.target.height) - 1;
}

OrbitManipulator.prototype = {
    distance: 8.0,
    rotX: 0.0, 
    rotY: 0.0,
    tX: 0.0,
    tY: 0.0,

    rotating: false,
    zooming: false,
    translating: false,

    dragging: false,

    onMouseDown: function(evt) {
        var x = xevtpos(evt);
        var y = yevtpos(evt);

        switch (evt.button) {
            case 0:
                this.rotating = true;
                this.rstart = [x, y];
                break;
        }

        this.dragging = this.rotating || this.translating || this.zooming;

        evt.preventDefault();
        return true;
    },

    onMouseUp: function(evt) {
        if (!this.dragging)
            return false;

        this.rotating = false;
        this.translating = false;
        this.zooming = false;

        this.dragging = false;
    },

    onMouseMove: function(evt) {
        if (!this.dragging)
            return false;

        var x = xevtpos(evt);
        var y = yevtpos(evt);

        if (this.rotating) {
            this.rotX += x - this.rstart[0];
            this.rotY += y - this.rstart[1];
            this.rstart = [x, y];
        }

        this.updateMatrix();
        this.redrawFunction(this.mvMatrix);

        evt.preventDefault();
        return true;
    },

    onMouseIn: function(evt) {
        return false;
    },

    onMouseOut: function(evt) {
        this.onMouseUp(evt);
        return false;
    },

    onMouseScroll: function(evt) {
        if (evt.detail > 0) {
            this.distance *= 1.1;
        } else {
            this.distance *= 0.9;
        }
        this.updateMatrix();
        this.redrawFunction(this.mvMatrix);

        evt.preventDefault();
        return true;
    },


    updateMatrix: function() {
        var m = makeLookAt(0, this.distance, 0,
                           0, 0, 0,
                           0, 0, -1);
        var rx = Matrix.RotationX(((-65 + this.rotY * this.canvas.height / 5) % 360) * Math.PI / 180.0).ensure4x4();
        var rz = Matrix.RotationY(((this.rotX * this.canvas.width / 5) % 360) * Math.PI / 180.0).ensure4x4();

        this.mvMatrix = m.x(rx).x(rz);
    },
};
