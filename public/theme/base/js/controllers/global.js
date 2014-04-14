// JavaScript Document
function GlobalCtrl($scope,$location,$rootScope){
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});
	/*if($location.path() == 'page/order' ||  $location.path() == 'collections/all'){
      
     

	}else {
		ng-class="{Active:}"
	}*/
	console.log($rootScope.locationParam);
}
