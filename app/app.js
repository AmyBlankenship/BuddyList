'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute', 'ngAnimate',
  'shared',
  'ui.bootstrap',
  'buddyList',
  'addBuddy',
  'inviteBuddy'
]).
config(['$routeProvider', function($routeProvider) {
  //TODO: consider writing function that translates snake case to camel case to
  //generate routes
  $routeProvider
      .when('/buddy-list',
        {
          controller:'buddyListController',
          controllerAs:'vm',
          templateUrl: 'buddyList/buddyListView.html'
        }
      )
      .when('/add-buddy',
        {
          controller:'addBuddyController',
          controllerAs:'vm',
          templateUrl: 'addBuddy/addBuddyView.html'
        }
      )
      .when('/invite-buddy',
        {
          controller: 'inviteBuddyController',
          controllerAs:'vm',
          templateUrl: 'inviteBuddy/inviteBuddyView.html'
        }
      )
      .otherwise({redirectTo: '/buddy-list'});
}]);
