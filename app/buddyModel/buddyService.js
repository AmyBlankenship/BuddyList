'use strict';
(
    function(){
        /*  Never store reference to a module so you're not tempted
            to do weird things to it like just stick a variable
            or function to it
        */
        angular.module('buddyModel').service(
            'buddyService',
            ['$q', '$timeout', 'filterFilter', buddyModelConstructor]
        );
        //service is a constructor, let's make this clear for jr devs
        function buddyModelConstructor($q, $timeout, ff) {
            //nail down current this so context isn't lost
            var self = this;

            //buddies the user already has
            var myBuddies = [
                {firstName:'Pony', lastName:'Corn', userName:'PCorn', status:'Available', email:'ponycorn@aol.com', birthday:'1/1/2004', bio:'The first of 6 foals, Pony Corn spends all his time babysitting his younger siblings.', rank:3},
                {firstName:'Kandi', lastName:'Corn', userName:'Kandi999', status:'Idle', email:'kandi@earthlink.net', birthday:'10/1/1968', bio:'I\'m a single mother of 6 who likes Pina coladas and getting caught in the rain.', rank:1},
                {firstName:'Twilight', lastName:'Sparkle', userName:'DarkTwinkle', status:'Offline', email:'t.sparkle@gmail.com', birthday:'8/10/1996', bio:'Twilight is from the land of Equestria and firmly believes Friendship is Magic', lastSeen:'11/8/2016', rank:4},
                {firstName:'Apple', lastName:'Bloom', userName:'Apple_Bloom', status:'Busy', email:'a.bloom@yahoo.com', birthday:'6/16/2008', bio:'As a Cutie Mark Crusader, I feel like it\'s very important to understand what you are good at.', rank:5}
            ];

            //buddies that exist in the system
            /*  Formatting is different here because I created a Webstorm Live template to help me
                generate my test data faster. Webstorm reformats from one line to multi lines.
                Also started copying and pasting pony bios, which is why they are longer
             */
            var availableBuddies = [
                {
                    firstName: 'Pinkie',
                    lastName: 'Pie',
                    userName: 'PinkiePie',
                    status: 'Busy',
                    email: 'p.pie@equestria.com',
                    birthday: '9/3/1997',
                    bio: 'Pinkie Pie brings cheer and playfulness to brighten her friends\' days! She loves eating sweets and throwing parties for all her friends. She also enjoys helping people in need and she knows how to turn any frown upside down!',
                    rank: 0,
                    lastSeen: ''
                },
                {
                    firstName: 'Rainbow',
                    lastName: 'Dash',
                    userName: 'RrrDash',
                    status: 'Idle',
                    email: 'rainbowD@hotmail.com',
                    birthday: '11/17/1995',
                    bio: 'Rainbow Dash is always ready for an adventure with her pony friends. Rain or shine, she is a loyal dependable friend.',
                    rank: 0,
                    lastSeen: ''
                },
                {
                    firstName: 'Apple',
                    lastName: 'Jack',
                    userName: 'AJ',
                    status: 'Offline',
                    email: 'aplleJack@kellogs.com',
                    birthday: '8/12/1999',
                    bio: 'Applejack is honest, friendly and sweet to the core! She is always ready to lend a hoof to help her pony friends. She lives and works at Sweet Apple Acres and she makes sure to take good care of the environment.',
                    rank: 0,
                    lastSeen: '1/10/2017'
                },
                {
                    firstName: 'Flutter',
                    lastName: 'Shy',
                    userName: 'fShy',
                    status: 'Offline',
                    email: 'fluttr.shy@gmail.com',
                    birthday: '10/10/1995',
                    bio: 'Fluttershy is kind and gentle with everyone. She likes to help her pony friends solve their problems. She takes good care of the animals in Ponyville by feeding them and giving them a good home.',
                    rank: 0,
                    lastSeen: '12/28/2016'
                }
            ];

            /*
                This style of pointing to hoisted functions makes the
                api of the service easier to see at a glance. Most tools
                have a "go to definition" function.
             */
            self.getBuddies = getBuddies;
            self.getAvailableBuddies = getAvailableBuddies;
            self.deleteBuddy = deleteBuddy;
            self.addBuddy = addBuddy;
            self.inviteBuddy = inviteBuddy;
            self.canAddBuddies = false;

            updateCanAddBuddies();

            function getBuddies() {
                return $q.when(myBuddies);
            }
            function getAvailableBuddies() {
                return $q.when(availableBuddies);
            }
            function deleteBuddy(userName) {
                /*  Some people hate early returns and find them an anti-pattern.
                     I think it makes it easier to reason about the code that as soon as
                     you realize you can't continue you exit the function

                     Also note I think that strict equality is often overkill and even counterproductive
                     https://javascriptweblog.wordpress.com/2011/02/07/truth-equality-and-javascript/
                 */
                if (userName=='Kandi999') return $q.reject('You can\'t delete your Mom!');
                var exBuddyArr = ff(myBuddies, {userName:userName});
                if (exBuddyArr.length>0) {
                    var removed = myBuddies.splice(myBuddies.indexOf(exBuddyArr[0]), 1);
                    /*  WARNING: this is now a new object!
                        We could have used push() to avoid this, but
                        the syntax would not be as clean.
                     */
                    availableBuddies = availableBuddies.concat(removed);
                } else {
                    return $q.reject('You can\'t delete a non-existent friend.');
                }
                updateCanAddBuddies();
                return ($q.when(myBuddies));
            }

            /*  The existence of a "last sign in date" in the spec implies buddies have an independent existence
                in the system, so the user can't add buddies that do not already exist in the system.
                Therefore, in the absence of direct communication with the PO I made the executive decision
                to make adding a buddy a selection process, but added the feature where the user can invite
                ponies from outside the system to sign up.

                Note that this also avoided the need to create functionality to pseudo-randomly assign
                last login date and status to new buddies. It would have to be pseudo-random to be testable,
                and it would need to be built to make the system "look" like it was operating correctly
                in the absence of test data. In a real system, I would be unlikely to expend this level of
                effort for a mockup unless the client were paying extra to get that. And in this case it makes no
                sense any way you look at it.
             */
            function addBuddy(userName) {
                var newBuddyArr = ff(availableBuddies, {userName:userName});
                if (newBuddyArr.length==1) {
                    //TODO: this is the opposite of how the deleteBuddy method does it
                    //because of the order of the specs. Should we refactor to make it consistent?
                    myBuddies = myBuddies.concat(newBuddyArr);
                    availableBuddies.splice(availableBuddies.indexOf(newBuddyArr[0]), 1);
                    updateCanAddBuddies();
                    return $q.resolve(myBuddies);
                }
            }
            function inviteBuddy(email) {
                return $timeout(function() {
                    return '"' + email + '" has successfully been invited';
                })
            }
            function updateCanAddBuddies() {
                self.canAddBuddies = availableBuddies.length>0;
            }
        }
    }
)();