describe('buddy service', function () {
    var buddyService, $rootScope, $timeout, ff;
    /*  note I prefer this formatting style because when
        the code is folded you can read the first line but the body
        is hidden.
        This makes it easy to hide the specs you're not working on
    */
    beforeEach(function(){
        /*  I think where dividing things into modules really shines
            is in testing, since you don't have to spin up everything
            to just test what you're looking at. Also, it really makes sure
            the team understands what's dependent on what and keeps the
            "root" module declaration a lot cleaner when each module declares
            its own dependencies and then the root module just brings in
            each feature.
            The Angular 2 philosophy of creating modules "on the fly"
            so you can and do build a test module in the test and with
            lazy loading is a whole different philosophy.
         */
        module('buddyModel');
    });
    beforeEach(inject(
        function(_buddyService_, _$rootScope_, _$timeout_, filterFilter) {
            buddyService = _buddyService_;
            $rootScope = _$rootScope_;
            $timeout = _$timeout_;
            ff = filterFilter;
        }
    ));
    describe('my actual buddies', function () {
        it('should be full of promisey goodness', function () {
            /*  The best way I know (in plain JS) to check if an object is a Promise is to make sure
                its then property is a Function.
            */
            expect(buddyService.getBuddies().then).toEqual(jasmine.any(Function));
        });
        it('retrieves the buddies', function () {
            //too much time in TypeScript to declare this in the below fn :)
            var buddies;
            //make sure the promise is resolved
            $rootScope.$apply(
                buddyService.getBuddies().then(
                    function(theBuddies) {
                        buddies = theBuddies;
                    }
                )
            );
            expect(buddies.length).toEqual(4);
        });
    });
    describe('available buddies', function () {
        it('should also be full of promisey goodness', function () {
            expect(buddyService.getAvailableBuddies().then).toEqual(jasmine.any(Function));
        });
        it('retrieves available buddies', function () {
            //too much time in TypeScript to declare this in the below fn :)
            var buddies;
            $rootScope.$apply(
                buddyService.getAvailableBuddies().then(
                    function(theBuddies) {
                        buddies = theBuddies;
                    }
                )
            );
            expect(buddies.length).toEqual(4);
        });
    });
    describe('deleting buddies', function () {
        //skipping the promisey goodness
        it('deletes a buddy (sort of)', function () {
           var buddies;
            $rootScope.$apply(
                function() {
                    buddyService.deleteBuddy('DarkTwinkle').then(
                        function(data) {
                            buddies = data;
                        }
                    )
                }
            );
            //using angular filterFilter to check to see if the deleted buddy is still in the array
            var deletedBuddyArr = ff(buddies, {userName:'DarkTwinkle'});
            expect(buddies.length).toEqual(3);
            expect(deletedBuddyArr.length).toBe(0);
        });
        //Note: UI should not let you do this, but just to be safe
        it('does not allow you to delete a friend you don\'t have', function () {
            var reason;
            $rootScope.$apply(
                function () {
                    buddyService.deleteBuddy('fail').then(angular.noop, function(msg){
                        reason = msg;
                    });
                }
            );
            /*  Means we don't have to massage the test if we change the message a little,
                but still gives us an idea that this message is specific to this problem
             */
            expect(reason).toContain('exist');
        });
        it('actually just moved the buddy to the available buddies list', function () {
            var buddies;
            $rootScope.$apply(
                function() {
                    buddyService.deleteBuddy('DarkTwinkle');
                }
            );
            $rootScope.$apply(
                buddyService.getAvailableBuddies().then(
                    function(theBuddies) {
                        buddies = theBuddies;
                    }
                )
            );
            var movedBuddyArr = ff(buddies, {userName:'DarkTwinkle'});
            expect(buddies.length).toEqual(5);
            expect(movedBuddyArr.length).toBe(1);
        });
        it('won\'t let you delete your mom', function () {
            //You're Pony Corn's younger sibling and in this world you can't delete your mom
            var reason;
            $rootScope.$apply(
                function () {
                    buddyService.deleteBuddy('Kandi999').then(angular.noop, function(msg){
                        reason = msg;
                    });
                }
            );
            expect(reason.toLowerCase()).toContain('mom');
        });
    });
    describe('adding buddies', function () {
        it('should add a selected buddy', function () {
            var buddies;
            $rootScope.$apply(
                function () {
                    buddyService.addBuddy('RrrDash').then(
                        function (theBuddies) {
                            buddies = theBuddies;
                        }
                    );
                }
            );
            var addedBuddyArr = ff(buddies, {userName:'RrrDash'});

            expect(buddies.length).toBe(5);
            expect(addedBuddyArr.length).toBe(1);
        });
        it('should remove buddy from available buddies', function () {
            var buddies;
            $rootScope.$apply(
                function () {
                    buddyService.addBuddy('RrrDash');
                }
            );
            $rootScope.$apply(
                buddyService.getAvailableBuddies().then(
                    function(theBuddies) {
                        buddies = theBuddies;
                    }
                )
            );
            var addedBuddyArr = ff(buddies, {userName:'RrrDash'});
            expect(buddies.length).toEqual(3);
            expect(addedBuddyArr.length).toBe(0);
        });
    });
    it('should invite a buddy', function () {
        var message;
        buddyService.inviteBuddy('foo@bar.com').then(
            function(msg) {
                message = msg;
            }
        );
        $timeout.flush();
        expect(message).toContain('success');
    });
    describe('canAddBuddies', function () {
        function addAll() {
            var buddies;
            $rootScope.$apply(
                buddyService.getAvailableBuddies().then(
                    function(theBuddies) {
                        buddies = theBuddies;
                    }
                )
            );
            //service is altering this collection, so copy it so we can actually get at all of them
            var bCopy = buddies.concat();
            for (var i = 0; i < bCopy.length; i++) {
                var buddy = bCopy[i];
                $rootScope.$apply(
                    function(){
                        buddyService.addBuddy(buddy.userName);
                    }
                );
            }
        }
        it('should be true with default available buddies', function () {
            expect(buddyService.canAddBuddies).toBe(true);
        });
        it('should be false when all buddies have been added', function () {
            addAll();
            expect(buddyService.canAddBuddies).toBe(false);
        });
        it('should be true again if a buddy gets deleted', function () {
            addAll();
            $rootScope.$apply(
                function() {
                    buddyService.deleteBuddy('PinkiePie');
                }
            );
            expect(buddyService.canAddBuddies).toBe(true);
        });
    });
});