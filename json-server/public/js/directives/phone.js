'use strict';


managerDirectives.directive('phone', ['$interpolate', function ($interpolate) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/directive-phone.html',
		require: '^form', // Get parent form controller.
		scope: {
			bindModel: '=ngModel', // Access to directive ngModel.
			//bindForm: '=form'
		},
		link: function (scope, elem, attr, formCtrl) {
			scope.elName = attr.name;

			scope.$watch(function() {
				return formCtrl[scope.elName].$error;
			},
			function(newValue, oldValue) {
				var error = formCtrl[scope.elName].$error;
				scope.requiredError = error.required;
				scope.patternError = error.pattern;
			}, true);

			scope.$watch(function() {
				return formCtrl.$submitted;
			},
			function(newValue, oldValue) {
				scope.formSubmitted = newValue;
			});
		}
	};
}]);