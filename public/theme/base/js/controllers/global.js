function GlobalCtrl($scope, $location, $rootScope) {
    $rootScope.locationParam = [];
    $rootScope.pre = false;
    var locationsParam = $scope.$location.path().split('/');
    $.each(locationsParam, function(index, item) {
        if (item && item != '') {
            $rootScope.locationParam.push(item);
        }
    });
    console.log($rootScope.locationParam);

    

    if ($rootScope.isAddress == undefined) {
        $rootScope.isAddress = false;
    }
    $rootScope.addressGiven = function() {
        $rootScope.isAddress = true;
    }
   
    $rootScope.preproduct = function(id) {

        $rootScope.pre = id;


        if ($rootScope.isAddress) {
            $location.path('product/' + $rootScope.pre);
        } else {
            $location.path('page/order');
        }
    }

    $rootScope.postproduct = function() {


        if ($rootScope.pre || $rootScope.isAddress) {
            $location.path('product/' + $rootScope.pre);

        } else {
            $location.path('collections/all');
        }
        $rootScope.pre = false;
    }


    $rootScope.ifdrinks = function() {
        console.log($rootScope.Cart);
        var hasDrink = false;
        $.each($rootScope.Cart, function(index,item) {
            if(item){
              if(!item.productInfo){
                 $.each(item, function(indx,itm) {
                    console.log($rootScope.Cart[index][indx]);
                        if($rootScope.Cart[index][indx].productInfo.productName == 'Pepsi' || $rootScope.Cart[index][indx].productInfo.productName == 'Aquafina' || $rootScope.Cart[index][indx].productInfo.productName == 'Mountain Dew' || $rootScope.Cart[index][indx].productInfo.productName == '7up' || $rootScope.Cart[index][indx].productInfo.productName == 'Mirinda' || $rootScope.Cart[index][indx].productInfo.productName == 'Slice Mango'){
                                    hasDrink = true;
                        }
                 })
              }else{
                  if(item.productInfo.productName == 'Pepsi' || item.productInfo.productName == 'Aquafina' || item.productInfo.productName == 'Mountain Dew' || item.productInfo.productName == '7up' || item.productInfo.productName == 'Mirinda' || item.productInfo.productName == 'Slice Mango'){
                            hasDrink = true;
                }  
              }
            }
        });
        console.log(hasDrink+ 'BDA');
        return hasDrink;
    }

    $rootScope.precollection = function(ids) {

        $rootScope.precoll = ids;
    }

    $rootScope.postcollection = function() {
        if ($rootScope.precoll) {
            $location.path('collections/' + $rootScope.precoll);
        } else {
            window.history.back();
        }
        $rootScope.precoll = false;
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
