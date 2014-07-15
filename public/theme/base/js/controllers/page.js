// JavaScript Document
function PageCtrl($scope,$location,AzureMobileClient,$rootScope,$routeParams,$cookies) {	
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});
	$scope.routeParam = $routeParams.PageUrl;
	
	$rootScope.title = unescape(seoTitle);
	$scope.InitPage = function(){		
		$.each($rootScope.ListPage,function(index,item){
			if(item.pageUrl == $scope.routeParam){
				$rootScope.title = item.pageSeoTitle + ' - '+$rootScope.SettingGeneral.settings.meta_title;
			}
		});
		
	}
}