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

		$userService.update(person).success(function() {
			alertsService.RenderSuccessMessage('<strong>Update was successfull!</strong>');
			$location.path('/');
		}).error(function() {

		});
	}

	$userService.getById($routeParams.personId)
	.success(function(data) {
		$scope.model.person = data;
		$scope.model.personfullName = $scope.person.firstName + ' ' + $scope.model.person.lastName;
		$scope.model.personHomePhone = $filter('phoneNumber')($scope.model.person.phoneNumber, { type: 'home' });
		$scope.model.personFaxPhone = $filter('phoneNumber')($scope.model.person.phoneNumber, { type: 'fax' });
	}).error(function() {
		$scope.model.personfullName = 'Warning! User Not Found!';
	});
}


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


/* Controller - PersonListCtrl */

managerControllers.controller('PersonListCtrl', 
	['$scope', '$q', '$location', '$userService', '$filter', 'alertsService', personListCtrl]);

function personListCtrl ($scope, $q, $location, $userService, $filter, alertsService) {
	
	function loadUsers() {
		$userService.getUsers().success(function(data) {
			$scope.model.persons = data;
		});
	}

	$scope.model = {};

	$scope.showModal = false;
	$scope.model.dialog = {};

	$scope.order = function(predicate) {
		$scope.model.reverse = ($scope.model.predicate === predicate) ? !$scope.model.reverse : false;
		$scope.model.predicate = predicate;
	}

	$scope.addPerson = function() {
		alertsService.RenderSuccessMessage('<strong>Update was successfull!</strong>');
	}

	$scope.editPerson = function(person, $event) {
		$event.stopPropagation();

		$scope.model.selectPerson = person;
		
		$scope.model.dialog.header = $scope.model.selectPerson.firstName + ' ' + $scope.model.selectPerson.lastName;
		$scope.model.personHomePhone = $filter('phoneNumber')($scope.model.selectPerson.phoneNumber, { type: 'home' });
		$scope.model.personFaxPhone = $filter('phoneNumber')($scope.model.selectPerson.phoneNumber, { type: 'fax' });

		$scope.showModal = true;
	};

	$scope.testFunct = function(param) {
		//console.log('testFunct with param: ' + param);
	};

	$scope.personUpdate = function() {
		
		var person = updatePhone($scope.model.selectPerson, $scope.model.personHomePhone, $scope.model.personFaxPhone);

		$userService.update(person).success(function() {
			alertsService.RenderSuccessMessage('<strong>Update was successfull!</strong>');
			loadUsers();
		}).error(function() {
			alertsService.RenderErrorMessage('<strong>Update was successfull!</strong>');
		});

		$scope.showModal = false;
	};

	$scope.model.predicate = 'name';
	$scope.model.reverse = false;

	$scope.model.phoneTypes = [
	{ type: 'home', label: 'Home Phone Number'}, 
	{ type: 'fax', label: 'Fax Number'}];

	$scope.model.selectPhoneType = $scope.model.phoneTypes[0];

	loadUsers();
}
