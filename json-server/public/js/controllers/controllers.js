'user strict';

var managerControllers = angular.module('managerControllers', []);


/* Controller - TestPhoneDerectiveCtrl */

managerControllers.controller('TestPhoneDerectiveCtrl', 
	['$scope', '$q', '$location', '$userService', '$filter', testPhoneDerectiveCtrl]);

function testPhoneDerectiveCtrl ($scope, $q, $location, $userService, $filter) {
	$scope.model.personFaxPhone = '111-222-4444';

	$scope.back = function() {
		$location.path('/');
	}
}


/* Controller - MainCtrl */

managerControllers.controller('MainCtrl', 
	['$scope', '$q', '$location', '$userService', '$filter', mainCtrl]);

function mainCtrl ($scope, $q, $location, $userService, $filter) {

}