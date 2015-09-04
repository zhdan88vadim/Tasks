var managerDirectives = angular.module('managerDirectives', []);

managerDirectives.directive('customModal', function() {
	return {
		restrict: 'E',
		replace: true, // Replace with the template below
		transclude: true, // we want to insert custom content inside the directive
		scope: true, // Then soon we just pererzapishem scope, too, that {}.
		// scope: {
		// },
		template: '<div class="modal fade">' + 
		'<div class="modal-dialog">' + 
		'<div class="modal-content">' + 
		'<div class="modal-header">' + 
		'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
		'<h4 ng-bind-html="dialog.header" class="modal-title"></h4>' + 
		'</div>' + 
		'<div class="modal-body" ng-transclude></div>' + 
		'<div class="modal-footer">'+
		'<button type="button" class="btn btn-default" data-dismiss="modal">Close window</button>' +
		'<button type="button" class="btn btn-primary">Submit</button>' +
		'</div>' +
		'</div>' + 
		'</div>' + 
		'</div>',
		link: function($scope, element, attrs, ctrl, transclude) {
			$scope.dialog.header = attrs.header;

			$scope.$watch(attrs.visible, function(value) {
				if(value == true)
					$(element).modal('show');
				else
					$(element).modal('hide');
			});

			$(element).on('shown.bs.modal', function(){
				$scope.$apply(function() {
					$scope.$parent[attrs.visible] = true;
				});
			});

			$(element).on('hidden.bs.modal', function(){
				$scope.$apply(function() {
					$scope.$parent[attrs.visible] = false;
				});
			});

			// transclude($scope, function(clone, $scope) {
			// 	element.append(clone);
			// });
		}
	}
});