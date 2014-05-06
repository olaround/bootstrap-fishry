// JavaScript Document
function CartCtrl($scope,$location,$rootScope){
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});

	$scope.limitCartProductQuantity = function(qty){
		// console.log(qty);
		if(qty > 1){
			qty = qty -1;
		}
		return qty;
	}
}
