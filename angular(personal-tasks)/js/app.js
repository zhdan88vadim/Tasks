'use strict';

var userManager = angular.module('userManager', 
	['ngRoute', 'managerControllers', 'managerServices', 'managerFilters'])
.constant("appConfig", {
	"api_key": "30aa04e510115263def50e2092c99255",
	"secret": "d89088c4ba7489d6"
});

userManager.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {

		$locationProvider.html5Mode(true);

		$routeProvider
		.when('/', {
			templateUrl: 'partials/main.html',
			//template: 'default /',
			//reloadOnSearch: true,
			controller: 'ManagerListCtrl',
			// controller: function($scope) {
			// }
			// I would like to simply pass the string to the
			// controller, based on the request.

			// resolve: {
			// 	paramFrob: function() { 
			// 		return "123-234-345-456";
			// 	}, 
			// resolve: {
			// 	frob: ['$route', 'queryService', 
			// 	function ($route, queryService) {
			// 		return queryService.getFrob($route.current.params);
			// 	}]
			// }
		})
		// .when('/:id?frob', {
		// 	reloadOnSearch: true,
		// 	//templateUrl: 'partials/main.html',
		// 	template: 'timplate with id',
		// 	controller: function($scope, $routeParams, $location) {

		// 		console.log('route');

		// 		$scope.setCurrentPhoto($routeParams.id);
		// 		if(!$scope.currentPhoto || $scope.loading){
		// 			$location.path('/');
		// 			return;
		// 		}
		// 			$scope.openModal();
		// 	}
		// })
		.otherwise({
			redirectTo: '/'
		});

	}]);