// JavaScript Document

function OrderCtrl($scope, $location, $rootScope) {

    $rootScope.ServiceType ='C O D';

    $rootScope.locationParam = [];
    var locationsParam = $scope.$location.path().split('/');
    $.each(locationsParam, function(index, item) {
        if (item && item != '') {
            $rootScope.locationParam.push(item);
        }
    });


    $scope.returnShippingCountry = function(Shipping) {

        var countries = [];
        $.each($rootScope.SettingShipping, function(index, item) {
            var countryName = item.ShippingName.split(',');

            if (countries.indexOf(countryName[0]) == -1) {
                console.log(countryName);
                countries.push(countryName[0]);
                var hasCountry = true;
                $.each(countries, function(inde, itm) {
                    console.log(itm);
                    if (itm == countryName[0]) {
                        hasCountry = false;
                    }
                });
                if (hasCountry) {
                    console.log(countryName[0]);
                    countries.push(countryName[0]);
                }
            }

        });
        console.log(countries);
        return countries;
    }


    $scope.returnShippingLocality = function(Shipping) {

        var countries = [];
        $.each($rootScope.SettingShipping, function(index, item) {
            var countryName = item.ShippingName.split(',');

            if (countries.indexOf(countryName[1]) == -1) {
                console.log(countryName);
                if ($scope.CountryName) {
                    if ($scope.CountryName == countryName[0]) {
                        countries.push(countryName[1]);
                    }
                }
                
                var hasCountry = true;
                $.each(countries, function(inde, itm) {
                    console.log(itm);
                    if (itm == countryName[1]) {
                        hasCountry = false;
                    }
                });
            }

        });
        console.log(countries);
        return countries;
    }


    

    $scope.returnShippingArea = function(Shipping) {

        var countries = [];
        $.each($rootScope.SettingShipping, function(index, item) {
            var countryName = item.ShippingName.split(',');

            if (countries.indexOf(countryName[2]) == -1) {
                console.log(countryName);
                if ($scope.CountryName) {
                    if ($scope.LocalityName == countryName[1]) {
                        countries.push(countryName[2]);
                    }
                }
                
                var hasCountry = true;
                $.each(countries, function(inde, itm) {
                    console.log(itm);
                    if (itm == countryName[2]) {
                        hasCountry = false;
                    }
                });

            }

        });
        console.log(countries);
        return countries;
    }

      $scope.returnShippingOutlet = function(Shipping) {

        var countries = [];
        $.each($rootScope.SettingShipping, function(index, item) {
            var countryName = item.ShippingName.split(',');

            if (countries.indexOf(countryName[3]) == -1) {
                console.log(countryName);
                if ($scope.CountryName) {
                    if ($scope.AreaName == countryName[2]) {
                        countries.push(countryName[3]);
                    }
                }
                var hasCountry = true;
                $.each(countries, function(inde, itm) {
                    console.log(itm);
                    if (itm == countryName[3]) {
                        hasCountry = false;
                    }
                });
                
            }

        });
        console.log(countries);
        return countries;
    }

    
    
    

}
