/**
 * Created by simonedavico on 14/05/15.
 */
(function() {

    angular.module('USiBeacon.courses')

    //courses as a service or as a resource?
        .service('coursesAPI', ['waitingQueue', '$timeout', CoursesAPI])
        .controller('CoursesController', ['$mdBottomSheet', '$mdSidenav', '$rootScope', '$q', 'coursesAPI', CoursesController]);

    function CoursesAPI(waitingQueue, $timeout) {

        var getCourses = function() {
            return $timeout(function() {
                return [
                    {
                        _id: 1234,
                        name: "Quantum Computing"
                    },
                    {
                        _id: 5678,
                        name: "Physical Computing"
                    }
                ];
            }, 2000);
        }

        this.getCourses = function() {
            console.log('trying to get courses')
            return waitingQueue.apiCall(getCourses);
        }

    }



    function CoursesController($mdBottomSheet, $mdSidenav, $rootScope, $q, coursesAPI) {

        this.courses = [];

        this.selected;

        coursesAPI.getCourses().then(
            function(courses) {
                console.log('asked for courses')
                this.courses = courses;
            }.bind(this)
        )

        this.selectCourse = function(course) {
            this.selected = angular.isNumber(course) ? this.courses[course] : course;
            this.toggleCoursesList();
        }.bind(this);


        this.toggleCoursesList = function() {
            var pending = $mdBottomSheet.hide() || $q.when(true);

            pending.then(function(){
                $mdSidenav('left').toggle();
            });
        }

        $rootScope.$on('ToolbarMenuButtonPressedEvent', this.toggleCoursesList);

    }

})();
