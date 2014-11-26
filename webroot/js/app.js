(function () {

  angular.module('portfolio')

  .controller('PortfolioController', ['$scope', '$timeout', 'rowsFactory', function ($scope, $timeout, rowsFactory) {

    // Global variables/objects
    // Contains info about all portfolio pieces
    $scope.rows = {};
    // Variable is set to true whenever any piece is expanded (show more is clicked)
    this.show_more_active = false;

    $scope.assignRows = function() {
      rowsFactory.createRows()
        .then(function(rows){
          $scope.rows = rows;
          console.log($scope.rows);
        });
    };

    $scope.assignRows();

    // Stop flip functionality for pieces not in the origin row
    this.preventFlip = function(originPiece, originRow) {
      for (var r = 0; r <= config.row_count_zero; r++) {
        // Exclude origin row, flip is prevented in classToggle() for origin row
        if (r !== originRow) {
          var piecesInRow = $scope.rows["row_" + r.toString()]['toggles'].length - 1;
          for (var p = 0; p <= piecesInRow; p++) {
            if ($scope.rows["row_" + r.toString()]['toggles'][p]['notFlippable'] === false) {
              $scope.rows["row_" + r.toString()]['toggles'][p]['notFlippable'] = true;
              $scope.rows["row_" + r.toString()]['toggles'][p]['fade'] = true;
            }
            else {
              $scope.rows["row_" + r.toString()]['toggles'][p]['notFlippable'] = false;
              $scope.rows["row_" + r.toString()]['toggles'][p]['fade'] = false;
            }
          }
        }
      }
    };

    // See More button functionality. Fades non-origin rows.
    this.seeMore = function($scope, repeatScope, originPiece) {
      var piece = $scope.rows["row_" + repeatScope.toString()]['toggles'][originPiece];

      if ($scope.rows["row_" + repeatScope.toString()]['toggles'][originPiece]['notFlippable'] === false) {
        this.preventFlip(originPiece, repeatScope);
        this.flipToggle($scope, repeatScope, true, originPiece);

        // Set global show more active variable to control fade for more links in origin row
        if (this.show_more_active) {
          this.show_more_active = false;
          piece['showMoreActive'] = false;
        }
        else {
          this.show_more_active = true;
          piece['showMoreActive'] = true;
        }
      }
    };

    // Method for flipping pieces
    this.flipToggle = function($scope, repeatScope, targetOther, originPiece) {
      var toggles = $scope.rows["row_" + repeatScope]['toggles'];

      // Transform/flip classes adding/removing

      // If target piece to transform is not this piece, turn other pieces over and display images
      if (targetOther === true) {

        for (var p = 0; p <= config.pieces_per_row_zero; p++) {
          // Only affect other pieces in the row
          if (p !== originPiece) {

            // If piece is face down
            if (toggles[p]['transform'] === true) {

              // If back is active, and Description is visible
              if (!(toggles[p]['hideDescription'])) {
                // Hide Primary image
                toggles[p]['frontSwapped'] = true;
                toggles[p]['notFlippable'] = true;
                // toggles[p]['backActive'] = false;
                toggles[p]['hidePrimaryImg'] = true;
                // Show neighbor image instead
                toggles[p]['hideFrontNbrImg' + '_' + originPiece.toString()] = false;
                toggles[p]['transform'] = false;

                // preventFlip(originPiece, repeatScope);
              }

              // If back is active and Description is hidden
              if (toggles[p]['hideDescription']) {
                // Return Description and hide neighboring images
                toggles[p]['transform'] = false;
                toggles[p]['notFlippable'] = false;
                // toggles[p]['backActive'] = false;
                loopTimeoutFront(p, toggles, originPiece);
              }
            }

            // If piece is face up
            else {
              // If front is active and Primary image is visible
              if (!(toggles[p]['frontSwapped'])) {
                // Hide description
                toggles[p]['hideDescription'] = true;
                // Show neighbor image on back face
                toggles[p]['hideBackNbrImg' + '_' + originPiece.toString()] = false;
                // toggles[p]['backActive'] = true;
                toggles[p]['notFlippable'] = true;
                // Flip
                toggles[p]['transform'] = true;
              }

              // If front is active but Primary image is hidden
              else if (toggles[p]['frontSwapped']) {
                // Return Primary image and hide neighboring images
                toggles[p]['frontSwapped'] = false;
                // Transform and then swap images after card is done flipping
                toggles[p]['transform'] = true;
                toggles[p]['notFlippable'] = false;
                // toggles[p]['backActive'] = true;
                loopTimeoutBack(p, toggles, originPiece);
              }
            }
          }
        }
      }
      // If target piece is self

      // We can assume that primary image/description is still intact because piece won't be clickable
      // while altered by neighboring pieces
      else {
        if (toggles[originPiece]['transform'] === true) {
          toggles[originPiece]['transform'] = false;
          // toggles[originPiece]['backActive'] = false;
        }
        else {
          toggles[originPiece]['transform'] = true;
          // toggles[originPiece]['backActive'] = true;
        }
      }
    };

    this.classToggle = function($scope, repeatScope, propertyName, targetOther, originPiece) {
      var toggles = $scope.rows["row_" + repeatScope]['toggles'];
      if (toggles[targetPiece][propertyName] === true) {
        toggles[targetPiece][propertyName] = false;
      }
      else {
        toggles[targetPiece][propertyName] = true;
      }
    };

    // Delay flip to back
    loopTimeoutBack = function(p, toggles, originPiece) {
      $timeout(function() {
        // Hide neighbor image, show Primary image
        toggles[p]['hideFrontNbrImg' + '_' + originPiece.toString()] = true;
        toggles[p]['hidePrimaryImg'] = false;
      }, 500);
    };

    // Delay flip to front
    loopTimeoutFront = function(p, toggles, originPiece) {
      $timeout(function() {
        // Hide neighbor image, show Description
        toggles[p]['hideBackNbrImg' + '_' + originPiece.toString()] = true;
        toggles[p]['hideDescription'] = false;
      }, 500);
    };

    // Hover methods
    // this.hoverIn = function(repeatScope) {
    //   repeatScope.hoverStatus = true;
    // };

    // this.hoverOut = function(repeatScope) {
    //   repeatScope.hoverStatus = false;
    // };

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