
'use strict';

var promise = new Promise(function(resolve, reject) {
	setTimeout(function() {
		//resolve('data resolve');
		reject('data reject');
	}, 1000)
});

promise.then(function(data) {
	console.log(data);
},
function(data) {
	console.log(data);
});

// ---------------------


// var p = new Promise(function(resolve, reject) {
// 	setTimeout(function() {
// 		//resolve('data resolve');
// 		throw new Error("Text error");
// 	}, 1000)
// });

// p.catch(function(data) {
// 	console.log(data);
// });


// ---------------------

// Параллельное выполнение

function timeSleep(delay) {
	var promise = new Promise(function(resolve, reject) {
		setTimeout(function() {
			console.log('timeSleep resolve; delay: ' + delay);
			resolve('timeSleep resolve; delay: ' + delay);
		}, delay)
	});
	return promise;
}


// var result = Promise.all([timeSleep(1000), timeSleep(5000), timeSleep(3000)]).then(function() {
// 		console.log('resolve all');
// 	});

// console.log('result');
// console.log(result);

// ---------------------


var result = Promise.race([timeSleep(1000), timeSleep(5000), timeSleep(3000)]).then(function() {
		console.log('resolve all');
	});

console.log('result');
console.log(result);

