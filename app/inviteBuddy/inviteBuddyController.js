(function () {
    'use strict';
    angular.module('inviteBuddy').controller(
        'inviteBuddyController',
        ['$location', inviteBuddyController]
    );
    //Todo:this is stub functionality, no tests
    function inviteBuddyController($location) {
        var vm = this;
        vm.done = done;
        function done(){
            $location.path('buddy-list');
        }
    }
})();