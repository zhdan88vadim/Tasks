'user strict';


/* Controller - PersonDetailCtrl */

managerControllers.controller('PersonDetailCtrl', 
	['$scope', '$q', '$location', '$userService', '$filter', '$routeParams', 'alertsService', '$Constants', personDetailCtrl]);

function personDetailCtrl($scope, $q, $location, $userService, $filter, $routeParams, alertsService, $Constants) {

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
		var homeLink = getPhone(copyPerson.phoneNumber, 'home');
		var faxLink = getPhone(copyPerson.phoneNumber, 'fax');
		homeLink.number = homePhone;
		faxLink.number = faxPhone;
		return copyPerson;
	}

	$scope.model = {};

	$scope.back = function() {
		$location.path('/');
	}

	$scope.personUpdate = function() {

		var person = updatePhone(
			$scope.model.person, 
			$scope.model.personHomePhone, 
			$scope.model.personFaxPhone);

		var promise = $userService.update(person);
		promise.success(function() {
			alertsService.RenderSuccessMessage($Constants.update_successfull);
			$scope.back();
		}).error(function() {
			alertsService.RenderErrorMessage($Constants.update_error);
		});
	}

	var promise = $userService.getById($routeParams.personId);
	promise.success(function(data) {
		$scope.model.person = data;
		$scope.model.personfullName = data.firstName + ' ' + data.lastName;
		$scope.model.personHomePhone = $filter('phoneNumber')(data.phoneNumber, { type: 'home' });
		$scope.model.personFaxPhone = $filter('phoneNumber')(data.phoneNumber, { type: 'fax' });
	}).error(function() {
		alertsService.RenderErrorMessage($Constants.user_not_found);
	});
}