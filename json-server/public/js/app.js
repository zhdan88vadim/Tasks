'use strict';


var userManager = angular.module('personManager', 
	['ngRoute', 'managerControllers', 'managerServices', 
	'managerFilters', 'managerDirectives', 'ngSanitize', 'modalService', 'ui.alert']);

userManager.config(['$routeProvider', '$locationProvider', '$httpProvider',
	function($routeProvider, $locationProvider, $httpProvider) {

		// Routing dont work with this code..
		//$locationProvider.html5Mode(true);

		$httpProvider.interceptors.push('sessionInjector');
		$httpProvider.interceptors.push('httpInterceptor');
		
		//$httpProvider.interceptors.push('timestampMarker');

		$routeProvider
		.when('/list', {
			templateUrl: 'partials/list.html',
			controller: 'PersonListCtrl',
		})
		.when('/person/:personId', {
			templateUrl: 'partials/detail.html',
			controller: 'PersonDetailCtrl',
		})
		.when('/test', {
			templateUrl: 'partials/test.html',
			controller: 'TestPhoneDerectiveCtrl',
		})
		.otherwise({
			redirectTo: '/list'
		});

	}])
.constant('$Constants', {
	'update_error': '<strong>Update was error!</strong>',
	'update_successfull': '<strong>Update was successfull!</strong>',
	'user_not_found': '<strong>Error! User Not Found!</strong>'
});


