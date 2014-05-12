function GlobalCtrl($scope,$location,$rootScope){
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});
	console.log($rootScope.locationParam);	
}

function HomeCtrl($scope,$location,$rootScope){
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});
}

function CollectionCtrl($scope,$location,AzureMobileClient,$rootScope,$routeParams,$cookies) {	
   $scope.routeParam = $routeParams.CollectionName;
	$scope.init = function(){
		$scope.startFromPage = 0;
		$scope.pageSize = 2;
	}
	$rootScope.locationParam = [];	
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});
	
	console.log('start');
	$scope.nextPage = function(){
		$scope.startFromPage = $scope.startFromPage + 1;
	}
	$scope.previousPage = function(){
		$scope.startFromPage = $scope.startFromPage - 1;
	}
	$scope.returnPages = function(item){
		return Math.ceil(item/$scope.pageSize); 
	}
	$scope.numberOfPages=function(item,filters){
		if(item.length){
			$scope.TotalCounts = 0;
			console.log('bda');
			console.log(item.length);
			console.log(filters);
			
			$.each(item,function(ind,itm){
				//console.log(itm.productCollections);
				if(itm.productCollections){
					$.each(itm.productCollections,function(inds,itms){
						console.log(itms.urlParam);
						console.log(filters.collection);
						if(itms.urlParam == filters.collection){
							$scope.TotalCounts= parseInt($scope.TotalCounts) + 1;
						}
					});
				}
			});
			
				console.log($scope.TotalCounts +'asdasdasd');
				 //return  $scope.TotalCounts;
				 //return Math.ceil($scope.TotalCounts/$scope.pageSize); 
			
		}
    }
}
aeCommerce.filter('startFrom', function() {
    return function(input, start) {
		if(input){
			console.log(start +  'start');
		    console.log(input +  'inout');
       	    start = +start; //parse to int
			start = +start; //parse to int
			console.log(input.slice(start));
        	return input.slice(start);
		}else{
			return 0;
		}
    }
});

function ProductCtrl($scope,$location,AzureMobileClient,$rootScope,$routeParams,$cookies) {	
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});
	$scope.routeParam = $routeParams.ProductSlug;
}
function CarouselDemoCtrl($scope) {
  $scope.myInterval = 5000;
  var slides = $scope.slides = [];
  $scope.addSlide = function() {
    var newWidth = 600 + slides.length;
    slides.push({
      image: 'http://placekitten.com/' + newWidth + '/300',
      text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
        ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
    });
  };
  for (var i=0; i<4; i++) {
    $scope.addSlide();
  }
}

function PageCtrl($scope,$location,AzureMobileClient,$rootScope,$routeParams,$cookies) {	
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});
	$scope.routeParam = $routeParams.PageUrl;
}
// JavaScript Document
function CartCtrl($scope,$location,$rootScope){
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});
}

function ConfirmCtrl($scope,$location,$rootScope){
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});
}
// JavaScript Document
function LoginCtrl($scope,$location,$rootScope){
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});
}

function SignupCtrl($scope,$location,$rootScope){
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});
}

function ErrorCtrl($scope,$location,$rootScope){
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});
}
