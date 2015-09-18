'use strict';


managerDirectives.directive('customModal', function($parse) {
	return {
		restrict: 'E',
		replace: true, // Replace with the template below
		transclude: true, // We want to insert custom content inside the directive
		scope: true,
		template: $('#dialog-template').html(),
		link: function(scope, element, attrs, ctrl, transclude) {

			scope.model.dialog.header = attrs.header;
			scope.model.dialog.okText = attrs.okText;
			scope.model.dialog.cancelText = attrs.cancelText;

			var invokerOk = $parse(attrs.onsubmit);
			var invokerCancel = $parse(attrs.oncancel);

			scope.model.dialog.clickOk = function() {
				invokerOk(scope);
			}
			scope.model.dialog.clickCancel = function() {
				invokerCancel(scope);
			}
			
			scope.$watch(attrs.show, function(value) {
				if(value == true)
					$(element).modal('show');
				else
					$(element).modal('hide');
			});

			scope.$watch(attrs.okDisabled, function(newValue, oldValue) {
				if (newValue === oldValue)
					newValue = scope.$eval(attrs.okDisabled); // Set default value.
				
				scope.model.dialog.isOkDisabled = newValue;
			});

			$(element).on('shown.bs.modal', function() {
				scope.$apply(function() {
					scope.$parent[attrs.show] = true;
				});
			});

			// When the dialog closes you need to change the state, 
			// otherwise it will not re-open as *watch* will not work.

			$(element).on('hidden.bs.modal', function() {
				scope.$apply(function() {
					scope.$parent[attrs.show] = false;
				});
			});
		}
	}
});
