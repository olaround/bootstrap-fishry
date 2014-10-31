
function GlobalCtrl($scope, $location, $rootScope) {

 $scope.$on('$locationChangeStart',function(evt, absNewUrl, absOldUrl){
       // $scope.oldUrl = absOldUrl.split('/');
       console.log('start', evt, absNewUrl, absOldUrl);
       $rootScope.prevUrl = absOldUrl.split('/');

     });

 if($rootScope.prevUrl == undefined){
  $rootScope.prevUrl = false;

}

$rootScope.isStoreOpen = true; 

$rootScope.storeTime = function(){


  if(!$rootScope.ThemeSettings.theme_settings.enable_store_timings){
    return;
  }

  var d = new Date();
  var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  $rootScope.currentDay = days[d.getDay()];
  console.log($rootScope.currentDay);

 //$rootScope.ThemeSettings.theme_settings.store_timings = [{start:'11:00',close:'16:00'},{start:'11:00',close:'15:00'},{start:'11:00',close:'15:00'},{start:'11:00',close:'15:00'},{start:'11:00',close:'15:00'},{start:'11:00',close:'15:00'},{start:'11:00',close:'15:00'}];
 
 var schedule =  $rootScope.ThemeSettings.theme_settings.store_timings;
 $rootScope.ThemeSettings.theme_settings.store_start = schedule[d.getDay()].start;
 $rootScope.ThemeSettings.theme_settings.store_close = schedule[d.getDay()].close;


 var currentTime = moment(Date()).format('H');



 if(currentTime >= parseInt($rootScope.ThemeSettings.theme_settings.store_close) && currentTime < parseInt($rootScope.ThemeSettings.theme_settings.store_start)){
  $rootScope.isStoreOpen = false;


} else {
  $rootScope.isStoreOpen = true;
  
}
  //console.log(currentTime);
  
  var closeTime = $rootScope.ThemeSettings.theme_settings.store_close;
  var startTime = $rootScope.ThemeSettings.theme_settings.store_start;
  $rootScope.closeTimeMinutes =closeTime.slice(3,5);
  $rootScope.startTimeMinutes =startTime.slice(3,5);

  //console.log($rootScope.closeTimeMinutes);
  if(parseInt($rootScope.ThemeSettings.theme_settings.store_close) > 12){
    $rootScope.closeTimeTemporary = parseInt($rootScope.ThemeSettings.theme_settings.store_close) - 12;
  } else{
   $rootScope.closeTimeTemporary =  parseInt($rootScope.ThemeSettings.theme_settings.store_close);
 }

 if(parseInt($rootScope.ThemeSettings.theme_settings.store_start) > 12){
  $rootScope.startTimeTemporary = parseInt($rootScope.ThemeSettings.theme_settings.store_start) - 12;
} else{
  $rootScope.startTimeTemporary =  parseInt($rootScope.ThemeSettings.theme_settings.store_start);
}
//console.log($rootScope.startTimeTemporary);

}

$rootScope.storeTime();

$rootScope.timeCheck = function(){

  var currentTime = moment(Date()).format('H');

  

  if(currentTime >= parseInt($rootScope.ThemeSettings.theme_settings.store_close) && currentTime < parseInt($rootScope.ThemeSettings.theme_settings.store_start)){
    
   $("#myModal1").show();
   $rootScope.StartSubmitOrder = false;
   

 } else if (!$rootScope.ThemeSettings.theme_settings.enable_store_timings) {
   $("#myModal1").hide();
   $rootScope.SubmitOrder($rootScope.PaymentMethod,'/thankyou','clear');

 }else {
   $("#myModal1").hide();
   $rootScope.SubmitOrder($rootScope.PaymentMethod,'/thankyou','clear');
   
 }

 $("#close-popup").click(function(){
  $("#myModal1").hide();
});

} 


$rootScope.Customer.ShippingCountry = 'Pakistan';

$rootScope.Customer.Country = 'Pakistan';

$rootScope.locationVerify = function(){
  if($rootScope.User.info.CustomerEmail && $rootScope.IfCart()){
    $location.path('/confirm');
  } else if (!$rootScope.User.info.CustomerEmail && $rootScope.IfCart()){
    $location.path('/login');
  }
}

$rootScope.redirectHandler = function(){

  if($rootScope.prevUrl == false){
   $rootScope.CheckLogin('/'); 
 } else if($rootScope.prevUrl[$rootScope.prevUrl.length-1] == 'signup'){
  $rootScope.CheckLogin('/'); 
}else if($rootScope.prevUrl[$rootScope.prevUrl.length-1] == 'cart'){
 $rootScope.CheckLogin('confirm'); 
}else if($rootScope.prevUrl[3] && $rootScope.prevUrl[3] == 'reset_password'){
 $rootScope.CheckLogin('/'); 
}else{
 $rootScope.CheckLogin('window.history.back()');
}
console.log($rootScope.prevUrl);
}
$rootScope.redirectHandlerGuest = function(){

 if($rootScope.prevUrl == false){
   $rootScope.CheckLogin('/'); 
 }else if($rootScope.prevUrl[$rootScope.prevUrl.length-1] == 'signup'){
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
 if($rootScope.prevUrl == false){
   $rootScope.CheckLogin('/'); 
 } else if($rootScope.prevUrl[$rootScope.prevUrl.length-1] == 'login' && !$rootScope.IfCart()){
  $rootScope.SignUp('/'); 
} else if($rootScope.prevUrl[$rootScope.prevUrl.length-1] == 'login' && $rootScope.IfCart()){
 $rootScope.SignUp('confirm'); 
}else{
 $rootScope.SignUp('window.history.back()');
}
}


$rootScope.SetCityLocalStorage = function(val,to){

  localStorage.removeItem('Locality');
  localStorage.removeItem('Area');
  localStorage.removeItem('Outlet');

  $rootScope.User.info.LocalityName = null;
  $rootScope.User.info.AreaName = null;
  $rootScope.User.info.outletName = null;


  $rootScope.SetLocalStorageGlobal(val,to);
}

$rootScope.SetLocalityLocalStorage = function(val,to){

  localStorage.removeItem('Area');
  localStorage.removeItem('Outlet');

  $rootScope.User.info.AreaName = null;
  $rootScope.User.info.outletName = null;


  $rootScope.SetLocalStorageGlobal(val,to);
}

$rootScope.SetAreaLocalStorage = function(val,to){


  localStorage.removeItem('Outlet');

  $rootScope.User.info.outletName = null;

  $rootScope.SetLocalStorageGlobal(val,to);
}


$rootScope.SetLocalStorageGlobal = function(val,to){
  localStorage.setItem(to, val);
}

$rootScope.UpdatePaymentMethod = function(Method) {
  $rootScope.PaymentMethod = Method;
}

$rootScope.UpdateCountryName = function(Method) {
  $rootScope.User.info.CountryName = Method;
}

$rootScope.UpdateLocalityName = function(Method) {
  $rootScope.User.info.LocalityName = Method;
}

$rootScope.UpdateAreaName = function(Method) {
  $rootScope.User.info.AreaName = Method;
}

$rootScope.UpdateoutletName = function(Method) {
  $rootScope.User.info.outletName = Method;
}




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

$rootScope.preDeal = function(link){

  $rootScope.deal = link;

  if($rootScope.isAddress){
    $location.path($rootScope.deal);
  } else{
    $location.path('page/order');
  }
}


$rootScope.postDeal = function(){

  if($rootScope.deal){
    $location.path($rootScope.deal);
  } 
}


$rootScope.postproduct = function() {


  if ($rootScope.pre) {
    $location.path('product/' + $rootScope.pre);

  } else if($rootScope.prevUrl[3] == 'product'){

    window.history.back();
  } 

  else  {
    $location.path('collections/all');
  }

  $rootScope.pre = false;
}

$rootScope.hotDealsHandle= function(){
  if($rootScope.PaymentMethod == ""){
    $location.path('page/order');

  } else{
    $location.path('{{ThemeSettings.theme_settings.slide_1_link}}');

  }

}

if($rootScope.isUrl == undefined){
  $rootScope.isUrl = false;
}

$rootScope.urlChange =  function(){

  $rootScope.url = window.location.href;
  $rootScope.isUrl = true;
  
  var ua = navigator.userAgent.toLowerCase();
  $rootScope.isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");

    //console.log($rootScope.isAndroid);
    $rootScope.redirect = $rootScope.url.split('/');
    if ($rootScope.redirect[3] == 'thankyou'){

      $location.path('/');
    } else if ($rootScope.redirect[3] == 'confirm'){

      $location.path('/');
    } else if ($rootScope.redirect[4] == 'app' && !$rootScope.isAndroid){

      $location.path('/app');
    }
    else if ($rootScope.redirect[3] == 'app' && $rootScope.isAndroid  &&  $(window).width() < 500 || $rootScope.redirect[4] == 'app' && $rootScope.isAndroid  &&  $(window).width() < 500)
      window.location.replace('https://play.google.com/store/apps/details?id=com.retailer.dom');
  } 



//console.log($(window).width());
$rootScope.urlChange();

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
  if ($rootScope.precoll && $rootScope.prevUrl[3] != 'cart') {
    $location.path('collections/' + $rootScope.precoll);

  } else if ($rootScope.prevUrl[3] == 'cart') {
    $location.path(window.history.back());
    console.log($rootScope.prevUrl[3]);
  }
  else  {
    $location.path('collections/all');
  }
}

console.log($rootScope.prevUrl);

$rootScope.setLocalStorageData = function(){  


  if(localStorage.getItem('Payment')){

   $rootScope.PaymentMethod = localStorage.getItem('Payment');

 }



 if(localStorage.getItem('City')){

   $rootScope.User.info.CountryName = localStorage.getItem('City');

 }


 if(localStorage.getItem('Locality')){

   $rootScope.User.info.LocalityName = localStorage.getItem('Locality');

 }


 if(localStorage.getItem('Area')){

  $rootScope.User.info.AreaName = localStorage.getItem('Area');

}


if(localStorage.getItem('Outlet')){

 $rootScope.User.info.outletName = localStorage.getItem('Outlet');
 $rootScope.addressGiven();
}

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
  if($rootScope.SettingGeneral){
   if($rootScope.SettingGeneral.settings.meta_title){
     $rootScope.title = $rootScope.SettingGeneral.settings.meta_title;
   }
 }
 $scope.playVideo = true;
 $scope.videoDominos= function() {
     // alert(1);
     $scope.playVideo = true;
     $scope.$apply();

   }
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
      $rootScope.title = item.collectionSeoTitle;
    }
  });

 }

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

  //console.log('start');
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
      //console.log('bda');
      //console.log(item.length);
      //console.log(filters);
      
      $.each(item,function(ind,itm){
        ////console.log(itm.productCollections);
        if(itm.productCollections){
          $.each(itm.productCollections,function(inds,itms){
            //console.log(itms.urlParam);
            //console.log(filters.collection);
            if(itms.urlParam == filters.collection){
              $scope.TotalCounts= parseInt($scope.TotalCounts) + 1;
            }
          });
        }
      });
      
        //console.log($scope.TotalCounts +'asdasdasd');
         //return  $scope.TotalCounts;
         //return Math.ceil($scope.TotalCounts/$scope.pageSize); 

       }
     }
   }
   aeCommerce.filter('startFrom', function() {
    return function(input, start) {
      if(input){
      //console.log(start +  'start');
        //console.log(input +  'inout');
            start = +start; //parse to int
      start = +start; //parse to int
      //console.log(input.slice(start));
      return input.slice(start);
    }else{
      return 0;
    }
  }
});
   aeCommerce.filter('returnTotals', function($rootScope) {
    return function(input) {
    //console.log('---------------bda-------------------');
    //console.log(input);
    var items = 0;
    $.each(input,function(index,item){
      items++;
    });
    $rootScope.productCount = items;
    //console.log('---------------end-------------------');
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
    $rootScope.title = unescape(seoTitle);
    $scope.InitProduct = function(){    
      $.each($rootScope.ListProduct,function(index,item){
       if(item.productUrl == $scope.routeParam){
        $rootScope.title = item.productSeoTitle;
      }
    });
    }


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
    $rootScope.title = unescape(seoTitle);
    $scope.InitPage = function(){   
      $.each($rootScope.ListPage,function(index,item){
       if(item.pageUrl == $scope.routeParam){
        $rootScope.title = item.pageSeoTitle;
      }
    });

    }
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
  $rootScope.title = 'Cart - '+$rootScope.SettingGeneral.settings.meta_title;

  $scope.returnShippingCountry = function(Shipping) {

    var countries = [];
    $.each($rootScope.SettingShipping, function(index, item) {
      var countryName = item.ShippingName.split(',');

      if (countries.indexOf(countryName[0]) == -1) {

        countries.push(countryName[0]);
        var hasCountry = true;
        $.each(countries, function(inde, itm) {

          if (itm == countryName[0]) {
            hasCountry = false;
          }
        });
        if (hasCountry) {

          countries.push(countryName[0]);
        }
      }

    });

    return countries;
  }

  $scope.returnShippingLocality = function(Shipping) {

    var countries = [];
    $.each($rootScope.SettingShipping, function(index, item) {
      var countryName = item.ShippingName.split(',');

      if (countries.indexOf(countryName[1]) == -1) {
        if ($rootScope.User.info.CountryName) {
          if ($rootScope.User.info.CountryName == countryName[0]) {
            countries.push(countryName[1]);
          }
        }

        var hasCountry = true;
        $.each(countries, function(inde, itm) {
          if (itm == countryName[1]) {
            hasCountry = false;
          }
        });
      }

    });
    return countries;
  }




  $scope.returnShippingArea = function(Shipping) {

    var countries = [];
    $.each($rootScope.SettingShipping, function(index, item) {
      var countryName = item.ShippingName.split(',');

      if (countries.indexOf(countryName[2]) == -1) {
        if ($rootScope.User.info.CountryName) {
          if ($rootScope.User.info.LocalityName == countryName[1] && $rootScope.User.info.CountryName == countryName[0]) {
            countries.push(countryName[2]);
          }
        }

        var hasCountry = true;
        $.each(countries, function(inde, itm) {
          if (itm == countryName[2]) {
            hasCountry = false;
          }
        });

      }

    });
    return countries;
  }

  $scope.returnShippingOutlet = function(Shipping) {

    var countries = [];
    $.each($rootScope.SettingShipping, function(index, item) {
      var countryName = item.ShippingName.split(',');

      if (countries.indexOf(countryName[3]) == -1) {

        if ($rootScope.User.info.CountryName) {
          if ($rootScope.User.info.AreaName == countryName[2] && $rootScope.User.info.LocalityName == countryName[1] && $rootScope.User.info.CountryName == countryName[0]) {
            countries.push(countryName[3]);
          }
        }
        var hasCountry = true;
        $.each(countries, function(inde, itm) {

          if (itm == countryName[3]) {
            hasCountry = false;
          }
        });

      }

    });
    return countries;
  }



  //$rootScope.locationValues();
}

function ConfirmCtrl($scope,$location,$rootScope){
  $rootScope.locationParam = [];
  var locationsParam = $scope.$location.path().split('/');  
  $.each(locationsParam,function(index,item){
    if(item && item != ''){
      $rootScope.locationParam.push(item);
    }
  });
  $scope.returnShippingCountry = function(Shipping) {

    var countries = [];
    $.each($rootScope.SettingShipping, function(index, item) {
      var countryName = item.ShippingName.split(',');

      if (countries.indexOf(countryName[0]) == -1) {

        countries.push(countryName[0]);
        var hasCountry = true;
        $.each(countries, function(inde, itm) {

          if (itm == countryName[0]) {
            hasCountry = false;
          }
        });
        if (hasCountry) {

          countries.push(countryName[0]);
        }
      }

    });

    return countries;
  }

  $scope.returnShippingLocality = function(Shipping) {

    var countries = [];
    $.each($rootScope.SettingShipping, function(index, item) {
      var countryName = item.ShippingName.split(',');

      if (countries.indexOf(countryName[1]) == -1) {
        if ($rootScope.User.info.CountryName) {
          if ($rootScope.User.info.CountryName == countryName[0]) {
            countries.push(countryName[1]);
          }
        }

        var hasCountry = true;
        $.each(countries, function(inde, itm) {
          if (itm == countryName[1]) {
            hasCountry = false;
          }
        });
      }

    });
    return countries;
  }




  $scope.returnShippingArea = function(Shipping) {

    var countries = [];
    $.each($rootScope.SettingShipping, function(index, item) {
      var countryName = item.ShippingName.split(',');

      if (countries.indexOf(countryName[2]) == -1) {
        if ($rootScope.User.info.CountryName) {
          if ($rootScope.User.info.LocalityName == countryName[1] && $rootScope.User.info.CountryName == countryName[0]) {
            countries.push(countryName[2]);
          }
        }

        var hasCountry = true;
        $.each(countries, function(inde, itm) {
          if (itm == countryName[2]) {
            hasCountry = false;
          }
        });

      }

    });
    return countries;
  }

  $scope.returnShippingOutlet = function(Shipping) {

    var countries = [];
    $.each($rootScope.SettingShipping, function(index, item) {
      var countryName = item.ShippingName.split(',');

      if (countries.indexOf(countryName[3]) == -1) {

        if ($rootScope.User.info.CountryName) {
          if ($rootScope.User.info.AreaName == countryName[2] && $rootScope.User.info.LocalityName == countryName[1] && $rootScope.User.info.CountryName == countryName[0]) {
            countries.push(countryName[3]);
          }
        }
        var hasCountry = true;
        $.each(countries, function(inde, itm) {

          if (itm == countryName[3]) {
            hasCountry = false;
          }
        });

      }

    });
    return countries;
  }
  $rootScope.title = 'Confirm - '+$rootScope.SettingGeneral.settings.meta_title;
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


  $rootScope.title = 'Login - '+$rootScope.SettingGeneral.settings.meta_title;
}
function ForgotCtrl($scope,$location,$rootScope){
  $rootScope.locationParam = [];
  var locationsParam = $scope.$location.path().split('/');  
  $.each(locationsParam,function(index,item){
    if(item && item != ''){
      $rootScope.locationParam.push(item);
    }
  });
  $rootScope.title = 'Forgot Password - '+$rootScope.SettingGeneral.settings.meta_title;
}
function ResetCtrl($scope,$location,$rootScope){
  $rootScope.locationParam = [];
  var locationsParam = $scope.$location.path().split('/');  
  $.each(locationsParam,function(index,item){
    if(item && item != ''){
      $rootScope.locationParam.push(item);
    }
  });
  $rootScope.title = 'Reset Password - '+$rootScope.SettingGeneral.settings.meta_title;
}
function SignupCtrl($scope,$location,$rootScope){
  $rootScope.locationParam = [];
  var locationsParam = $scope.$location.path().split('/');  
  $.each(locationsParam,function(index,item){
    if(item && item != ''){
      $rootScope.locationParam.push(item);
    }
  });
  $rootScope.title = 'Signup - '+$rootScope.SettingGeneral.settings.meta_title;
}
function ThankyouCtrl($scope,$location,$rootScope,$window){
  $rootScope.locationParam = [];
  var locationsParam = $scope.$location.path().split('/');  
  $.each(locationsParam,function(index,item){
    if(item && item != ''){
      $rootScope.locationParam.push(item);
    }
  });
  $rootScope.title = 'Thankyou - '+$rootScope.SettingGeneral.settings.meta_title;
  $rootScope.myCart = function(){

    ga('require', 'ecommerce', 'ecommerce.js');

    var transaction = {
           'id': $rootScope.OrderInfo.orderid,                // Transaction ID.
           'affiliation': "Domino's Pakistan",                // Affiliation or store name.
            'revenue': $rootScope.ReturnTotal(),              // Grand Total.
            'tax': $rootScope.ReturnTaxPrice()                // Tax.
          };

          console.log(transaction);

          ga('ecommerce:addTransaction', transaction);


          $.each($rootScope.Cart, function(index,item){
            if(item){
              if(!item.productInfo){
                $.each(item,function(indx,itm){
                  if($rootScope.Cart[index][indx].productInfo){
                    var fullCart = $rootScope.Cart[index][indx];
                    var fullCartProductId = $rootScope.Cart[index][indx].productID;
                    var fullCartProductName = $rootScope.Cart[index][indx].productInfo.productName;
                    var fullCartProductPrice = $rootScope.Cart[index][indx].productInfo.productPrice;
                    var fullCartProductQuantity = $rootScope.Cart[index][indx].productInfo.productQuantity;
                    var fullCartProductSKU = $rootScope.Cart[index][indx].productInfo.productSKU;
                    $.each($rootScope.Cart[index][indx].productInfo.productCollections, function(indx,category){
                      var categoryName = category.name;

          //console.log($rootScope.fullCart);
          //console.log($rootScope.fullCart.productInfo.productCollections);
          //console.log( $rootScope.fullCartProductId);
          //console.log($rootScope.fullCartProductName);
          //console.log($rootScope.fullCartProductPrice);
          //console.log($rootScope.fullCartProductQuantity);
          

          if($rootScope.Cart){
            var item = {   
              'id':   $rootScope.OrderInfo.orderid || "Domino's Product",   
                'name': fullCartProductName || "Domino's Product",        // Product name. Required.                               
                'sku' : fullCartProductSKU || "Domino's SKU",
                'category': categoryName || "Domino's Pizza",
                'price': fullCartProductPrice || "Domino's Price",       // Unit price.
                'quantity': fullCartProductQuantity || "Domino's Quantity", // Quantity.
                'currency': 'PKR'                                // Currency
              };

              console.log(item);

              ga('ecommerce:addItem', item);

              ga('ecommerce:send');
            }
          })
}      
})
}
}
})
$rootScope.Cart = {};
$rootScope.SetLocalStorage('Cart');
}
$rootScope.myCart();

 $scope.fireConversion = function() {
 $window.google_trackConversion({
 google_conversion_id : 965411833,
 google_conversion_language : "en",
 google_conversion_format : "2",
 google_conversion_color : "ffffff",
 google_conversion_label : "hLx9CMfa2ggQ-YeszAM",
 google_conversion_value : 0
 });
 }
$scope.fireConversion();
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

  //console.log('start');
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
      //console.log('bda');
      //console.log(item.length);
      //console.log(filters);
      
      $.each(item,function(ind,itm){
        ////console.log(itm.productCollections);
        if(itm.productCollections){
          $.each(itm.productCollections,function(inds,itms){
            //console.log(itms.urlParam);
            //console.log(filters.collection);
            if(itms.urlParam == filters.collection){
              $scope.TotalCounts= parseInt($scope.TotalCounts) + 1;
            }
          });
        }
      });
      
        //console.log($scope.TotalCounts +'asdasdasd');
         //return  $scope.TotalCounts;
         //return Math.ceil($scope.TotalCounts/$scope.pageSize); 

       }
     }
   }

// JavaScript Document

function OrderCtrl($scope, $location, $rootScope,$routeParams) {



  $rootScope.locationParam = [];
  var locationsParam = $scope.$location.path().split('/');
  $.each(locationsParam, function(index, item) {
    if (item && item != '') {
      $rootScope.locationParam.push(item);
    }
  });
  $scope.routeParam = $routeParams.PageUrl;
  $rootScope.title = unescape(seoTitle);
  $scope.InitPage = function(){   
    $.each($rootScope.ListPage,function(index,item){
     if(item.pageUrl == $scope.routeParam){
      $rootScope.title = item.pageSeoTitle;
    }
  });

  }
  $scope.returnShippingCountry = function(Shipping) {

    var countries = [];
    $.each($rootScope.SettingShipping, function(index, item) {
      var countryName = item.ShippingName.split(',');

      if (countries.indexOf(countryName[0]) == -1) {

        countries.push(countryName[0]);
        var hasCountry = true;
        $.each(countries, function(inde, itm) {

          if (itm == countryName[0]) {
            hasCountry = false;
          }
        });
        if (hasCountry) {

          countries.push(countryName[0]);
        }
      }

    });

    return countries;
  }

  $scope.returnShippingLocality = function(Shipping) {

    var countries = [];
    $.each($rootScope.SettingShipping, function(index, item) {
      var countryName = item.ShippingName.split(',');

      if (countries.indexOf(countryName[1]) == -1) {
        if ($rootScope.User.info.CountryName) {
          if ($rootScope.User.info.CountryName == countryName[0]) {
            countries.push(countryName[1]);
          }
        }

        var hasCountry = true;
        $.each(countries, function(inde, itm) {
          if (itm == countryName[1]) {
            hasCountry = false;
          }
        });
      }

    });
    return countries;
  }




  $scope.returnShippingArea = function(Shipping) {

    var countries = [];
    $.each($rootScope.SettingShipping, function(index, item) {
      var countryName = item.ShippingName.split(',');

      if (countries.indexOf(countryName[2]) == -1) {
        if ($rootScope.User.info.CountryName) {
          if ($rootScope.User.info.LocalityName == countryName[1]) {
            countries.push(countryName[2]);
          }
        }

        var hasCountry = true;
        $.each(countries, function(inde, itm) {
          if (itm == countryName[2]) {
            hasCountry = false;
          }
        });

      }

    });
    return countries;
  }

  $scope.returnShippingOutlet = function(Shipping) {

    var countries = [];
    $.each($rootScope.SettingShipping, function(index, item) {
      var countryName = item.ShippingName.split(',');

      if (countries.indexOf(countryName[3]) == -1) {

        if ($rootScope.User.info.CountryName) {
          if ($rootScope.User.info.AreaName == countryName[2]) {
            countries.push(countryName[3]);
          }
        }
        var hasCountry = true;
        $.each(countries, function(inde, itm) {

          if (itm == countryName[3]) {
            hasCountry = false;
          }
        });

      }

    });
    return countries;
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