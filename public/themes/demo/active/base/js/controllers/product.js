// JavaScript Document
function ProductCtrl($scope,$location,AzureMobileClient,$rootScope,$routeParams,$cookies) {	
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});
	$scope.routeParam = $routeParams.ProductName;

	
	$rootScope.addToCartEffect = function(){
		$("html, body").animate({ scrollTop: $(".content_bg").offset().top }, 2000);
	}
}