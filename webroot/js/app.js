(function () {

  angular.module('portfolio')

  .controller('PortfolioController', ['$scope','rowsFactory', function ($scope, rowsFactory) {

    $scope.rows = {};

    $scope.assignRows = function() {
      rowsFactory.createRows()
        .then(function(rows){
          $scope.rows = rows;
          console.log($scope.rows);
        });
    };

    $scope.assignRows();

    $scope.imageAssign = function() {

    };

    this.toggles = {
      transform: false,
      backActive: false,
      noFlipHelp: false,
    };

    // var flipHelp = false;
    // this.flipHelp = flipHelp;

    // console.log(this.toggles.flipHelp);

    // Method for toggling classes
    this.classToggle = function(repeatScope, objectName, propertyName) {
      console.log(this.flipHelp);
      // var propName = propertyName;
      // console.log('class toggle');
      if (this.toggles[propertyName] === true) {
        repeatScope.classToggleVal = false;
        // console.log('class toggle false');
        this.toggles[propertyName] = false;
        console.log(this.toggles[propertyName]);
        return false;
      }
      else {
        repeatScope.classToggleVal = true;
        // console.log('class toggle true');
        this.toggles[propertyName] = true;
        console.log(this.toggles[propertyName]);
        return true;
      }
    };

    // Hover methods
    this.hoverIn = function(repeatScope) {
      repeatScope.hoverStatus = true;
    };

    this.hoverOut = function(repeatScope) {
      repeatScope.hoverStatus = false;
    };

  }])

  .directive('primaryImage', function() {
    return {
      restrict: 'E',
      scope: {
        repeatIndex: '='
      },
      template: '<div>{{repeatIndex}}</div>'
      // template: '<img class="portfolio" src="{{row.' + repeatIndex + '.primary_image}}" />'
    };
  });

})();