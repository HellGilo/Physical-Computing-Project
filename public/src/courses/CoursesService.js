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
                authStatus.user.dbId = userData.data._id;
                var coursesList = userData.data._courses;
                this.courses = coursesList;

                coursesList.forEach(function(course) {
                    delete course._schedule;
                })
                //this.selected = this.courses[0];
                this.selectCourse(0);
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

                        this.selected.details.attendedAmount = attendedLectures(this.selected);
                        this.selected.details.upcomingAmount = upcomingLectures(this.selected);
                        //console.log(this.selected);
                    }.bind(this))
            }

            console.log(this.selected);

        }.bind(this);

        var upcomingLectures = function(course) {

            return course.details.schedule.filter(
                function(lecture) {
                    return new Date(lecture.start) >= new Date() ? true : false;
                }
            ).length;

        }

        var attendedLectures = function(course) {
            var lectureDetails = course.details;
            var lectures = lectureDetails.schedule;
            var total = lectures.length;
            var attended = lectures.filter(function(lecture) {
                var presences = lecture._presences;
                for(var i=0; i<presences.length; i++) {
                    if(authStatus.user.dbId == presences[i]._user._id) {
                        return true;
                    }
                }
                return false;
            }).length;

            console.log(attended);
            console.log(total);

            return attended/total * 100;

        }

        this.wasPresentAt = function(lecture) {
            var user = authStatus.user;
            var startDate = lecture.start;

            for(var i =0; i < lecture._presences.length; i++) {
                var current = lecture._presences[i];
                if(authStatus.user.dbId == current._user._id) {
                    return true;
                }
            }
            return false;

        }

        this.isUpcoming = function(lecture) {
            var startDate = lecture.start;

            if(new Date(startDate) >= new Date()) {
                return true;
            }

            return false;
        }

        this.getSide = function(index) {
            return index%2 == 0? 'left' : 'right';
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
