(function () {

  angular.module('portfolio')

  .factory('rowsFactory', function($http, $q) {
    delete $http.defaults.headers.common['X-Requested-With'];

    var target = 'http://www.benteegarden.com/api/megan.jsonp?callback=JSON_CALLBACK';
    var piecesCount;
    var secondaryImages = {};
    // Create rows object to contain pieces objects
    var rows = {};
    // Create empty service
    var service = {};

    service.createRows = function() {
      var deferred = $q.defer();
      $http({
        method: 'JSONP',
        url: target
      }).success(function(data) {
        pieces = data.portfolio;
        piecesCount = pieces.length;
        // var primaryImages = {};

        // @todo preload images

        // Loop through all pieces
        for (var p = 0; p < piecesCount; p++) {

          // Create new image arrays with the current piece number appended
          secondaryImages["piece_" + [p]] = [];
          // primaryImages["piece_" + [p]] = [];

          // Make images an array
          // (Views JSON is stupid about multiple value fields and puts them in a commented string list)
          var images = pieces[p].images;
          images = images.split(",");
          pieces[p].images = images;

          // Loop through images array for the current piece
          for (var i = 0; i < images.length; i++) {
            if (i === 0) {
              // Create new object collection of primary images
              // primaryImages["piece_" + [p]].push(images[i]);
              // Add primary image to pieces object
              pieces[p].primary_image = images[i];
            }
            else {
              // Create new object collection of secondary images
              secondaryImages["piece_" + [p]].push(images[i]);
            }
          }
          // Remove images array from pieces object
          delete pieces[p].images;
        }

        // Add neighboring secondary images
        for (p = 0; p < piecesCount; p++) {

          if (config.pieces_per_row === 3) {
            var mod = p % 4;
            // Create empty neighbor_images array
            pieces[p].neighbor_images = [];

            var neighbor1;
            var neighbor2;

            // If left
            if (mod === 0) {
              pieces[p].row_position = 'left';

              neighbor1 = p + 1;
              neighbor1 = "piece_" + neighbor1.toString();
              neighbor1 = secondaryImages[neighbor1][0];
              pieces[p].neighbor_images.center = neighbor1;

              neighbor2 = p + 2;
              neighbor2 = "piece_" + neighbor2.toString();
              neighbor2 = secondaryImages[neighbor2][0];
              pieces[p].neighbor_images.right = neighbor2;
            }
            // If center
            else if (mod === 1) {
              pieces[p].row_position = 'center';

              neighbor1 = p - 1;
              neighbor1 = "piece_" + neighbor1.toString();
              neighbor1 = secondaryImages[neighbor1][0];
              pieces[p].neighbor_images.left = neighbor1;

              neighbor2 = p + 1;
              neighbor2 = "piece_" + neighbor2.toString();
              neighbor2 = secondaryImages[neighbor2][1];
              pieces[p].neighbor_images.right = neighbor2;
            }
            // If right
            else if (mod === 2) {
              pieces[p].row_position = 'right';

              neighbor1 = p - 1;
              neighbor1 = "piece_" + neighbor1.toString();
              neighbor1 = secondaryImages[neighbor1][1];
              pieces[p].neighbor_images.center = neighbor1;

              neighbor2 = p - 2;
              neighbor2 = "piece_" + neighbor2.toString();
              neighbor2 = secondaryImages[neighbor2][1];
              pieces[p].neighbor_images.left = neighbor2;
            }
          }
        }
        for (p = 0; p < piecesCount; p++) {
          if (config.pieces_per_row === 3) {
            if (p % 4 === 0) {
              rows["row_" + p] = pieces.splice(0,3);
            }
          }
        }
        console.log(rows, 'rows');
        deferred.resolve(rows);
      }).error(function() {
        // @todo Should there be some kind of error message?
        deferred.reject();
      });
      return deferred.promise;



      // return rows;

      // console.log(secondaryImages, 'secondary images');
      // console.log(primaryImages, 'primary images');
      // console.log(pieces, 'pieces');
    };
    return service;
  });
})();
