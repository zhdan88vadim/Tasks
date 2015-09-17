'use strict';


angular.module('ui.alert', [])

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