'use strict';

var userManager = angular.module('personManager', 
	['ngRoute', 'managerControllers', 'managerServices', 'managerFilters', 'managerDirectives', 'ngSanitize', 'ui.bootstrap.alert']);

userManager.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {

		// Routing dont work with this code..
		//$locationProvider.html5Mode(true);
		//$locationProvider.hashPrefix('#');

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

	}]);