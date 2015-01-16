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
  $routeProvider.otherwise({redirectTo: '/dummy'});

  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.headers.common["Accept"] = "application/json";
  $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
});
