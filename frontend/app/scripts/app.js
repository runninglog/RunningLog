'use strict';

angular.module('ngdemoApp', [
  'ngdemoApp.services',
  'ngdemoApp.controllers'
  ])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider.when('/dummy', {templateUrl: 'views/dummy.html', controller: 'DummyCtrl'});
  $routeProvider.when('/user-list', {templateUrl: 'views/user-list.html', controller: 'UserListCtrl'});
  $routeProvider.when('/user-detail/:id', {templateUrl: 'views/user-detail.html', controller: 'UserDetailCtrl'});
  $routeProvider.when('/user-creation', {templateUrl: 'views/user-creation.html', controller: 'UserCreationCtrl'});
  $routeProvider.when('/race-list', {templateUrl: 'views/race-list.html', controller: 'RaceListCtrl'});
  $routeProvider.when('/race-detail/:id', {templateUrl: 'views/race-detail.html', controller: 'RaceDetailCtrl'});
  $routeProvider.when('/race-creation', {templateUrl: 'views/race-creation.html', controller: 'RaceCreationCtrl'});
  $routeProvider.otherwise({redirectTo: '/dummy'});

  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.headers.common["Accept"] = "application/json";
  $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

  var encodedUserNameAndPassword = btoa('admin' + ':' + 'admin');
  $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + encodedUserNameAndPassword;
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  delete $httpProvider.defaults.headers.common["X-Requested-With"];
});
