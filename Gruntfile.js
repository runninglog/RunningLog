module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            build: {
                cwd: './',
                src: ['**', '!**/node_modules/**'],
                dest: 'build',
                expand: true
            },
        },

        clean: {
            build: {
                src: ['build']
            },
        },

        jshint: {
            serverFiles: [
                '*.js',
                'controllers/**/*.js',
                'config/**/*.js',
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
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');

    grunt.registerTask('lint', ['jshint:serverFiles']);
    grunt.registerTask('test', ['simplemocha']);
    grunt.registerTask('build', ['clean', 'copy']);
};
