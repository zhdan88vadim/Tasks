

var managerControllers = angular.module('managerControllers', []);
var managerServices = angular.module('managerServices', []);


angular.module('ui.bootstrap.alert', [])

.controller('AlertController', ['$scope', '$attrs', function ($scope, $attrs) {
	$scope.closeable = 'close' in $attrs;
}])

.directive('alert', function () {
	return {
		restrict:'EA',
		controller:'AlertController',
		templateUrl:'templates/alert.html',
		transclude:true,
		replace:true,
		scope: {
			type: '@',
			close: '&'
		}
	};
});