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


	$scope.currentPage = 0;;
	$rootScope.pageSize = 1;

	console.log($rootScope.ListCollection);

	$scope.numberOfPages=function(){
		// console.log($scope.friends.length);
  //       return Math.ceil($scope.friends.length/$scope.pageSize);                
    }	

    
	$rootScope.addToCartEffect = function(){
		$("html, body").animate({ scrollTop: $(".content_bg").offset().top }, 2000);
	}
}
