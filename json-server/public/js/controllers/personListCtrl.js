'user strict';


/* Controller - PersonListCtrl */

managerControllers.controller('PersonListCtrl', 
	['$scope', '$q', '$location', '$userService', '$filter', 'alertsService', personListCtrl]);

function personListCtrl ($scope, $q, $location, $userService, $filter, alertsService) {
	
	function loadUsers() {
		$userService.getUsers().success(function(data) {
			$scope.model.persons = data;
		});
	}

	$scope.showModal = false;

	$scope.forms = {};
	$scope.model = {};
	$scope.model.dialog = {};

	$scope.model.predicate = 'name';
	$scope.model.reverse = false;

	$scope.model.phoneTypes = [
	{ type: 'home', label: 'Home Phone Number'}, 
	{ type: 'fax', label: 'Fax Number'}];

	$scope.model.selectPhoneType = $scope.model.phoneTypes[0];


	$scope.order = function(predicate) {
		$scope.model.reverse = ($scope.model.predicate === predicate) ? !$scope.model.reverse : false;
		$scope.model.predicate = predicate;
	}

	$scope.addPerson = function() {
		$scope.model.editPerson = null;
		$scope.model.personHomePhone = null;
		$scope.model.personFaxPhone = null;


		$scope.model.isAddForm = true;
		$scope.showModal = true;
	}

	$scope.editPerson = function(person, $event) {
		$event.stopPropagation();

		$scope.model.editPerson = person;
		
		$scope.model.dialog.header = $scope.model.editPerson.firstName + ' ' + $scope.model.editPerson.lastName;
		$scope.model.personHomePhone = $filter('phoneNumber')($scope.model.editPerson.phoneNumber, { type: 'home' });
		$scope.model.personFaxPhone = $filter('phoneNumber')($scope.model.editPerson.phoneNumber, { type: 'fax' });
		
		$scope.model.isAddForm = false;
		$scope.showModal = true;
	};

	$scope.personUpdate = function() {
		
debugger;

		if ($scope.model.isAddForm) {

		}


		var person = updatePhone($scope.model.editPerson, $scope.model.personHomePhone, $scope.model.personFaxPhone);

		$userService.update(person).success(function() {
			alertsService.RenderSuccessMessage('<strong>Update was successfull!</strong>');
			loadUsers();
		}).error(function() {
			alertsService.RenderErrorMessage('<strong>Update was successfull!</strong>');
		});

		$scope.showModal = false;
	};

	// $scope.$watch('forms.form.$pristine', function(newValue, oldValue) {
	// 	if (newValue === oldValue) return;
	// 	$scope.model.isOkDisabled = newValue;
	// });

	loadUsers();
}
