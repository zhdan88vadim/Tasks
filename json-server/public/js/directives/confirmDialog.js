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




			//---------- OLD --------

			// scope.confirmDialog.header = attrs.header;
			// scope.confirmDialog.okText = attrs.okText;
			// scope.confirmDialog.cancelText = attrs.cancelText;

			// var invokerOk = $parse(attrs.onsubmit);
			// var invokerCancel = $parse(attrs.oncancel);

			// scope.clickOk = function() {
			// 	invokerOk(scope);
			// }
			// scope.clickCancel = function() {
			// 	invokerCancel(scope);
			// }

			//----------------------------------------------

			// scope.$parent["model.showModal"]

			// Note
			// Этот код нужен в том случае если используется параметр transclude: true
			// и в шаблоне HTML, который скопирывался мы хотим использовать scope созданный в директиве.
			// иначи в шаблоне HTML используется scope контроллера.
			// http://angular-tips.com/blog/2014/03/transclusion-and-scopes/

			// transclude(scope, function(clone, scope) {
			// 	element.append(clone);
			// });

		}
	}
});
