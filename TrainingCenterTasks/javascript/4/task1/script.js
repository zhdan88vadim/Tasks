'use strict';

function Vector(x, y, z) {
	var length = 0;
	this.x = x;
	this.y = y;
	this.z = z;

	Object.defineProperty(this, 'length', {
		get: function() {
			console.log('get length');
			return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
		}
	});
}

Vector.prototype.plus = function(vector) {
	var x = this.x + vector.x;
	var y = this.y + vector.y;
	var z = this.z + vector.z;

	return new Vector(x, y, z);
}

Vector.prototype.scalar = function(vector) {
	return this.x * vector.x + this.y * vector.y + this.z * vector.z;
}

Vector.prototype.toString = function() {
	return 'Vector: x: ' + this.x + '; y: ' + this.y + '; z: ' + this.z + ' ; length: ' + this.length;
}

Vector.prototype.valueOf = function() {
	return this.length;
}

/* Test */

var vector0 = new Vector(2, 4, 6);
var vector1 = new Vector(2, 2, 2);


console.log(vector0);
console.log('-- ^ vector0 --');
console.log(vector1);
console.log('-- ^ vector1 --');

var vectorPlus = vector0.plus(vector1);
console.log(vectorPlus);
console.log('-- ^ vector0.plus(vector1) --');


var vectorScalar = vector0.scalar(vector1);
console.log(vectorScalar);
console.log('-- ^ vector0.scalar(vector1) --');


console.log(vector0.length);
console.log('-- ^ vector0.length --');

console.log(vector1.length);
console.log('-- ^ vector1.length --');


try {
	vector1.length = 555;
}
catch(er) {
	console.log(er);
}

console.log(vector1.length);
console.log('-- ^ vector1.length --');

console.log(vector1.toString());
console.log('-- ^ vector1.toString() --');

console.log(vector1.valueOf());
console.log('-- ^ vector1.valueOf() --');