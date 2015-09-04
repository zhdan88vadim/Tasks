'use strict';

/* Controllers */

angular.module('docsScopeProblemExample', [])
.controller('NaomiController', ['$scope', function($scope) {
  $scope.customer = {
    name: 'Naomi',
    address: '1600 Amphitheatre'
  };
}])
.controller('IgorController', ['$scope', function($scope) {
  $scope.customer = {
    name: 'Igor',
    address: '123 Somewhere'
  };
}])
.directive('myCustomer', function() {
  return {
    restrict: 'E',
    template: 'Name: {{customer.name}} Address: {{customer.address}}'
  };
})
.controller('Controller', ['$scope', function($scope) {
  $scope.naomi = { name: 'Naomi', address: '1600 Amphitheatre' };
  $scope.igor = { name: 'Igor', address: '123 Somewhere' };
}])
.directive('myCustomerIsolating', function() {
  return {
    restrict: 'E',
    scope: {
      customerInfo: '=info'
    },
    template: 'Name: {{customerInfo.name}} Address: {{customerInfo.address}}'
  };
});