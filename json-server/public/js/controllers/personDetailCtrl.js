'user strict';


/* Controller - PersonDetailCtrl */

managerControllers.controller('PersonDetailCtrl', 
	['$scope', '$q', '$location', '$userService', '$filter', '$routeParams', 'alertsService', personDetailCtrl]);

function getPhone(phones, type) {
	for (var i = 0; i < phones.length; ++i) {
		if(phones[i].type === type) {
			return phones[i];
		}
	}
}

function updatePhone(person, homePhone, faxPhone) {

	var copyPerson = angular.copy(person);
	
	// You can't not make a copy, then you do not need to download data from
	// the server. But as it not good for me.

	//var copyPerson = person;

	var homeLink = getPhone(copyPerson.phoneNumber, 'home');
	var faxLink = getPhone(copyPerson.phoneNumber, 'fax');

	homeLink.number = homePhone;
	faxLink.number = faxPhone;

	return copyPerson;
}

function personDetailCtrl($scope, $q, $location, $userService, $filter, $routeParams, alertsService) {

	$scope.model = {};

	$scope.back = function() {
		$location.path('/');
	}

	$scope.personUpdate = function() {

		var person = updatePhone($scope.model.person, 
			$scope.model.personHomePhone, 
			$scope.model.personFaxPhone);

		$userService.update(person)
		.success(function() {
			alertsService.RenderSuccessMessage('<strong>Update was successfull!</strong>');
			$location.path('/');
		}).error(function() {

		});
	}

	$userService.getById($routeParams.personId)
	.success(function(data) {
		$scope.model.person = data;
		$scope.model.personfullName = data.firstName + ' ' + data.lastName;
		$scope.model.personHomePhone = $filter('phoneNumber')(data.phoneNumber, { type: 'home' });
		$scope.model.personFaxPhone = $filter('phoneNumber')(data.phoneNumber, { type: 'fax' });
	}).error(function() {
		$scope.model.personfullName = 'Warning! User Not Found!';
	});
}
