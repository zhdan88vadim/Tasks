'user strict';

var managerControllers = angular.module('managerControllers', []);


managerControllers.controller('PersonDetailCtrl', 
	['$scope', '$q', '$location', '$userService', '$filter', '$routeParams', personDetailCtrl]);

function personDetailCtrl($scope, $q, $location, $userService, $filter, $routeParams) {
	$scope.person = $userService.getById($routeParams.personId);
	$scope.personfullName = $scope.person.firstName + ' ' + $scope.person.lastName;

	$scope.back = function() {
		$location.path('/');
	}

	$scope.update = function() {
		$userService.update($scope.person);
		$location.path('/');
	}
}


/* MainCtrl - ManagerListCtrl */

managerControllers.controller('MainCtrl', 
	['$scope', '$q', '$location', '$userService', '$filter', mainCtrl]);

function mainCtrl ($scope, $q, $location, $userService, $filter) {

	$scope.toogleShowContent = function() {
		$scope.isShowContent = !$scope.isShowContent;
	}

	$scope.isShowContent = true; // ------- warning! default -> false
}


/* Controller - ManagerListCtrl */

managerControllers.controller('ManagerListCtrl', 
	['$scope', '$q', '$location', '$userService', '$filter', managerListCtrl]);

function managerListCtrl ($scope, $q, $location, $userService, $filter) {

	$scope.order = function(predicate) {
		$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		$scope.predicate = predicate;
	}

	$scope.showModal = false;
	$scope.dialog = {};

	$scope.editPerson = function(person, $event) {
		$event.stopPropagation();

		var personFullName = person.firstName + ' ' + person.lastName;
		var phoneHome = $filter('phoneNumber')(person.phoneNumber, { name: 'home' });
		var phoneFax = $filter('phoneNumber')(person.phoneNumber, { name: 'fax' });

		$scope.dialog.age = person.age;
		$scope.dialog.street = person.address.streetAddress;
		$scope.dialog.city = person.address.city;
		$scope.dialog.state = person.address.state;
		$scope.dialog.postalCode = person.address.postalCode;
		$scope.dialog.homeNumber = phoneHome;
		$scope.dialog.faxNumber = phoneFax;
		$scope.dialog.header = personFullName;
		$scope.personFullName = personFullName;

		$scope.showModal = true;
		
	};

	$scope.testFunct = function(param) {
		console.log('testFunct with param: ' + param);
	};
	$scope.updateLastViewed = function() {
		$scope.lastViewedPerson = 'Last viewed: ' + $scope.personFullName;
		$scope.showModal = false;
	};

	$scope.isShowContent = true; // ------- warning! default -> false
	$scope.predicate = 'name';
	$scope.reverse = false;

	$scope.phoneTypes = [
	{ name: 'home', label: 'Home Phone Number'}, 
	{name: 'fax', label: 'Fax Number'}];

	$scope.selectPhoneType = $scope.phoneTypes[0];

	$scope.persons = $userService.getUsers();
}
