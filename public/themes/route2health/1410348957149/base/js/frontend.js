aeCommerce.directive('ngMin', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
            console.log(scope);
        }
    };
});

aeCommerce.directive('colorbox', function($compile, $rootScope){
  return {
    link: function(scope, element, attrs){
      element.click('bind', function(){
        $.colorbox({
          href: attrs.colorbox,
          onComplete: function(){
            $rootScope.$apply(function(){
              var content = $('#cboxLoadedContent');
              $compile(content)($rootScope);      
            })
          }
        });
      });
    }
  };
});