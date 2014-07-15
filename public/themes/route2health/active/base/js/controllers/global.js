function GlobalCtrl($scope, $location, $rootScope) {
    $rootScope.locationParam = [];
    var locationsParam = $scope.$location.path().split('/');
    $.each(locationsParam, function(index, item) {
        if (item && item != '') {
            $rootScope.locationParam.push(item);
        }
    });
    //console.log($rootScope.locationParm);	

    $scope.$on('$locationChangeStart', function(evt, absNewUrl, absOldUrl) {
        // $scope.oldUrl = absOldUrl.split('/');
        console.log('start', evt, absNewUrl, absOldUrl);
        $rootScope.prevUrl = absOldUrl.split('/');
    });


    $rootScope.cartHandler = false;
    $rootScope.enableDropdown = false;
    $rootScope.mouseHover = false;

    $rootScope.addToCartEffect = function() {
        $("html, body").animate({
            scrollTop: $("body").offset().top
        }, 1000);
        $rootScope.cartHandler = true;

    }
    $rootScope.openMenu = function() {
        // console.log('clicked');
        // $rootScope.enableDropdown = !$rootScope.enableDropdown;
        if($rootScope.enableDropdown == false || $rootScope.enableDropdown == null) {
        	$('#mobilelink').slideDown(500,'linear');
        	$rootScope.enableDropdown = true;
    	}else if($rootScope.enableDropdown == true) {
        	$('#mobilelink').slideUp(300,'linear');
        	$rootScope.enableDropdown = false; 	
    	}
    }
    $rootScope.isCartOpen = function() {
        $rootScope.cartHandler = !$rootScope.cartHandler;
    }

    $rootScope.mouseEnterItem = function() {
        $rootScope.mouseHover = true;
    }
    $rootScope.mouseLeaveItem = function() {
        $rootScope.mouseHover = true;
    }

    $rootScope.getSidebarPath = function() {
        return BaseUrl + 'partials/sidebar.html';
    }

    $rootScope.getCollectionSidebarPath = function() {
        // return BaseUrl + 'partials/collectionSidebar.html';
        return BaseUrl + 'partials/sidebar.html';

    }

}

function HomeCtrl($scope, $location, $rootScope) {
    $rootScope.locationParam = [];
    var locationsParam = $scope.$location.path().split('/');
    $.each(locationsParam, function(index, item) {
        if (item && item != '') {
            $rootScope.locationParam.push(item);
        }
    });
    if($rootScope.SettingGeneral){
      if($rootScope.SettingGeneral.settings.meta_title){
         $rootScope.title = $rootScope.SettingGeneral.settings.meta_title;
      }
    }
}

function CollectionCtrl($scope, $location, AzureMobileClient, $rootScope, $routeParams, $cookies, $http) {
    $scope.priceRange = {
        name: 'Price Range',
        minPrice: 0,
        maxPrice: 0
    };
    $scope.SearchVendorsearch = {};
    $rootScope.productCount = 0;
    $scope.hasBrandInCollection = function(VendorId) {
        var hasVendor = false;
        var vendorCounts = 0;
        $.each($rootScope.ListProduct, function(index, item) {
            var condition = 0;
            if (item.productVendor == VendorId) {
                condition++;
            }
            if (item.productCollections) {
                if (typeof(item.productCollections) == 'object') {
                    //console.log(item.productCollections);
                    $.each(item.productCollections, function(indCol, itemCol) {
                        if ($scope.routeParam == itemCol.urlParam) {
                            console.log(item);
                            condition++;
                        }
                    });
                }
                if (condition >= 2) {
                    console.log(item);
                    hasVendor = true;
                    vendorCounts++;
                    if (!item.productMultiOptions) {
                        if (item.productPrice && $scope.priceRange.maxPrice < item.productPrice) {
                            $scope.priceRange.maxPrice = item.productPrice;
                        }
                    } else {
                        var price = $rootScope.returnPrice(item);
                        if (price && $scope.priceRange.maxPrice < price) {
                            $scope.priceRange.maxPrice = item.productPrice;
                        }
                    }
                }
            }
        });
        return vendorCounts;
    }
    $scope.SearchVendorsearchReturn = function(items) {
        var hasItemsPre = false;
        $.each($scope.SearchVendorsearch, function(ind, itm) {
            if (itm == true) {
                hasItemsPre = true;
            }
        });
        if (!hasItemsPre) {
            return items;
        }
        var pushItems = [];
        var hasItems = false;
        $.each($scope.SearchVendorsearch, function(ind, itm) {
            if (items.productVendor) {
                if (ind == items.productVendor && itm == true) {
                    hasItems = true;
                }
            }
        });
        if (hasItems) {
            return items;
        } else {
            return false;
        }
    }
    $scope.SearchMinMaxPriceReturn = function(items) {
        var pushItems = [];
        var hasItems = false;

        if (!items.productMultiOptions) {
            if (items.productPrice >= $scope.priceRange.minPrice && items.productPrice <= $scope.priceRange.maxPrice) {
                hasItems = true;
            }
        } else {
            var price = $rootScope.returnPrice(items);
            if (price >= $scope.priceRange.minPrice && price <= $scope.priceRange.maxPrice) {
                hasItems = true;
            }
        }


        if (hasItems) {
            return items;
        } else {
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
        $scope.startFromPage = 0;
        // $scope.pageLimit = $rootScope.ThemeSettings.theme_settings.pagination_limit;
        $scope.pageLimit = 18;
 
    }

    $rootScope.productCount = 0;
    $scope.init = function() {
        $scope.startFromPage = 0;
        $scope.pageLimit = 18;
    }
    $scope.totalProducts = 0;
    $scope.noOfPages = [];
    $scope.addProductCount = function() {
        $scope.totalProducts = $scope.totalProducts + 1;
    }
    $scope.expectedPages = 0;
    $scope.pagesCounts = function() {
        $scope.noOfPages = [];
        if ($rootScope.productCount) {
            var pagesToBe = parseInt($rootScope.productCount / $scope.pageLimit);
            var extras = $rootScope.productCount % $scope.pageLimit;
            if (extras > 0) {
                pagesToBe = pagesToBe + 1;
            }
            $scope.expectedPages = pagesToBe;
            for (i = 1; i <= pagesToBe; i++) {
                $scope.noOfPages.push(i);
            }
        }
        return $scope.noOfPages;

    }
    $scope.currentPage = 1;
    $scope.returnStateActive = function(id) {
        if (($scope.pageLimit * id) == $scope.startFromPage) {
            $scope.currentPage = id + 1;
            return true;
        }
        return false;
    }

    $scope.selectPage = function(id) {
        if (id == 'n') {
            $scope.startFromPage = $scope.startFromPage + $scope.pageLimit;
        } else if (id == 'p') {
            $scope.startFromPage = $scope.startFromPage - $scope.pageLimit;
        } else {
            $scope.startFromPage = id * $scope.pageLimit;
        }
    }
    $rootScope.locationParam = [];
    var locationsParam = $scope.$location.path().split('/');
    $.each(locationsParam, function(index, item) {
        if (item && item != '') {
            $rootScope.locationParam.push(item);
        }
    });

    console.log('start');
    $scope.nextPage = function() {
        $scope.startFromPage = $scope.startFromPage + 1;
    }
    $scope.previousPage = function() {
        $scope.startFromPage = $scope.startFromPage - 1;
    }
    $scope.returnPages = function(item) {
        return Math.ceil(item / $scope.pageSize);
    }
    $scope.numberOfPages = function(item, filters) {
        if (item.length) {
            $scope.TotalCounts = 0;
            console.log('bda');
            console.log(item.length);
            console.log(filters);

            $.each(item, function(ind, itm) {
                //console.log(itm.productCollections);
                if (itm.productCollections) {
                    $.each(itm.productCollections, function(inds, itms) {
                        console.log(itms.urlParam);
                        console.log(filters.collection);
                        if (itms.urlParam == filters.collection) {
                            $scope.TotalCounts = parseInt($scope.TotalCounts) + 1;
                        }
                    });
                }
            });

            console.log($scope.TotalCounts + 'asdasdasd');
            //return $scope.TotalCounts;
            //return Math.ceil($scope.TotalCounts/$scope.pageSize);

        }
    }
}
aeCommerce.filter('startFrom', function() {
    return function(input, start) {
        if (input) {
            console.log(start + 'start');
            console.log(input + 'inout');
            start = +start; //parse to int
            start = +start; //parse to int
            console.log(input.slice(start));
            return input.slice(start);
        } else {
            return 0;
        }
    }
});
aeCommerce.filter('returnTotals', function($rootScope) {
    return function(input) {
        console.log('---------------bda-------------------');
        console.log(input);
        var items = 0;
        $.each(input, function(index, item) {
            items++;
        });
        $rootScope.productCount = items;
        console.log('---------------end-------------------');
        return input;

    }
});
aeCommerce.directive('dynamic', function($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function(scope, ele, attrs) {
            scope.$watch(attrs.dynamic, function(html) {
                ele.html(html);
                $compile(ele.contents())(scope);
            });
        }
    };
});



function ProductCtrl($scope, $location, AzureMobileClient, $rootScope, $routeParams, $cookies) {
    $rootScope.locationParam = [];
    var locationsParam = $scope.$location.path().split('/');
    $.each(locationsParam, function(index, item) {
        if (item && item != '') {
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

    console.log($rootScope.prevUrl[$rootScope.prevUrl.length-1]);
    $scope.likeURL = 'http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.route2health.fishry.com%2F' + $routeParams.ProductSlug + '&amp;send=false&amp;layout=button_count&amp;width=150&amp;show_faces=false&amp;font&amp;colorscheme=light&amp;action=like&amp;height=21&amp;appId=286715611395896';
    
    $rootScope.productDetailPage = function(newUrl){
        // var urlDetailPage = '/product/' + $routeParams.ProductSlug;
        $location.path('/product/' + newUrl);
    } 
}

function CarouselDemoCtrl($scope) {
    $scope.myInterval = 5000;
    var slides = $scope.slides = [];
    $scope.addSlide = function() {
        var newWidth = 600 + slides.length;
        slides.push({
            image: 'http://placekitten.com/' + newWidth + '/300',
            text: ['More', 'Extra', 'Lots of', 'Surplus'][slides.length % 4] + ' ' + ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
        });
    };
    for (var i = 0; i < 4; i++) {
        $scope.addSlide();
    }
}

function PageCtrl($scope, $location, AzureMobileClient, $rootScope, $routeParams, $cookies) {
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

    // console.log('qwerty');
    $rootScope.askDoctor = {}
    // console.log($rootScope.SettingGeneral.contactEmail)

    $rootScope.sendaskDoctorEmail = function() {
        // console.log($rootScope.askDoctor);
        // console.log($rootScope.SettingGeneral.contactEmail);
        $rootScope.emailTo = $rootScope.SettingGeneral.contactEmail;
        // $rootScope.emailTo   = 'jahanzaibaslam@outlook.com';
        $rootScope.byFrom = $rootScope.askDoctor.Email;
        $rootScope.toBCC = '';
        $rootScope.subjectEmail = 'Ask a Doctor Query';
        $rootScope.emailBody = '<h1>Contact Details</h1><table style="width:300px"><tr><td>First Name</td><td>Last Name</td><td>Email</td><td>Phone</td><td>City</td> <td>Postal Addess</td></tr><tr><td>' + $rootScope.askDoctor.FirstName + '</td><td>' + $rootScope.askDoctor.LastName + '</td> <td>' + $rootScope.askDoctor.Email + '</td><td>' + $rootScope.askDoctor.Phone + '</td><td>' + $rootScope.askDoctor.City + '</td><td>' + $rootScope.askDoctor.PostalAddress + '</td></tr></table><h1>Personal Information</h1><table style="width:300px"><tr><td>Gender</td><td>Weight</td><td>Height</td> <td>Health Concern</td></tr><tr><td>' + $rootScope.askDoctor.gender + '</td><td>' + $rootScope.askDoctor.weight + '</td><td>' + $rootScope.askDoctor.height + '</td><td>' + $rootScope.askDoctor.healthConcern + '</td></tr></table>';
        var dataEmail = {
            data: $rootScope.emailBody,
            email: $rootScope.emailTo,
            subject: $rootScope.subjectEmail,
            toBCC: $rootScope.toBCC,
            byFrom: $rootScope.byFrom,
            fromName: $rootScope.storeName
        };
        $rootScope.sendEmail(dataEmail);

        $location.path('/page/askdoctorthanks');
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

    $scope.limitCartProductQuantity = function(item) {
        if(item.quantity > 1) {
            item.quantity = item.quantity-1;
        }
        return item.quantity;
    }


}

function ConfirmCtrl($scope,$location,$rootScope){
    $rootScope.locationParam = [];
    var locationsParam = $scope.$location.path().split('/');    
    $.each(locationsParam,function(index,item){
        if(item && item != ''){
            $rootScope.locationParam.push(item);
        }
    });
    $rootScope.title = 'Confirm - '+$rootScope.SettingGeneral.settings.meta_title;
}

// JavaScript Document
function LoginCtrl($scope, $location, $rootScope) {
    console.log(document.referrer);

    $rootScope.locationParam = [];
    var locationsParam = $scope.$location.path().split('/');
    $.each(locationsParam, function(index, item) {
        if (item && item != '') {
            $rootScope.locationParam.push(item);
        }
    });
    $rootScope.title = 'Login - '+$rootScope.SettingGeneral.settings.meta_title;

    $rootScope.redirectHandler = function() {
        if ($rootScope.prevUrl[$rootScope.prevUrl.length - 1] == 'cart' && $rootScope.IfCart()) {
            $rootScope.CheckLogin('confirm');
        } else {
            $rootScope.CheckLogin('window.history.back()');
        }
    }
}

function askDoctor($scope, $location, $rootScope) {
    $rootScope.locationParam = [];
    var locationsParam = $scope.$location.path().split('/');
    $.each(locationsParam, function(index, item) {
        if (item && item != '') {
            $rootScope.locationParam.push(item);
        }
    });

    console.log(SettingGeneral.settings)

    $rootScope.sendEmail = function() {
        console.log(SettingGeneral.settings)
        // $rootScope.emailTo   = $rootScope.submitedOrder.userInfo.Email;
        // $rootScope.byFrom = $rootScope.SettingGeneral.contactEmail;
        // $rootScope.toBCC = '';
        // $rootScope.subjectEmail = 'Order confirmation for order '+$rootScope.submitedOrder.id;  
        // $rootScope.emailBody =  $('#orderConfirmation').html();
        // var dataEmail = {data: $rootScope.emailBody, email: $rootScope.emailTo, subject: $rootScope.subjectEmail, toBCC: $rootScope.toBCC, byFrom: $rootScope.byFrom, fromName: $rootScope.storeName};
        // $rootScope.sendEmail(dataEmail);
    }
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
function ThankyouCtrl($scope,$location,$rootScope){
  $rootScope.locationParam = [];
  var locationsParam = $scope.$location.path().split('/');  
  $.each(locationsParam,function(index,item){
    if(item && item != ''){
      $rootScope.locationParam.push(item);
    }
  });
  $rootScope.title = 'Thankyou - '+$rootScope.SettingGeneral.settings.meta_title;

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

function SearchCtrl($scope, $location, AzureMobileClient, $rootScope, $routeParams, $cookies, $http) {
    $rootScope.productCount = 0;
    $scope.routeParam = $routeParams.CollectionName;
    $scope.init = function() {
        $scope.startFromPage = 0;
        $scope.pageLimit = 18;
    }
    $scope.totalProducts = 0;
    $scope.noOfPages = [];
    $scope.addProductCount = function() {
        $scope.totalProducts = $scope.totalProducts + 1;
    }
    $scope.expectedPages = 0;
    $scope.pagesCounts = function() {
        $scope.noOfPages = [];
        if ($rootScope.productCount) {
            var pagesToBe = parseInt($rootScope.productCount / $scope.pageLimit);
            var extras = $rootScope.productCount % $scope.pageLimit;
            if (extras > 0) {
                pagesToBe = pagesToBe + 1;
            }
            $scope.expectedPages = pagesToBe;
            for (i = 1; i <= pagesToBe; i++) {
                $scope.noOfPages.push(i);
            }
        }
        return $scope.noOfPages;

    }
    $scope.currentPage = 1;
    $scope.returnStateActive = function(id) {
        if (($scope.pageLimit * id) == $scope.startFromPage) {
            $scope.currentPage = id + 1;
            return true;
        }
        return false;
    }

    $scope.selectPage = function(id) {
        if (id == 'n') {
            $scope.startFromPage = $scope.startFromPage + $scope.pageLimit;
        } else if (id == 'p') {
            $scope.startFromPage = $scope.startFromPage - $scope.pageLimit;
        } else {
            $scope.startFromPage = id * $scope.pageLimit;
        }
    }
    $rootScope.locationParam = [];
    var locationsParam = $scope.$location.path().split('/');
    $.each(locationsParam, function(index, item) {
        if (item && item != '') {
            $rootScope.locationParam.push(item);
        }
    });

    console.log('start');
    $scope.nextPage = function() {
        $scope.startFromPage = $scope.startFromPage + 1;
    }
    $scope.previousPage = function() {
        $scope.startFromPage = $scope.startFromPage - 1;
    }
    $scope.returnPages = function(item) {
        return Math.ceil(item / $scope.pageSize);
    }
    $scope.numberOfPages = function(item, filters) {
        if (item.length) {
            $scope.TotalCounts = 0;
            console.log('bda');
            console.log(item.length);
            console.log(filters);

            $.each(item, function(ind, itm) {
                //console.log(itm.productCollections);
                if (itm.productCollections) {
                    $.each(itm.productCollections, function(inds, itms) {
                        console.log(itms.urlParam);
                        console.log(filters.collection);
                        if (itms.urlParam == filters.collection) {
                            $scope.TotalCounts = parseInt($scope.TotalCounts) + 1;
                        }
                    });
                }
            });

            console.log($scope.TotalCounts + 'asdasdasd');
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

function ErrorCtrl($scope, $location, $rootScope) {
    $rootScope.locationParam = [];
    var locationsParam = $scope.$location.path().split('/');
    $.each(locationsParam, function(index, item) {
        if (item && item != '') {
            $rootScope.locationParam.push(item);
        }
    });
}
