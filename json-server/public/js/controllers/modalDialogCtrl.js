'user strict';


/* Controller - ModalDialogCtrl */

managerControllers.controller('ModalDialogCtrl', function($scope, close) {
	$scope.close = function(result) {
		close(result, 500); // close, but give 500ms for bootstrap to animate
	};
});