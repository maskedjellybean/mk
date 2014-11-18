(function () {

  angular.module('portfolio')

  .controller('PortfolioController', ['$scope','rowsFactory', function ($scope, rowsFactory) {

    $scope.rows = {};
    $scope.toggles = {};

    $scope.assignRows = function() {
      rowsFactory.createRows()
        .then(function(rows){
          $scope.rows = rows;
          console.log($scope.rows);
        });
    };

    $scope.assignRows();

    // Method for toggling CSS classes
    this.classToggle = function($scope, repeatScope, propertyName, targetOther, originPiece) {
      var toggles = $scope.rows["row_" + repeatScope]['toggles'];

      // If asked to transform/flip piece
      if(propertyName === 'transform') {
        // If target piece to transform is not this piece
        if(targetOther === true) {


          // Somehow loop through config and pick out originpiece number, create array

          // loop through new array and set each piece individually
          // Check if already transformed
          if(toggles[targetPiece]['transform'] === true) {
            // Check if back is active
            if (toggles[targetPiece]['backActive'] === true) {
              // Swap front image
              toggles[targetPiece]['frontSwapped'] = true;
              toggles[targetPiece]['notFlippable'] = true;
              toggles[targetPiece]['backActive'] = false;
            }
          }

          // If piece is not already transformed
          else {
            toggles[targetPiece]['backActive'] = true;
            // toggles[targetPiece]['']
            toggles[targetPiece]['transform'] = true;
          }
        }

        // If target piece to transform is self

        // We can assume that primary image/description is still intact because piece won't be clickable
        // while altered by neighboring pieces
        else {
          if (toggles[originPiece]['transform'] === true) {
            toggles[originPiece]['transform'] = false;
            toggles[originPiece]['backActive'] = false;
          }
          else {
            toggles[originPiece]['transform'] = true;
            toggles[originPiece]['backActive'] = true;
          }
        }
      }

      // If some other class
      else {
        if (toggles[targetPiece][propertyName] === true) {
          toggles[targetPiece][propertyName] = false;
        }
        else {
          toggles[targetPiece][propertyName] = true;
        }
      }
    };

    // Hover methods
    this.hoverIn = function(repeatScope) {
      repeatScope.hoverStatus = true;
    };

    this.hoverOut = function(repeatScope) {
      repeatScope.hoverStatus = false;
    };

  }]);

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