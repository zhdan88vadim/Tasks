'use strict';

var userManager = angular.module('personManager', 
	['ngRoute', 'managerControllers', 'managerServices', 'managerFilters', 'managerDirectives', 'ngSanitize']);

userManager.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {

		// Routing dont work with this code..
		//$locationProvider.html5Mode(true);
		//$locationProvider.hashPrefix('#');

		$routeProvider
		.when('/list', {
			templateUrl: 'partials/list.html',
			controller: 'ManagerListCtrl',
		})
		.when('/person/:personId', {
			templateUrl: 'partials/detail.html',
			controller: 'PersonDetailCtrl',
		})
		.otherwise({
			redirectTo: '/list'
		});

	}]);