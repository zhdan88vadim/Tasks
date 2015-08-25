
var flickrGallery = angular.module('flickrGallery', 
	['ngRoute', 'flickrControllers', 'flickrServices', 'dialogService', 'file-model'])
.config(['$locationProvider', function AppConfig($locationProvider) {
	$locationProvider.html5Mode(true);
}]);

flickrGallery.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
		.when('/gallery', {
			//templateUrl: '',
			controller: 'GalleryListCtrl',
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
		.otherwise({
			redirectTo: '/gallery'
		});
	}]);


// var flickrGallery = angular.module('flickrGallery', ['flickrControllers', 'flickrServices']);

// flickrGallery.config(['$locationProvider', 
// 	function AppConfig($locationProvider) {

// 	// enable html5Mode for pushstate ('#'-less URLs)
// 	$locationProvider.html5Mode(true);
// 	//$locationProvider.hashPrefix('!');

// }]);