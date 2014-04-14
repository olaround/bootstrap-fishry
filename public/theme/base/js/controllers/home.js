// JavaScript Document
function HomeCtrl($scope,$location,$rootScope,$timeout){
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});

	$rootScope.addToCartEffect = function(){
		$("html, body").animate({ scrollTop: $(".content_bg").offset().top }, 2000);
	}
}
