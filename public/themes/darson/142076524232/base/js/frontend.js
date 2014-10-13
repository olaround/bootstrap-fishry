aeCommerce.directive('ngMin', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
            console.log(scope);
        }
    };
});
