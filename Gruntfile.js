module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            serverFiles: [
                '*.js',
                'controllers/**/*.js',
                'models/**/*.js',
                'routes/**/*.js',
                'test/**/*.js',
                'utils/**/*.js'
            ]
        },

        simplemocha: {
            options: {
                timeout: 3000,
                ignoreLeaks: false
            },
            all: { src: ['test/*.js'] }
        }
    });

    // Each plugin must be loaded following this pattern
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');

    grunt.registerTask('lint', ['jshint:serverFiles']);
    grunt.registerTask('test', ['simplemocha']);
};
