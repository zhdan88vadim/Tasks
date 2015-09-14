'user strict';

var managerControllers = angular.module('managerControllers', []);


/* Controller - PersonDetailCtrl */

managerControllers.controller('PersonDetailCtrl', 
	['$scope', '$q', '$location', '$userService', '$filter', '$routeParams', personDetailCtrl]);

function getPhone(phones, type) {
	for (var i = 0; i < phones.length; ++i) {
		if(phones[i].type === type) {
			return phones[i];
		}
	}
}

function personDetailCtrl($scope, $q, $location, $userService, $filter, $routeParams) {

	$scope.back = function() {
		$location.path('/');
	}

	$scope.personUpdate = function() {
		var homePhone = getPhone($scope.person.phoneNumber, 'home');
		var faxPhone = getPhone($scope.person.phoneNumber, 'fax');
	
		homePhone.number = $scope.personHomePhone;
		faxPhone.number = $scope.personFaxPhone;

		$userService.update($scope.person).success(function() {
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

		var personFullName = person.firstName + ' ' + person.lastName;
		var phoneHome = $filter('phoneNumber')(person.phoneNumber, { type: 'home' });
		var phoneFax = $filter('phoneNumber')(person.phoneNumber, { type: 'fax' });

		// $scope.dialog.age = person.age;
		// $scope.dialog.street = person.address.streetAddress;
		// $scope.dialog.city = person.address.city;
		// $scope.dialog.state = person.address.state;
		// $scope.dialog.postalCode = person.address.postalCode;
		// $scope.dialog.homeNumber = phoneHome;
		// $scope.dialog.faxNumber = phoneFax;
		// $scope.dialog.header = personFullName;
		// $scope.personFullName = personFullName;

		$scope.showModal = true;
		
	};

	$scope.testFunct = function(param) {
		console.log('testFunct with param: ' + param);
	};
	$scope.update = function() {

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
