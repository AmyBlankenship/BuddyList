describe('buddy list controller', function () {
    var $rootScope, $location, $q, $uibModal, vm, buddyService, buddies, deferred, modalInstance;
    beforeEach(function () {
        module('buddyList');
    });
    beforeEach(
        inject(function(_$rootScope_, _$location_, $controller, _$q_, _buddyService_){
            $rootScope = _$rootScope_;
            $location = _$location_;
            $q = _$q_;
            buddyService = _buddyService_;

            $uibModal = jasmine.createSpyObj('$uibModal', ['open']);
            deferred=$q.defer()
            modalInstance = {result:deferred.promise};
            $uibModal.open.and.returnValue(modalInstance);

            var scope = $rootScope.$new();
            $controller('buddyListController as vm', {$scope:scope, $uibModal:$uibModal});

            vm = scope.vm;

            /*  This function has the dual purpose of allowing the controller to
                populate the vm.buddies variable and also letting us get a handle
                to that as well.
            */
            $rootScope.$apply(
                buddyService.getBuddies().then(
                    function(data) {
                        buddies = data;
                    }
                )
            );
        })
    )
    it('automatically gets my buddies', function () {
        expect(vm.buddies.length).toEqual(4);
    });
    it('exposes service for binding', function () {
        expect(vm.buddyModel.canAddBuddies).toBe(true);
    });
    it('selects a buddy', function () {
        var buddy = buddies[2];
        vm.selectBuddy(buddy);
        expect(vm.selectedBuddy).toEqual(buddy);
    });
    it('goes to add buddy page', function () {
        spyOn($location, 'path');
        vm.addBuddy();
        expect($location.path).toHaveBeenCalledWith('add-buddy');
    });
    it('goes to invite buddy page', function () {
        spyOn($location, 'path');
        vm.inviteBuddy();
        expect($location.path).toHaveBeenCalledWith('invite-buddy');
    });
    describe('deleting buddies', function () {
        beforeEach(function () {
            spyOn(buddyService, 'deleteBuddy').and.returnValue($q.when(buddies[2].userName));
        });
        it('does not just delete a buddy', function () {
            vm.deleteBuddy(buddies[2]);
            expect(buddyService.deleteBuddy).not.toHaveBeenCalled();
            expect($uibModal.open).toHaveBeenCalledWith(jasmine.any(Object));
        });
        it('deletes buddy when promise resolves', function () {
            vm.deleteBuddy(buddies[2]);
            $rootScope.$apply(
                function () {
                    deferred.resolve(buddies[2].userName);
                }
            );
            expect(buddyService.deleteBuddy).toHaveBeenCalledWith(buddies[2].userName);
        });
    });

});
