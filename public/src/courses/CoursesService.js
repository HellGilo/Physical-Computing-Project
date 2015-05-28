/**
 * Created by simonedavico on 14/05/15.
 */
(function() {

    angular.module('USiBeacon.courses')

    //courses as a service or as a resource?
        .service('coursesAPI', ['waitingQueue', 'authStatus', '$http', CoursesAPI])
        .controller('CoursesController', ['$mdBottomSheet', '$mdSidenav', '$rootScope', '$q', 'coursesAPI', 'authStatus', CoursesController]);

    function CoursesAPI(waitingQueue, authStatus, $http) {

        var getCourses = function() {
            //return $timeout(function() {
            //    return [
            //        {
            //            _id: 1234,
            //            name: "Quantum Computing"
            //        },
            //        {
            //            _id: 5678,
            //            name: "Physical Computing"
            //        }
            //    ];
            //}, 2000);
            return $http.get('/api/users/' + authStatus.user.id);
        }

        var getCourseDetails = function(course) {
            var id = course._id;
            return $http.get('/api/courses/' + id);
        }

        this.getCourses = function() {
            console.log('trying to get courses')
            return waitingQueue.apiCall(getCourses);
        }

        this.getCourseDetails = function(course) {
            return waitingQueue.apiCall(getCourseDetails, null, course);
        }

    }



    function CoursesController($mdBottomSheet, $mdSidenav, $rootScope, $q, coursesAPI, authStatus) {

        this.courses = [];

        this.selected;

        coursesAPI.getCourses()
            .then(function(userData) {
                var coursesList = userData.data._courses;
                //console.log(coursesList);
                this.courses = coursesList;

                coursesList.forEach(function(course) {
                    delete course._schedule;
                })
                //this.selected = this.courses[0];
                return this.courses;
            }.bind(this));

        //when I select a course, I want to get its informations
        this.selectCourse = function(course) {
            this.selected = angular.isNumber(course) ? this.courses[course] : course;
            this.toggleCoursesList();

            //retrieve info from server
            if(!this.selected.details) {
                coursesAPI.getCourseDetails(this.selected)
                    .then(function(details) {

                        this.selected.details = {
                            schedule: details.data._schedule,
                            //lecturer: details.data._lecturer,
                            assistants: details.data._assistants,
                            students: details.data._students
                        }

                    }.bind(this))
            }

            console.log(this.selected);

        }.bind(this);

        this.wasPresentAt = function(lecture) {
            var user = authStatus.user;

            for(var i =0; i < lecture._presences.length; i++) {
                var current = lecture._presences[i];
                //check if I am among the presences and eventually return true
            }
            return true;

        }

        this.toggleCoursesList = function() {
            var pending = $mdBottomSheet.hide() || $q.when(true);

            pending.then(function(){
                $mdSidenav('left').toggle();
            });
        }

        $rootScope.$on('ToolbarMenuButtonPressedEvent', this.toggleCoursesList);

    }

})();
