(function() {

  // Set number of pieces per row. Choose between 3 and 2.
  config.pieces_per_row = 3;

  // Global variables that need to be available for controllers and stuff
  config.pieces_count = null;
  config.row_count = null;
  // Zero indexed global variables
  config.pieces_per_row_zero = config.pieces_per_row - 1;
  config.pieces_count_zero = null;
  config.row_count_zero = null;

  angular.module('portfolio')

  .factory('rowsFactory', function($http, $q) {
    delete $http.defaults.headers.common['X-Requested-With'];

    var target = 'http://fitbody.ben.dev/api/portfolio/mk/mk.jsonp?callback=JSON_CALLBACK';
    // Create CSS class toggles
    var pieceTogglesSettings = {
      transform: false,
      backActive: false, // @todo, don't think we need backActive anymore
      noFlipHelp: false,
      notFlippable: false,
      frontSwapped: false,
      backSwapped: false,
      showMoreActive: false,
      fade: false,
      hidePrimaryImg: false,
      hideDescription: false,
      hideBackNbrImg_0: true, //@todo make this not so hacky, no piece will actually use all these properties
      hideBackNbrImg_1: true,
      hideBackNbrImg_2: true,
      hideFrontNbrImg_0: true,
      hideFrontNbrImg_1: true,
      hideFrontNbrImg_2: true,
    };

    // Create service
    var service = {};
    service.createRows = function() {
      var deferred = $q.defer();
      $http({
        method: 'JSONP',
        url: target
      }).success(function(data) {
        config.pieces_count = data.portfolio.length;
        config.pieces_count_zero = config.pieces_count - 1;
        var secondaryImages = {};

        // @todo preload images

        // Loop through all pieces
        for (var p = 0; p < config.pieces_count; p++) {

          // Remove extra data from images array so only src remains (alt text, etc.)
          var images = data.portfolio[p].images;
          for (var b = 0; b < images.length; b++) {
            images[b] = images[b]['src'];
          }

          // Create new collection of secondary image arrays with the current piece number appended
          secondaryImages["piece_" + [p]] = [];

          // Loop through images array for the current piece
          for (var i = 0; i < images.length; i++) {
            if (i === 0) {
              // Create new object collection of primary images
              // primaryImages["piece_" + [p]].push(images[i]);
              // Add primary image to pieces object
              data.portfolio[p].primary_image = images[i];
            }
            else {
              // Add secondary images to collection of secondary images
              secondaryImages["piece_" + [p]].push(images[i]);
            }
          }
          // Remove unneeded images array from pieces object
          delete data.portfolio[p].images;
        }

        // Loop through all pieces again to add neighboring secondary images
        for (p = 0; p < config.pieces_count; p++) {

          // If app config says 3 pieces per row
          if (config.pieces_per_row === 3) {
            var mod = p % 3;
            // Create empty neighbor_images array
            data.portfolio[p].neighbor_images = [];

            var neighbor1;
            var neighbor2;

            // If left
            if (mod === 0) {
              data.portfolio[p].row_position = 'left';

              neighbor1 = p + 1;
              neighbor1 = "piece_" + neighbor1.toString();
              // Check if the neighbor exists, in case correct number of pieces has not been added
              if (typeof secondaryImages[neighbor1] != 'undefined') {
                neighbor1 = secondaryImages[neighbor1][0];
                data.portfolio[p].neighbor_images.center = neighbor1;
              }

              neighbor2 = p + 2;
              neighbor2 = "piece_" + neighbor2.toString();
              if (typeof secondaryImages[neighbor2] != 'undefined') {
                neighbor2 = secondaryImages[neighbor2][0];
                data.portfolio[p].neighbor_images.right = neighbor2;
              }
            }
            // If center
            else if (mod === 1) {
              data.portfolio[p].row_position = 'center';

              neighbor1 = p - 1;
              neighbor1 = "piece_" + neighbor1.toString();
              if (typeof secondaryImages[neighbor1] != 'undefined') {
                neighbor1 = secondaryImages[neighbor1][0];
                data.portfolio[p].neighbor_images.left = neighbor1;
              }

              neighbor2 = p + 1;
              neighbor2 = "piece_" + neighbor2.toString();
              if (typeof secondaryImages[neighbor2] != 'undefined') {
                neighbor2 = secondaryImages[neighbor2][1];
                data.portfolio[p].neighbor_images.right = neighbor2;
              }
            }
            // If right
            else if (mod === 2) {
              data.portfolio[p].row_position = 'right';

              neighbor1 = p - 1;
              neighbor1 = "piece_" + neighbor1.toString();
              if (typeof secondaryImages[neighbor1] != 'undefined') {
                neighbor1 = secondaryImages[neighbor1][1];
                data.portfolio[p].neighbor_images.center = neighbor1;
              }

              neighbor2 = p - 2;
              neighbor2 = "piece_" + neighbor2.toString();
              if (typeof secondaryImages[neighbor2] != 'undefined') {
                neighbor2 = secondaryImages[neighbor2][1];
                data.portfolio[p].neighbor_images.left = neighbor2;
              }
            }
          }
        }

        // Construct CSS class toggle objects for each row
        var pieceToggles = [];
        for (t = 0; t < config.pieces_per_row; t++) {
          // pieceToggles[t] = pieceTogglesSettings;
          pieceToggles[t] = {};
          for (var property in pieceTogglesSettings) {
            pieceToggles[t][property] = pieceTogglesSettings[property];
          }
        }

        // Loop through pieces one last time, group into rows and add them to rows object
        var rows = {},
            rowCount = 0;
        for (p = 0; p <= config.pieces_count; p++) {
          // If app config says 3 pieces per row
          if (config.pieces_per_row === 3) {
            // Add pieces to rows object
            // Only add pieces in multiples of 3
            var rowTemp = data.portfolio.splice(0,3);
            if (rowTemp.length === config.pieces_per_row) {
              rows["row_" + rowCount] = rowTemp;
              // Add CSS class toggles
              rows["row_" + rowCount].toggles = [];
              rows["row_" + rowCount].toggles = pieceToggles;
              rowCount++;
              config.pieces_count = config.pieces_count - 3;
            }
          }
        }
        config.row_count = rowCount;
        config.row_count_zero = rowCount - 1;


        console.log(rows, 'rows factory');

        deferred.resolve(rows);
      }).error(function() {
        // @todo Should there be some kind of error message?
        deferred.reject();
      });
      return deferred.promise;
    };
    return service;
  });
})();
