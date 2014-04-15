// JavaScript Document
function GlobalCtrl($scope,$location,$rootScope){
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

	$rootScope.cartHandler = false;
	$rootScope.enableDropdown = false;
	$rootScope.mouseHover = false;

	$rootScope.openMenu = function(){
		console.log('clicked');
		$rootScope.enableDropdown = !$rootScope.enableDropdown;		
	}


	$rootScope.isCartOpen = function(){
		console.log('open cat bhai g');
		$rootScope.cartHandler = !$rootScope.cartHandler;
	}

	$rootScope.mouseEnterItem = function(){
		$rootScope.mouseHover	= true;
	}
	$rootScope.mouseLeaveItem = function(){
		$rootScope.mouseHover	= true;
	} 

}
