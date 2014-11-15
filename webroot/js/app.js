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

    // This object controls the CSS class states for each 'piece'.
    $scope.toggles = {
      left: {
        transform: false,
        backActive: false,
        noFlipHelp: false,
        hidePrimaryImg: false,
        hideDescription: false, // Determine whether to show or hide the text description
        hideBackNbrImg1: true,
        hideBackNbrImg2: true,
        hideFrontNbrImg1: true,
        hideFrontNbrImg2: true,
      },
      center: {
        transform: false,
        backActive: false,
        noFlipHelp: false,
        hidePrimaryImg: false,
        hideDescription: false, // Determine whether to show or hide the text description
        hideBackNbrImg1: true,
        hideBackNbrImg2: true,
        hideFrontNbrImg1: true,
        hideFrontNbrImg2: true,
      },
      right: {
        transform: false,
        backActive: false,
        noFlipHelp: false,
        hidePrimaryImg: false,
        hideDescription: false, // Determine whether to show or hide the text description
        hideBackNbrImg1: true,
        hideBackNbrImg2: true,
        hideFrontNbrImg1: true,
        hideFrontNbrImg2: true,
      },
    };

    // Method for toggling classes
    this.classToggle = function($scope, propertyName, piecePosition) {

      var toggles = $scope.toggles;

      if (toggles[piecePosition][propertyName] === true) {
        toggles[piecePosition][propertyName] = false;
      }
      else {
        toggles[piecePosition][propertyName] = true;
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

  // .directive('imagePlacer', function(defaultImage, imagePosition, repeatIndex, replaceImage) {
  //   // console.log($index);
  //   return {
  //     restrict: 'E',
  //     scope: {
  //       primaryImage: '='
  //     },
  //     // template: '<div>{{repeatIndex}}</div>'
  //     // template: '<img class="portfolio" src="{{row.' + repeatIndex + '.primary_image}}" />'

  //     if (imagePosition == 'left') {
  //       if (replaceImage == false) {

  //       }
  //     }
  //   };
  // });

})();