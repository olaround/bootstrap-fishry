// JavaScript Document
function CollectionCtrl($scope,$location,AzureMobileClient,$rootScope,$routeParams,$cookies) {	
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});
	$scope.routeParam = $routeParams.CollectionName;
	$rootScope.title = unescape(seoTitle);
	$scope.InitCollection = function(){
		console.log($scope.routeParam);
		if($scope.routeParam == 'all'){
			$rootScope.title = $rootScope.SettingGeneral.settings.meta_title;
			return true;
		}
		$.each($rootScope.ListCollection,function(index,item){
			if(item.collectionUrl == $scope.routeParam){
				$rootScope.title = item.collectionSeoTitle + ' - '+$rootScope.SettingGeneral.settings.meta_title;
			}
		});
		
	}
	
	
}
