function GlobalCtrl($scope,$location,$rootScope){



	$scope.$on('$locationChangeStart',function(evt, absNewUrl, absOldUrl){
       // $scope.oldUrl = absOldUrl.split('/');
			console.log('start', evt, absNewUrl, absOldUrl);
		    $rootScope.prevUrl = absOldUrl.split('/');
        });
		$rootScope.redirectHandler = function(){
			
               if($rootScope.prevUrl[$rootScope.prevUrl.length-1] == 'signup'){
                          $rootScope.CheckLogin('/'); 
                }else if($rootScope.prevUrl[$rootScope.prevUrl.length-1] == 'cart'){
					  $rootScope.CheckLogin('confirm'); 
                }else if($rootScope.prevUrl[3] && $rootScope.prevUrl[3] == 'reset_password'){
					  $rootScope.CheckLogin('/'); 
                }else{
					  $rootScope.CheckLogin('window.history.back()');
					  }
       }
	   $rootScope.redirectHandlerGuest = function(){
		   console.log($rootScope.prevUrl[$rootScope.prevUrl.length-1]);
               if($rootScope.prevUrl[$rootScope.prevUrl.length-1] == 'signup'){
                          $rootScope.GuestLogin('/'); 
			   }else if($rootScope.prevUrl[$rootScope.prevUrl.length-1] == 'cart'){
				  $rootScope.GuestLogin('confirm'); 
			   }else if($rootScope.prevUrl[3] && $rootScope.prevUrl[3] == 'reset_password'){
					  $rootScope.CheckLogin('/'); 
                }else{
				  $rootScope.GuestLogin('window.history.back()');
				  }
       }
	   
	   $rootScope.redirectHandlerSignup = function(){
               if($rootScope.prevUrl[$rootScope.prevUrl.length-1] == 'login' && !$rootScope.IfCart()){
                          $rootScope.SignUp('/'); 
                  } else if($rootScope.prevUrl[$rootScope.prevUrl.length-1] == 'login' && $rootScope.IfCart()){
					  $rootScope.SignUp('confirm'); 
                  }else{
					  $rootScope.SignUp('window.history.back()');
					  }
       }
	   

       
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});

	$rootScope.preproduct= function(productUrl){

		$rootScope.popupProductUrl = productUrl;
		console.log($rootScope.popupProductUrl);
	}
}

function HomeCtrl($scope,$location,$rootScope){

	
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});

	// $scope.carouselPrev = function(){
 //   		$('#myCarousel').carousel('prev');
	// };
	// $scope.carouselNext = function(){
 //   		$('#myCarousel').carousel('next');
	// };

}

function CollectionCtrl($scope,$location,AzureMobileClient,$rootScope,$routeParams,$cookies,$http) {
	$scope.priceRange = {
		name: 'Price Range',
		minPrice: 0,
		maxPrice: 0
	  };
   $scope.SearchVendorsearch = {};
   $rootScope.productCount = 0;	
   $scope.hasBrandInCollection = function(VendorId){
	   var hasVendor = false;
	   var vendorCounts = 0;
	   $.each($rootScope.ListProduct,function(index,item){
		   var condition = 0;
		   if(item.productVendor == VendorId){
			   condition++;
		   }
		   if(item.productCollections){
			   if(typeof(item.productCollections) == 'object'){
				   //console.log(item.productCollections);
				   $.each(item.productCollections,function(indCol,itemCol){
						if($scope.routeParam == itemCol.urlParam){
							console.log(item);
							condition++;
						}
				   });
			   }
			   if(condition >= 2){
				   console.log(item);
					hasVendor = true;
					vendorCounts++;
					if(!item.productMultiOptions){
						if(item.productPrice && $scope.priceRange.maxPrice < item.productPrice){
							$scope.priceRange.maxPrice = item.productPrice;
						}
					}else{
						var price = $rootScope.returnPrice(item);
						if(price && $scope.priceRange.maxPrice < price){
							$scope.priceRange.maxPrice = item.productPrice;
						}
					}
			   }
		   }
	   });
	   return vendorCounts;
   }
   $scope.SearchVendorsearchReturn = function(items){
	   //console.log(items);
	   var hasItemsPre = false;
	  $.each($scope.SearchVendorsearch,function(ind,itm){
				if(itm == true){
					hasItemsPre = true;
				}
		});
	if(!hasItemsPre){
		return items;
	}
   	//console.log('acho');
	//console.log(items);
	//console.log($scope.SearchVendorsearch);
	var pushItems = [];
		var hasItems = false;
		$.each($scope.SearchVendorsearch,function(ind,itm){
			if(items.productVendor){
				if(ind == items.productVendor && itm == true){
					hasItems = true;
				}
			}
		});
		//console.log(hasItems);
		////console.log(hasItems);
		if(hasItems){
			return items;
		}else{
			return false;
		}
   }
   $scope.SearchMinMaxPriceReturn = function(items){
	var pushItems = [];
		var hasItems = false;
		
		if(!items.productMultiOptions){
			if(items.productPrice >= $scope.priceRange.minPrice && items.productPrice <= $scope.priceRange.maxPrice){
				hasItems = true;
			}
		}else{
			var price = $rootScope.returnPrice(items);
			if(price >= $scope.priceRange.minPrice && price <= $scope.priceRange.maxPrice){
				hasItems = true;
			}
		}
		
		
		if(hasItems){
			return items;
		}else{
			return false;
		}
   }
   $rootScope.productCount = 0;	
   $scope.routeParam = $routeParams.CollectionName;
	$scope.init = function(){
		$scope.startFromPage = 0;
		$scope.pageLimit = 6;
	}
	$scope.totalProducts = 0;
	$scope.noOfPages = [];
	$scope.addProductCount = function(){
		$scope.totalProducts = $scope.totalProducts + 1;
	}
	$scope.expectedPages = 0;
	$scope.pagesCounts = function(){
		$scope.noOfPages = [];
		if($rootScope.productCount){
			var pagesToBe = parseInt($rootScope.productCount / $scope.pageLimit);
			var extras = $rootScope.productCount % $scope.pageLimit;
			if(extras > 0){
				pagesToBe  = pagesToBe + 1;
			}
			$scope.expectedPages = pagesToBe;
			for(i=1;i<=pagesToBe;i++){
				$scope.noOfPages.push(i);
			}
		}
			return $scope.noOfPages;
		
	}
	$scope.currentPage = 1;
	$scope.returnStateActive = function(id){
		if(($scope.pageLimit * id) == $scope.startFromPage){
			$scope.currentPage = id + 1;
			return true;
		}
		return false;
	}
	
	$scope.selectPage = function(id){
		if(id == 'n'){
			$scope.startFromPage = $scope.startFromPage + $scope.pageLimit;
		}else if(id == 'p'){
			$scope.startFromPage = $scope.startFromPage - $scope.pageLimit;
		}else {
			$scope.startFromPage = id * $scope.pageLimit;
		}
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
aeCommerce.filter('returnTotals', function($rootScope) {
    return function(input) {
		console.log('---------------bda-------------------');
		console.log(input);
		var items = 0;
		$.each(input,function(index,item){
			items++;
		});
		$rootScope.productCount = items;
		console.log('---------------end-------------------');
		return input;
		
    }
});
aeCommerce.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
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
function ForgotCtrl($scope,$location,$rootScope){
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});
}
function ResetCtrl($scope,$location,$rootScope){
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
function AccountCtrl($scope,$location,$rootScope){
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});
}
function OrdersCtrl($scope,$location,$rootScope){
	$rootScope.locationParam = [];
	var locationsParam = $scope.$location.path().split('/');	
	$.each(locationsParam,function(index,item){
		if(item && item != ''){
			$rootScope.locationParam.push(item);
		}
	});
}
function SearchCtrl($scope,$location,AzureMobileClient,$rootScope,$routeParams,$cookies,$http) {
   $rootScope.productCount = 0;	
   $scope.routeParam = $routeParams.CollectionName;
	$scope.init = function(){
		$scope.startFromPage = 0;
		$scope.pageLimit = 3;
	}
	$scope.totalProducts = 0;
	$scope.noOfPages = [];
	$scope.addProductCount = function(){
		$scope.totalProducts = $scope.totalProducts + 1;
	}
	$scope.expectedPages = 0;
	$scope.pagesCounts = function(){
		$scope.noOfPages = [];
		if($rootScope.productCount){
			var pagesToBe = parseInt($rootScope.productCount / $scope.pageLimit);
			var extras = $rootScope.productCount % $scope.pageLimit;
			if(extras > 0){
				pagesToBe  = pagesToBe + 1;
			}
			$scope.expectedPages = pagesToBe;
			for(i=1;i<=pagesToBe;i++){
				$scope.noOfPages.push(i);
			}
		}
			return $scope.noOfPages;
		
	}
	$scope.currentPage = 1;
	$scope.returnStateActive = function(id){
		if(($scope.pageLimit * id) == $scope.startFromPage){
			$scope.currentPage = id + 1;
			return true;
		}
		return false;
	}
	
	$scope.selectPage = function(id){
		if(id == 'n'){
			$scope.startFromPage = $scope.startFromPage + $scope.pageLimit;
		}else if(id == 'p'){
			$scope.startFromPage = $scope.startFromPage - $scope.pageLimit;
		}else {
			$scope.startFromPage = id * $scope.pageLimit;
		}
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



function check(input) {
        if (input.value != document.getElementById('Password').value) {
            input.setCustomValidity('The Password and Confirm Password must match.');
        } else {
            // input is valid -- reset the error message
            input.setCustomValidity('');
       }
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
