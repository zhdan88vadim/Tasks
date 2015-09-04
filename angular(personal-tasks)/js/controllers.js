'user strict';

var managerControllers = angular.module('managerControllers', []);


/* Controller - ManagerListCtrl */

managerControllers.controller('ManagerListCtrl', 
	['$scope', '$q', '$location', '$userService', '$filter', managerListCtrl]);


function managerListCtrl ($scope, $q, $location, $userService, $filter) {

	$scope.order = function(predicate) {
		$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		$scope.predicate = predicate;
	}
	$scope.toogleShowContent = function() {
		$scope.isShowContent = !$scope.isShowContent;
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

	$scope.persons = [
	{
		"firstName": "Albert",
		"lastName": "Braun",
		"age": 18,
		"address":
		{
			"streetAddress": "21 2nd Street",
			"city": "New York",
			"state": "NY",
			"postalCode": "10021"
		},
		"phoneNumber":
		[
		{
			"type": "home",
			"number": "212 home-1111"
		},
		{
			"type": "fax",
			"number": "646 fax-0000"
		}
		]
	},
	{
		"firstName": "John",
		"lastName": "Smith",
		"age": 25,
		"address":
		{
			"streetAddress": "21 2nd Street",
			"city": "New York",
			"state": "NY",
			"postalCode": "10021"
		},
		"phoneNumber":
		[
		{
			"type": "home",
			"number": "212 555-1234"
		},
		{
			"type": "fax",
			"number": "646 555-4567"
		}
		]
	},
	{
		"firstName": "Simona",
		"lastName": "Morasca",
		"age": 22,
		"address":
		{
			"streetAddress": "3 Mcauley Dr",
			"city": "Ashland",
			"state": "OH",
			"postalCode": "44805"
		},
		"phoneNumber":
		[
		{
			"type": "home",
			"number": "419-503-2484"
		},
		{
			"type": "fax",
			"number": "419-800-6759"
		}
		]
	},
	{
		"firstName": "Josephine",
		"lastName": "Darakjy",
		"age": 33,
		"address":
		{
			"streetAddress": "4 B Blue Ridge Blvd",
			"city": "Brighton",
			"state": "MI",
			"postalCode": "48116"
		},
		"phoneNumber":
		[
		{
			"type": "home",
			"number": "973-605-6492"
		},
		{
			"type": "fax",
			"number": "602-919-4211"
		}
		]
	}];
}
