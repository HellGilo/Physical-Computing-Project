/**
 * Created by simonedavico on 14/05/15.
 */
(function() {

    angular.module('USiBeacon.courses')

    //courses as a service or as a resource?

        .controller('CoursesController', ['$mdBottomSheet', '$mdSidenav', '$rootScope', '$q', CoursesController]);

    function CoursesController($mdBottomSheet, $mdSidenav, $rootScope, $q) {

        this.courses = [
            {
                _id: 1234,
                name: "Quantum Computing"
            },
            {
                _id: 5678,
                name: "Physical Computing"
            }
        ];

        //this.selected = this.courses[0];
        this.selected;


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
