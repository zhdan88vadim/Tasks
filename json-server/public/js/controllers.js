'user strict';

var managerControllers = angular.module('managerControllers', []);


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
	//var copyPerson = person;

	var homePhone = getPhone(copyPerson.phoneNumber, 'home');
	var faxPhone = getPhone(copyPerson.phoneNumber, 'fax');

	homePhone.number = homePhone.number;
	faxPhone.number = faxPhone.number;

	return copyPerson;
}

function personDetailCtrl($scope, $q, $location, $userService, $filter, $routeParams, alertsService) {

	$scope.back = function() {
		$location.path('/');
	}

	$scope.personUpdate = function() {

		var personNew = updatePhone($scope.person, $scope.personHomePhone, $scope.personFaxPhone);

		$userService.update(personNew).success(function() {
			alertsService.RenderSuccessMessage('<strong>Update was successfull!</strong>');
			$location.path('/');
		}).error(function() {

		});
	}

	$userService.getById($routeParams.personId)
	.success(function(data) {
		$scope.person = data;
		$scope.personfullName = $scope.person.firstName + ' ' + $scope.person.lastName;
		$scope.personHomePhone = $filter('phoneNumber')($scope.person.phoneNumber, { type: 'home' });
		$scope.personFaxPhone = $filter('phoneNumber')($scope.person.phoneNumber, { type: 'fax' });
	}).error(function() {
		$scope.personfullName = 'Warning! User Not Found!';
	});
}


/* Controller - TestPhoneDerectiveCtrl */

managerControllers.controller('TestPhoneDerectiveCtrl', 
	['$scope', '$q', '$location', '$userService', '$filter', testPhoneDerectiveCtrl]);

function testPhoneDerectiveCtrl ($scope, $q, $location, $userService, $filter) {
	$scope.personFaxPhone = '111-222-4444';

	$scope.back = function() {
		$location.path('/');
	}
}


/* Controller - MainCtrl */

managerControllers.controller('MainCtrl', 
	['$scope', '$q', '$location', '$userService', '$filter', mainCtrl]);

function mainCtrl ($scope, $q, $location, $userService, $filter) {

}


/* Controller - PersonListCtrl */

managerControllers.controller('PersonListCtrl', 
	['$scope', '$q', '$location', '$userService', '$filter', 'alertsService', personListCtrl]);

function personListCtrl ($scope, $q, $location, $userService, $filter, alertsService) {

	$scope.showModal = false;
	$scope.dialog = {};

	$scope.order = function(predicate) {
		$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		$scope.predicate = predicate;
	}

	$scope.addPerson = function() {
		alertsService.RenderSuccessMessage('<strong>Update was successfull!</strong>');
	}

	$scope.editPerson = function(person, $event) {
		$event.stopPropagation();

		$scope.selectPerson = person;
		
		$scope.dialog.header = $scope.selectPerson.firstName + ' ' + $scope.selectPerson.lastName;
		$scope.personHomePhone = $filter('phoneNumber')($scope.selectPerson.phoneNumber, { type: 'home' });
		$scope.personFaxPhone = $filter('phoneNumber')($scope.selectPerson.phoneNumber, { type: 'fax' });

		$scope.showModal = true;
	};

	$scope.testFunct = function(param) {
		//console.log('testFunct with param: ' + param);
	};

	$scope.update = function() {

		debugger;
		// не обновляется scope при изменении текста.
		
		var personNew = updatePhone($scope.selectPerson, $scope.personHomePhone, $scope.personFaxPhone);


		$userService.update(personNew).success(function() {
			alertsService.RenderSuccessMessage('<strong>Update was successfull!</strong>');
		}).error(function() {
			alertsService.RenderErrorMessage('<strong>Update was successfull!</strong>');
		});

		$scope.showModal = false;
	};

	$scope.predicate = 'name';
	$scope.reverse = false;

	$scope.phoneTypes = [
	{ type: 'home', label: 'Home Phone Number'}, 
	{ type: 'fax', label: 'Fax Number'}];

	$scope.selectPhoneType = $scope.phoneTypes[0];

	$userService.getUsers().success(function(data) {
		$scope.persons = data;
	});
}
