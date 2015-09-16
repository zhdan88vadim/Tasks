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
		// Clean form data.
		$scope.model.editPerson = {};
		$scope.model.editPerson.address = {};
		$scope.model.personHomePhone = null;
		$scope.model.personFaxPhone = null;

		$scope.forms.form.$setUntouched();
		$scope.forms.form.$setPristine();

		$scope.model.dialog.isAddForm = true;
		$scope.showModal = true;
	}

	$scope.editPerson = function(person, $event) {
		$event.stopPropagation();

		$scope.model.editPerson = person;
		
		$scope.model.dialog.header = person.firstName + ' ' + person.lastName;
		$scope.model.personHomePhone = $filter('phoneNumber')(person.phoneNumber, { type: 'home' });
		$scope.model.personFaxPhone = $filter('phoneNumber')(person.phoneNumber, { type: 'fax' });
		
		$scope.model.dialog.isAddForm = false;
		$scope.showModal = true;
	};

	$scope.personUpdate = function() {
		// Check valid form.
		if (!$scope.forms.form.$valid) return;

		var person = $scope.model.editPerson;
		
		console.log(person);

		person.phoneNumber = [{ 
			"type":"fax", 
			"number": $scope.model.personFaxPhone 
		},
		{
			"type":"home", 
			"number": $scope.model.personHomePhone 
		}];

		var promise = null;

		if ($scope.model.dialog.isAddForm)
			promise = $userService.create(person);
		else
			promise = $userService.update(person);

		promise.success(function() {
			alertsService.RenderSuccessMessage('<strong>Update was successfull!</strong>');
			loadUsers();
		}).error(function() {
			alertsService.RenderErrorMessage('<strong>Update was successfull!</strong>');
		});

		$scope.showModal = false;
	};

	loadUsers();
}
