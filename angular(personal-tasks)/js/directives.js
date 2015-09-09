var managerDirectives = angular.module('managerDirectives', []);


function isEmpty(value) {
	return angular.isUndefined(value) || value === '' || value === null || value !== value;
}

managerDirectives.directive('ngMin', function () {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, elem, attr, ctrl) {
			scope.$watch(attr.ngMin, function () {
				ctrl.$setViewValue(ctrl.$viewValue);
			});
			var minValidator = function (value) {
				var min = scope.$eval(attr.ngMin) || 0;
				if (!isEmpty(value) && value < min) {
					ctrl.$setValidity('ngMin', false);
					return undefined;
				} else {
					ctrl.$setValidity('ngMin', true);
					return value;
				}
			};

			ctrl.$parsers.push(minValidator);
			ctrl.$formatters.push(minValidator);
		}
	};
});

managerDirectives.directive('ngMax', function () {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, elem, attr, ctrl) {
			scope.$watch(attr.ngMax, function () {
				ctrl.$setViewValue(ctrl.$viewValue);
			});
			var maxValidator = function (value) {
				var max = scope.$eval(attr.ngMax) || Infinity;
				if (!isEmpty(value) && value > max) {
					ctrl.$setValidity('ngMax', false);
					return undefined;
				} else {
					ctrl.$setValidity('ngMax', true);
					return value;
				}
			};

			ctrl.$parsers.push(maxValidator);
			ctrl.$formatters.push(maxValidator);
		}
	};
});

managerDirectives.directive('customModal', function($parse) {
	return {
		restrict: 'E',
		replace: true, // Replace with the template below
		transclude: true, // We want to insert custom content inside the directive
		scope: true,
		template: $('#dialog-template').html(),
		link: function($scope, element, attrs, ctrl, transclude) {

			$scope.dialog.header = attrs.header;
			$scope.dialog.okText = attrs.okText;
			$scope.dialog.cancelText = attrs.cancelText;

			var invokerOk = $parse(attrs.onsubmit);
			var invokerCancel = $parse(attrs.oncancel);

			$scope.dialog.clickOk = function() {
				invokerOk($scope);
			}
			$scope.dialog.clickCancel = function() {
				invokerCancel($scope);
			}

			$scope.$watch(attrs.show, function(value) {
				if(value == true)
					$(element).modal('show');
				else
					$(element).modal('hide');
			});

			$(element).on('shown.bs.modal', function() {
				$scope.$apply(function() {
					$scope.$parent[attrs.show] = true;
				});
			});


			// When the dialog closes you need to change the state, 
			// otherwise it will not re-open as *watch* will not work.

			$(element).on('hidden.bs.modal', function() {
				$scope.$apply(function() {
					$scope.$parent[attrs.show] = false;
				});
			});

			
			// Note
			// Этот код нужен в том случае если используется параметр transclude: true
			// и в шаблоне HTML, который скопирывался мы хотим использовать scope созданный в директиве.
			// иначи в шаблоне HTML используется scope контроллера.
			// http://angular-tips.com/blog/2014/03/transclusion-and-scopes/

			// transclude($scope, function(clone, $scope) {
			// 	element.append(clone);
			// });

		}
	}
});