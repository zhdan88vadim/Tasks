'user strict';


/* Controller - TestPhoneDerectiveCtrl */

managerControllers.controller('TestPhoneDerectiveCtrl', 
	['$scope', '$q', '$location', testPhoneDerectiveCtrl]);

function testPhoneDerectiveCtrl ($scope, $q, $location) {
	$scope.model = {};
	$scope.model.personFaxPhone = '111-222-4444';

	$scope.back = function() {
		$location.path('/');
	}
}
