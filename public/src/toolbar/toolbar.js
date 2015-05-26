/**
 * Created by simonedavico on 07/05/15.
 */
(function() {
    'use strict';

    angular.module('USiBeacon.toolbar', [ 'ngMaterial', 'USiBeacon.auth' ])
        .controller('ToolbarController', [ 'authStatus', '$rootScope', ToolbarController]);

    /**
     * A controller for the application toolbar
     *
     * @constructor
     */
    function ToolbarController(authStatus, $rootScope) {

        this.user = {
            loggedIn : function() { return authStatus.loggedIn; },
            info : function() { return authStatus.user }
        }


        this.toggleList = function() {
            $rootScope.$emit('ToolbarMenuButtonPressedEvent');
        }
    }

})();



