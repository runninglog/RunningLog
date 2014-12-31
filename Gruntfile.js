module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            serverFiles: [
                '*.js',
                'controllers/**/*.js',
                'models/**/*.js',
                'routes/**/*.js',
                'utils/**/*.js'
            ]
        }
    });

    // Each plugin must be loaded following this pattern
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('review', ['jshint:serverFiles']);
};
