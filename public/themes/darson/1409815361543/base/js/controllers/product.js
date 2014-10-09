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
	
	$rootScope.title = unescape(seoTitle);
	$scope.InitProduct = function(){		
		$.each($rootScope.ListProduct,function(index,item){
			if(item.productUrl == $scope.routeParam){
				$rootScope.title = item.productSeoTitle + ' - '+$rootScope.SettingGeneral.settings.meta_title;
			}
		});
		
	}
}