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






// Skip call initialization.
//if (newValue === oldValue) return;


// if(!elem.inheritedData('augmented')) {
// 	console.log("!elem.inheritedData('augmented')");
// 	//return;
// }

//scope.formSubmitted = false;

// scope.$on('form:submit', function(event, form) {
// 	console.log('submit');
// 	scope.formSubmitted = true;
// 	scope.$apply();
// });

// --------------------------------

// scope.$watch(function() {
// 	return scope.bindModel;
// }, function() {
// 	debugger;
// 	scope.$eval(attr.ngModel + ' = model');
// });

// scope.$watch(attr.ngModel, function(val) {
// 	debugger;
// 	scope.bindModel = val;
// });



// How get name elemetn from angular expression as {{ variable }}
// inputEl = elem[0].querySelector('.form-control[name]');
// inputNgEl = angular.element(inputEl);
// inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

// scope.$watch(scope.bindForm.$name + '.' + scope.elName + '.$error',


// NOT work!
// scope.$watch(function() {
// 	// NOT WORK !!
// 		return formCtrl.$submitted;
// 	}, function(newValue, oldValue) {
// 	console.log(newValue);
// 	scope.formSubmitted = newValue;
// });


// Рабочий вариант
/*When objectEquality == true, inequality of the watchExpression is 
determined according to the angular.equals function. To save the 
value of the object for later comparison, the angular.copy function 
is used. This therefore means that watching complex objects will have 
adverse memory and performance implications.
*/

// scope.$watch(scope.form.$name + '.' + scope.elName + '.$error', 
// 	function(newValue, oldValue) {
// 		var error = scope.form[scope.elName].$error;
// 		scope.requiredError = error.required;
// 		scope.patternError = error.pattern;
// 	}, true);

//-----------------------------------------------------------------

// С этим вариантом нельзя отследить больше одной ошибки,
// т.е. ошибка сменилась не другую ошибку, а состояние не переключалось.
//scope.$watch(scope.form.$name + '.' + scope.elName + '.$valid', 


// scope.$watch(scope.form.$name + '.' + scope.elName + '.$error', 
// 	function(newValue, oldValue) {
// 		var error = scope.form[scope.elName].$error;
// 		scope.requiredError = error.required;
// 		scope.patternError = error.pattern;
// 	});






// managerDirectives.directive('eventSubmit', function() {
// 	return {
// 		require: 'form',
// 		compile: function(elem, attr) {

// 			elem.data('augmented', true);

// 			return function(scope, elem, attr, form) {
// 				elem.on('submit', function() {
// 					scope.$broadcast('form:submit', form);
// 				});
// 			}
// 		}
// 	};
// })