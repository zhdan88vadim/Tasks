'user strict';

var managerControllers = angular.module('managerControllers', []);


/* Controller - ManagerListCtrl */

managerControllers.controller('ManagerListCtrl', 
	['$scope', '$q', '$location', '$userService', '$filter', 'uiGridConstants', managerListCtrl]);


function managerListCtrl ($scope, $q, $location, $userService, $filter, uiGridConstants) {

	function gridRefresh() {
		$scope.gridApi.grid.refresh();
	}

	$scope.phoneTypes = [
	{ name: 'home', label: 'Home Phone Number'}, 
	{name: 'fax', label: 'Fax Number'}];

	$scope.selectPhoneType = $scope.phoneTypes[0];

	$scope.$watch('searchText', function(newValue, oldValue) {
		gridRefresh();
	});
	$scope.$watch('selectPhoneType', function(newValue, oldValue) {
		gridRefresh();
	});

	$scope.gridOptions = {
		rowHeight: 46,
		enableSorting: true,
		enableFiltering: true,
		onRegisterApi: function(gridApi) {
			$scope.gridApi = gridApi;
			$scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 200);
		},
		columnDefs: [
		{field: 'firstName'},
		{field: 'lastName'},
		{field: 'age' },
		{field: 'address.city', name: 'city'},
		{
			filterHeaderTemplate: '<div class="ui-grid-filter-container"><select ng-model="$parent.$parent.$parent.$parent.$parent.selectPhoneType" ng-options="type.label for type in $parent.$parent.$parent.$parent.$parent.phoneTypes" class="form-control"></select></div>',
			field: 'phoneNumber', 
			cellFilter: 'phoneNumber:$parent.$parent.$parent.$parent.$parent.$parent.$parent.selectPhoneType',
		},
		{
			enableColumnMenus: false,
			enableSorting: false,
			name: 'edit',
			displayName: '',
			width: 50,
			cellTemplate: '<div class="ui-grid-cell-contents"><button ng-click="grid.appScope.editPerson(row.entity, $event)" type="button" class="btn btn-default">'
			+ '<span class="glyphicon glyphicon-pencil">'
			+ '</span></button></div>'
		}]
	};
	
	$scope.gridOptions.columnDefs[0].enableFiltering = false;
	$scope.gridOptions.columnDefs[1].enableFiltering = false;
	$scope.gridOptions.columnDefs[2].enableFiltering = false;
	$scope.gridOptions.columnDefs[3].enableFiltering = false;
	$scope.gridOptions.columnDefs[5].enableFiltering = false;


	$scope.singleFilter = function(renderableRows) {
		var matcher = new RegExp($scope.searchText, 'i');
		renderableRows.forEach(function(row) {
			var match = false;
			['firstName', 'lastName', 'age', 'phoneNumber'].forEach(function(field) {

				if (field === 'phoneNumber') {
					var phone = $filter('phoneNumber')(row.entity[field], $scope.selectPhoneType);
					if(phone.toString().match(matcher)) {
						match = true;
					}
				}
				else if (row.entity[field].toString().match(matcher)) {
					match = true;
				}
			});
			if (!match) {
				row.visible = false;
			}
		});
		return renderableRows;
	};

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


	$scope.gridOptions.data = $scope.persons;
}
