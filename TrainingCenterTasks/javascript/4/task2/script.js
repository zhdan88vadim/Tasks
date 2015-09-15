'use strict';

/* Task */

function Task(config) {
	this.name = config.name;
	this.description = config.description;
	this.dateStart = config.dateStart;
	this.dateEnd = config.dateEnd;
	this.childTasks = [];
}

Task.prototype.addSubTask = function(task) {
	this.childTasks.push(task);
}
Task.prototype.toString = function() {
	return 'This method from Task class.';
}


/* TaskRunning */

function TaskRunning(config) {
	Task.call(this, config);
	
	this.compleatePercent = config.compleatePercent || 0;
	this.isCompleated = config.isCompleated || false;
}

TaskRunning.prototype = Object.create(Task.prototype);


// Warning!! Для того, чтобь ссылка была на реальный конструктор, а не на 
// конструктор родителя!!

TaskRunning.prototype.constructor = TaskRunning;

// __proto__: Object
//		__proto__: Task
// 		addSubTask: (task)
// 		constructor: Task(config)
// 		toString: ()
// 		__proto__: Object

// OR

// var TempFunction = function() {}
// TempFunction.prototype = Task.prototype;

// TaskRunning.prototype = new TempFunction();


// __proto__: TempFunction
// 		__proto__: Task
// 		addSubTask: (task)
// 		constructor: Task(config)
// 		toString: ()
// 		__proto__: Object




/* Test */


var task = new Task({
	name: 'Main Task Name',
	description: 'Main Task Description',
	dateStart: '12-12-2014',
	dateEnd: '12-12-2015',
});

	var subtask0 = new Task({
		name: 'Sub Task Name 0',
		description: 'Sub Task Name Description',
		dateStart: '12-12-2014',
		dateEnd: '12-12-2015',
	});
	var subtask1 = new Task({
		name: 'Sub Task Name 1',
		description: 'Sub Task Name Description',
		dateStart: '12-12-2014',
		dateEnd: '12-12-2015',
	});

task.addSubTask(subtask0);
task.addSubTask(subtask1);



var taskRunning = new TaskRunning({
	name: 'TaskRunning Name',
	description: 'Task description',
	dateStart: '12-12-2014',
	dateEnd: '12-12-2015',
	//compleatePercent: 56
});

taskRunning.addSubTask(task);



// taskRunning instanceof TaskRunning
// true
// taskRunning instanceof Task
// true



