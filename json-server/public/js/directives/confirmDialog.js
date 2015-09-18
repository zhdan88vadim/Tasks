'use strict';


managerDirectives.directive('confirmDialog', function($parse) {
	return {
		restrict: 'E',
		replace: true, // Replace with the template below
		transclude: true, // We want to insert custom content inside the directive
		scope: {
			header: '@',
			okText: '@',
			cancelText: '@',
			show: '=',
			onsubmit: '&',
			oncancel: '&'
		},
		template: $('#confirm-dialog-template').html(),
		link: function(scope, element, attrs, ctrl, transclude) {
			
			scope.confirmDialog = {};

			scope.confirmDialog.clickOk = function() {
				scope.onsubmit();
			}
			scope.confirmDialog.clickCancel = function() {
				scope.oncancel();
			}

			scope.$watch(function() {
				return scope.show;
			},
			function(value) {
				if(scope.show == true)
					$(element).modal('show');
				else
					$(element).modal('hide');
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
