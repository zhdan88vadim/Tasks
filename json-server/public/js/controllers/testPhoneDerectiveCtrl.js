'user strict';


/* Controller - TestPhoneDerectiveCtrl */

managerControllers.controller('TestPhoneDerectiveCtrl', 
	['$scope', '$q', '$location', '$userService', '$filter', testPhoneDerectiveCtrl]);

function testPhoneDerectiveCtrl ($scope, $q, $location, $userService, $filter) {
	$scope.model.personFaxPhone = '111-222-4444';

	$scope.back = function() {
		$location.path('/');
	}
}
