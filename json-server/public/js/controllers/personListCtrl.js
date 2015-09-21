'user strict';


/* Controller - PersonListCtrl */

managerControllers.controller('PersonListCtrl', 
	['$scope', '$q', '$location', '$userService', '$filter', 'alertsService', 'ModalService', '$Constants', '$interpolate', personListCtrl]);

function personListCtrl ($scope, $q, $location, $userService, $filter, alertsService, ModalService, $Constants, $interpolate) {
	
	function loadUsers() {
		$userService.getAll().success(function(data) {
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

	$scope.fillTestData = function() {
		$scope.model.editPerson = {
			"firstName": "First Name Test",
			"lastName": "Last Name Test",
			"age": 28,
			"address": {
				"streetAddress": "Mavra 45",
				"city": "Minsk",
				"state": "450",
				"postalCode": "220100"
			}
		};

		$scope.model.personHomePhone = '220-000-3344';
		$scope.model.personFaxPhone = '220-300-0000';

		$scope.forms.form.$dirty = true;
		$scope.forms.form.$pristine = false;
	}

	$scope.addPerson = function() {
		$scope.forms.form.$setUntouched();
		$scope.forms.form.$setPristine();
		
		// Clean form data.
		$scope.model.editPerson = {};
		$scope.model.editPerson.address = {};
		$scope.model.personHomePhone = null;
		$scope.model.personFaxPhone = null;


		$scope.model.dialog.header = 'Add Person';
		$scope.model.dialog.isAddForm = true;
		$scope.showModal = true;
	}

	$scope.editPerson = function(person, $event) {
		$event.stopPropagation();

		$scope.forms.form.$setUntouched();
		$scope.forms.form.$setPristine();
		
		$scope.model.editPerson = angular.copy(person);
		
		$scope.model.dialog.header = person.firstName + ' ' + person.lastName;
		$scope.model.personHomePhone = $filter('phoneNumber')(person.phoneNumber, { type: 'home' });
		$scope.model.personFaxPhone = $filter('phoneNumber')(person.phoneNumber, { type: 'fax' });

		$scope.model.dialog.isAddForm = false;
		$scope.showModal = true;
	}

	$scope.deletePerson = function(person) {
		
		ModalService.showModal({
			templateUrl: 'confirm-modal.html',
			controller: "ModalDialogCtrl"
		}).then(function(modal) {

			modal.scope.model = {};
			modal.scope.model.okText = 'Delete';
			modal.scope.model.cancelText = 'Cancel';
			modal.scope.model.header = 'Delete Person';
			modal.scope.model.body = 'Are you sure you want to remove <strong>' 
			+ person.firstName + ' ' + person.lastName + '</strong> from the list?';


			// modal.scope.model.firstName = person.firstName;
			// modal.scope.model.lastName = person.lastName;
			// var bodyStatement = 'Are you sure you want to remove <strong>{{ model.firstName }} {{ model.lastName }}</strong> from the list?';
			// modal.scope.model.body = $interpolate(bodyStatement)(modal.scope);

			modal.element.modal();

			modal.close.then(function(result) {

				if (result === true) {
					promise = $userService.delete(person.id);

					promise.success(function() {
						alertsService.RenderSuccessMessage($Constants.update_successfull);
						loadUsers();
					}).error(function() {
						alertsService.RenderErrorMessage($Constants.update_error);
					});
				}
			});
		});
	}

	$scope.personAddUpdate = function() {
		// Check valid form.
		if (!$scope.forms.form.$valid) return;

		var person = $scope.model.editPerson;
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
			alertsService.RenderSuccessMessage($Constants.update_successfull);
			loadUsers();
		}).error(function() {
			alertsService.RenderErrorMessage($Constants.update_error);
		});

		$scope.showModal = false;
	}

	loadUsers();
}
