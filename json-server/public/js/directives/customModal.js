'use strict';


managerDirectives.directive('customModal', function($parse) {
	return {
		restrict: 'E',
		replace: true, // Replace with the template below
		transclude: true, // We want to insert custom content inside the directive
		scope: {
			header: '=',
			okText: '@',
			cancelText: '@',
			show: '=',
			//onsubmit: '&',
			onaccept: '&',
			oncancel: '&',
			okDisabled: '='
		},
		//template: $('#dialog-template').html(),
		templateUrl: 'dialog-template.html',
		link: function(scope, element, attrs, ctrl, transclude) {

			scope.modalDialog = {};

			scope.modalDialog.clickOk = function() {
				//debugger;
				//scope.onsubmit();
				scope.onaccept();
			}
			scope.modalDialog.clickCancel = function() {
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

			scope.$watch(function() {
				return scope.okDisabled;
			}, function(newValue, oldValue) {
				if (newValue === oldValue)
					newValue = true; // Set default value.
				
				scope.modalDialog.isOkDisabled = newValue;
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




			// scope.modalDialog.header = attrs.header;
			// scope.modalDialog.okText = attrs.okText;
			// scope.modalDialog.cancelText = attrs.cancelText;

			// var invokerOk = $parse(attrs.onsubmit);
			// var invokerCancel = $parse(attrs.oncancel);

			// scope.modalDialog.clickOk = function() {
			// 	invokerOk(scope);
			// }
			// scope.modalDialog.clickCancel = function() {
			// 	invokerCancel(scope);
			// }
			
			// scope.$watch(attrs.show, function(value) {
			// 	if(value == true)
			// 		$(element).modal('show');
			// 	else
			// 		$(element).modal('hide');
			// });

			// scope.$watch(attrs.okDisabled, function(newValue, oldValue) {
			// 	if (newValue === oldValue)
			// 		newValue = scope.$eval(attrs.okDisabled); // Set default value.
				
			// 	scope.modalDialog.isOkDisabled = newValue;
			// });

		}
	}
});
