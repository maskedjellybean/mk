module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
          css: {
            src: 'webroot/css/megan.css',
            dest: 'webroot/css/megan.min.css'
          }
        },
        smushit: {
          icons: {
            src: 'webroot/images/*.png',
            dest: 'webroot/images/min'
          }
        },
        uglify: {
          js: {
            expand: true,
            cwd: 'webroot/js/',
            src: ['*.js'],
            dest: 'webroot/js/min/',
            ext: '.min.js',
          },
          options: {
            report: 'min',
            mangle: false
          }
        },
        watch: {
          files: [
            'webroot/css/*',
            'webroot/js/*'
          ],
          tasks: [
            'cssmin',
            // 'uglify'
          ]
        }
    });

    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-smushit');
    grunt.registerTask('default', [ 'cssmin:css', 'smushit', 'uglify']);
};