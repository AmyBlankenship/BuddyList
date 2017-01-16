(function () {
    'use strict';
    angular.module('addBuddy').controller('addBuddyController',
        ['$location','filterFilter', 'buddyService', addBuddyController]
    );

    function addBuddyController($location, filterFilter, buddyService) {
        var vm = this;
        vm.selectedBuddy = {};
        vm.message = '';
        vm.messageStyle = '';

        vm.findBuddy = findBuddy;
        vm.addBuddy = addBuddy;
        vm.done = done;

        /*  We don't want people adding buddies they don't even know, so
            you have to enter the entire email of an available buddy to add them.
         */
        function findBuddy(email) {
            buddyService.getAvailableBuddies().then(
                function(buddies){
                    var matching = filterFilter(buddies, {email:email});
                    if (matching.length==1) {
                        vm.selectedBuddy = matching[0];
                        vm.message = ''
                        vm.messageStyle = '';
                    } else {
                        vm.selectedBuddy = {};
                        vm.message = 'No match found.';
                        vm.messageStyle = 'bg-warning';
                    }
                }
            )
        }
        function addBuddy(buddy) {
            buddyService.addBuddy(buddy.userName).then(
                function(buddies){
                    vm.selectedBuddy = {};
                    vm.message = 'Successfully added "' + buddy.email + '"!';
                    vm.messageStyle = 'bg-success';
                }
            );
        }
        function done(){
            $location.path('buddy-list');
        }
    }
})();