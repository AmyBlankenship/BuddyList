'use strict';
(
   function() {
       angular.module('buddyList')
           .controller('buddyListController', [
               '$location', '$uibModal',
               'buddyService',
               buddyListController
           ]);

       function buddyListController($location, $uibModal,  buddyService) {
           var vm = this;

           //define public properties/methods so we know at a glance what we have
           //----------properties----------//
           vm.buddies = [];
           /*   It's a little icky to directly expose the service like this, but
                the service already has code that's updating its canAddBuddies.
                To duplicate it here, we'd either need to directly expose availableBuddies
                or constantly call getAvailableBuddies(), which would be poor performance.
                Even though we're not gaining as much as we'd like by controlling access
                to availableBuddies because getAvailableBuddies() returns a reference to the collection,
                the current form of the code conveys that the intention is for everyone else to keep their
                hands off. So we accept this is a bit stinky and move on for now.
                We name it buddyModel to try to emphasize that we should treat it as data and not call its
                methods directly from the View.
            */
           vm.buddyModel = buddyService;
           vm.selectedBuddy = {};

           //------------methods------------//
           vm.selectBuddy = selectBuddy;
           vm.addBuddy = addBuddy;
           vm.inviteBuddy = inviteBuddy;
           vm.deleteBuddy = deleteBuddy;

           //ngView, not directive, so we don't have life cycle hooks
           init();

           //---------method bodies---------//
           function selectBuddy(buddy) {
               vm.selectedBuddy = buddy;
           }
           function addBuddy() {
               $location.path('add-buddy');
           }
           function inviteBuddy() {
               $location.path('invite-buddy');
           }
           function deleteBuddy(buddy) {
                var instance = $uibModal.open({
                    ariaDescribedBy: 'modal-body',
                    ariaLabeledBy:'modal-title',
                    controller: 'confirmModalInstanceController',
                    templateUrl: 'shared/bootstrap/confirmModalContents.html',
                    resolve: {
                        model: function() {
                            return {header:'Are you sure?', body:'Really delete "' + buddy.firstName + ' ' + buddy.lastName +'"?', btnConfirm:'Yes', btnCancel:'No', value:buddy.userName}
                        }
                    }
                });
               instance.result.then(
                   function(userName){
                       buddyService.deleteBuddy(userName).then(
                           function(revisedBuddies){
                               vm.buddies = revisedBuddies;

                               //TODO: Bootstrap alerts. This hack avoids breaking tests with alert
                               if (!angular.mock) alert(userName + ' deleted!');

                               //TODO: no test coverage on this line
                               vm.filterObj = {};
                           },
                           function(message) {
                               if (!angular.mock) alert(message);
                           }
                       );
                   }
               )
           }

           //-------------private-----------//
           function init() {
                /*
                    Normally I would inject this in route resolution instead of
                    dealing with promises in the View, but we have to do that for
                    deletes anyway, so just suck it up.
                */
               buddyService.getBuddies().then(
                   function(result) {
                       vm.buddies = result;
                   }
               );
           }
       }
   }
)();