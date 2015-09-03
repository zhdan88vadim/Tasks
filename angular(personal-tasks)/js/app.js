'use strict';

var userManager = angular.module('personManager', 
	['ngRoute', 'managerControllers', 'managerServices', 'managerFilters']);

userManager.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {

		$locationProvider.html5Mode(true);

		$routeProvider
		.when('/', {
			templateUrl: 'partials/main.html',
			controller: 'ManagerListCtrl',
		})
		.otherwise({
			redirectTo: '/'
		});

	}]);