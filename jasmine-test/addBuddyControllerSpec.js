describe('add buddy', function () {
    var $rootScope, $q, $location, buddyService, vm, buddy, buddies;
    beforeEach(function () {
        module('addBuddy');
    });
    beforeEach(
        inject(
            function(_$rootScope_, _$q_, $controller, _buddyService_){
                $rootScope = _$rootScope_;
                $q = _$q_;
                buddyService = _buddyService_;

                var scope = $rootScope.$new();
                /*  Probably better to just provide a fake instead of spying on the real one.
                    Not sure why I didn't in buddyListControllerSpec
                 */
                $location = jasmine.createSpyObj('$location', ['path']);

                $controller('addBuddyController as vm', {$scope:scope, $location:$location});

                vm = scope.vm;

                buddy = {
                    firstName: 'Pinkie',
                    lastName: 'Pie',
                    userName: 'PinkiePie',
                    status: 'Busy',
                    email: 'p.pie@equestria.com',
                    birthday: '9/3/1997',
                    bio: 'Pinkie Pie brings cheer and playfulness to brighten her friends\' days! She loves eating sweets and throwing parties for all her friends. She also enjoys helping people in need and she knows how to turn any frown upside down!',
                    rank: 0,
                    lastSeen: ''
                };
            }
        )
    );
    it('finds a buddy', function () {
        vm.message='checking to see if this works';
        vm.messageStyle = 'test';
        $rootScope.$apply(
            function(){
                vm.findBuddy('p.pie@equestria.com');
            }
        )
        expect(vm.selectedBuddy).toEqual(buddy);
        expect(vm.messageStyle).toEqual('');
        expect(vm.message).toEqual('');
    });
    it('does not find a buddy that is not available', function () {
        $rootScope.$apply(
            function(){
                vm.findBuddy('foo@bar.com');
            }
        )

        expect(vm.selectedBuddy).toEqual({});
        expect(vm.message).toEqual('No match found.');
        expect(vm.messageStyle).toEqual('bg-warning');
    });
    it('does not find a buddy person already has', function () {
        //TODO look through buddies to give them a better message
        $rootScope.$apply(
            function(){
                vm.findBuddy('ponycorn@aol.com');
            }
        )

        expect(vm.selectedBuddy).toEqual({});
        expect(vm.message).toEqual('No match found.');
        expect(vm.messageStyle).toEqual('bg-warning');
    });
    it('adds a buddy', function () {
        $rootScope.$apply(
            function() {
                vm.addBuddy(buddy);
            }
        )
        expect(vm.selectedBuddy).toEqual({});
        expect(vm.message.toLowerCase()).toContain('success');
        expect(vm.messageStyle).toEqual('bg-success');
    });
    it('navigates back to buddy list', function () {
        vm.done();
        expect($location.path).toHaveBeenCalledWith('buddy-list');
    });
});