'use strict';


// provider(provider) - registers a service provider with the $injector


// constant(obj) - registers a value/object that can be accessed by 
// providers and services.


// value(obj) - registers a value/object that can only be accessed 
// by services, not providers.


// factory(fn) - registers a service factory function, fn, that will be
// wrapped in a service provider object, whose $get property will contain
// the given factory function.


// service(class) - registers a constructor function, class that will be 
// wrapped in a service provider object, whose $get property will 
// instantiate a new object using the given constructor function.




var phonecatApp = angular.module('phonecatApp', []);


//https://docs.angularjs.org/api/auto/service/$provide
//  NOTE: the provider will be available under name + 'Provider' key.
//--
//http://habrahabr.ru/post/190342/
//Обратите внимание, что в конфигурационной функции нужно указать 
//в качестве имени nameProvider, а не name. name указывается во всех других случаях.

phonecatApp.config(['mytestprovProvider', '$provide', function(mytestprovProvider, $provider) {

	// Почему нужно использовать эту форму, когда фабрика гораздо проще? 
	// Потому что провайдер можно настроить в конфигурационной функции. 
	// Так что можно сделать что-то вроде этого:

	mytestprovProvider.setPrivate('New value from config');



	//decorator(name, decorator);
	//Register a service decorator with the $injector. A service decorator intercepts 
	// the creation of a service, allowing it to override or modify the behaviour 
	// of the service. The object returned by the decorator may be the original 
	// service, or a new service object which replaces or wraps and delegates to 
	// the original service.

	$provider.decorator('mytestserv', function($delegate) {
		$delegate.newfunction = function() {
			return 'Hello, I am new function';
		}
		return $delegate;
	});


}]);










phonecatApp.controller('PhoneListCtrl', 
	['$scope', 'mytestprov', 'mytestfact', 'myConfig', 'myConstant',
	function($scope, mytestprov, mytestfact, myConfig, myConstant) {

	console.log('Controller PhoneListCtrl');
	
	var result = mytestprov.getPrivate();
	var publicVariable = mytestprov.variable;
	console.log(result);
	console.log(publicVariable);

	var publicVariable = mytestfact.variable;
	console.log(publicVariable);




	console.log(myConfig.config1);
	console.log(myConfig.config2);

	myConfig.config1 = false;
	myConfig.config2 = "this is new value for config 2";

	console.log(myConfig.config1);
	console.log(myConfig.config2);

	// ------------------------------------

	console.log(myConstant.config1);
	console.log(myConstant.config2);

}]);



phonecatApp.controller('TestCtrl', 
	['$scope', 'mytestprov', 'mytestfact', 'mytestserv', 'myConfig', 'myConstant', 
	function($scope, mytestprov, mytestfact, mytestserv, myConfig, myConstant) {
		
	console.log('Controller TestCtrl');


	var result = mytestprov.getPrivate();
	var publicVariable = mytestprov.variable;

	console.log(result);
	console.log(publicVariable);

	mytestfact.variable = 'this is new value set from TestController';

	var publicVariable = mytestfact.variable;
	console.log(publicVariable);

	var publicVariable = mytestserv.variable;
	console.log(publicVariable);


	console.log(myConfig.config1);
	console.log(myConfig.config2);

	myConfig.config1 = false;
	myConfig.config2 = "this is new value for config 2";

	console.log(myConfig.config1);
	console.log(myConfig.config2);

// ------------------------------------

	console.log(myConstant.config1);
	console.log(myConstant.config2);

	console.log('Change CONSTANT');

	myConstant.config1 = false;
	myConstant.config2 = "this is new value for CONSTANT config 2";

	console.log(myConstant.config1);
	console.log(myConstant.config2);


	console.log(mytestserv.newfunction());

}]);









// ***********************************************************************

// http://habrahabr.ru/post/190342/

// Провайдер ожидает функцию $get, которая будет тем, что мы внедряем в другие части 
// нашего приложения. Поэтому, когда мы внедряем foo в контроллер, 
// то внедряется функция $get


phonecatApp.provider('mytestprov', function() {
	var thisIsPrivate = "Private";

	return {


		setPrivate: function(newVal) {
			thisIsPrivate = newVal;
		},

		$get: function() {
			//var thisIsPrivate = "Private"; // OLD

			function getPrivate() {
				return thisIsPrivate;
			}

			return {
				variable: 'This is public from provider',
				getPrivate: getPrivate
			};
		}
	};

});







// ===============================================================================

//Фабрика это сервис, который может вернуть любой тип данных. 
//Она не содержит правил по созданию этих данных. Нужно всего 
//лишь вернуть что-то. 

// Как упоминал выше, все типы это синглтоны, так что, если мы изменим 
// foo.variable в одном месте, в других местах она тоже изменится.

// ---------------------

// You should use $provide.factory(getFn) 
// if you do not need to configure your service in a provider.


phonecatApp.factory('mytestfact', function() {
	var thisIsPrivate = "Private";
	
	function getPrivate() {
		return thisIsPrivate;
	}

	return {
		variable: 'This is public from factory',
		getPrivate: getPrivate
	};

});


// ===============================================================================

// Сервис (не путайте общее название с конкретным типом) работает так же как фабрика. 
// Разница в том, что сервис использует конструктор, поэтому, когда используете его 
// в первый раз, он выполнит new Foo(); для создания экземпляра объекта. 
// Имейте в виду, что этот же объект вернется и в других местах, если использовать
// там этот сервис.


// Фактически сервис эквивалентен следующему коду:

// app.factory('foo2', function() {
//   return new Foobar();
// });

// function Foobar() {
//   var thisIsPrivate = "Private";
//   this.variable = "This is public";
//   this.getPrivate = function() {
//     return thisIsPrivate;
//   };
// }



phonecatApp.service('mytestserv', function() {
	var thisIsPrivate = "Private";
	this.variable = "This is public from service";
	
	this.getPrivate = function() {
		return thisIsPrivate;
	};

});



// ===============================================================================


// value(name, value);
// Register a value service with the $injector, such as a string, a number, an array, 
// an object or a function. This is short for registering a service where 
// its provider's $get property is a factory function that takes no arguments 
// and returns the value service.

// Value services are similar to constant services, except that they cannot 
// be injected into a module configuration function (see angular.Module) but 
// they can be overridden by an Angular decorator.

// --------------------

// Переменная подобна константе, но может быть изменена. 
// Она часто используется для настройки директив. Переменная 
// подобна усеченной версии фабрики, только содержит значения, 
// которые не могут быть вычислены в самом сервисе.


phonecatApp.value('myConfig', {
	config1: true,
	config2: "Default config2 but it can changes"
});



// Register a constant service, such as a string, a number, 
// an array, an object or a function, with the $injector. 
// Unlike value it can be injected into a module configuration 
// function (see angular.Module) and it cannot be overridden 
// by an Angular decorator.



// !!!!!!!!!!!!!! 

// Так же константа может настраиваться на config стадии модуля. 
// Value же сможет быть использована только на стадии run и далее 
// (прим. из комментариев).

// --

//Про value, constant рассказал aav, добавлю что объект добавленный через \
//constant не имеет провайдера и его нельзя декорировать ( вот в этом плане 
//говорят про его «неизменность» ).

//Ну это смотря, конечно, что подразумевать под провайдером. 
//у константы просто название провайдера без суффикса «Provider», поэтому 
//decorator просто не сможет ее получить. Да и смысла в декорировании константы 
//особого нет. Ее и так можно проинжектить в config и сделать с ней все что хочешь.

// --



phonecatApp.constant('myConstant', {
	config1: true,
	config2: "Default CONSTANT config2"
});

