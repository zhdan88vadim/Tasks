
var flickrGallery = angular.module('flickrGallery', 
	['ngRoute', 'flickrControllers', 'flickrServices', 'dialogService', 'file-model'])
.config(['$locationProvider', function AppConfig($locationProvider) {
	$locationProvider.html5Mode(true);
}])
.constant("appConfig", {
	"api_key": "30aa04e510115263def50e2092c99255",
	"secret": "d89088c4ba7489d6"
});

flickrGallery.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
		.when('/', {
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
			redirectTo: '/'
		});
	}]);