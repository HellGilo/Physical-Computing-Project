/**
 * Created by simonedavico on 12/05/15.
 */
(function(){
    'use strict';

    angular.module('USiBeacon.utils', ['ngMaterial'])
        .provider('$localStorage', [$localStorage]);

    /**
     *
     * A simple wrapper for the localStorage API
     * that automatically stringifies objects when saving them
     * and automatically restores them when retrieving them
     *
     * @param $window
     */
    function $localStorage() {

        var ns;

        return {

            setNamespace: function(namespace) { ns = namespace + "."; },
            $get: function($window) {
                return {

                    get: function(key) {
                        var obj =  $window.localStorage.getItem(ns + key);
                        if(obj) {
                            try {
                                var obj = JSON.parse(obj);
                            } catch(e) {
                                console.warn("Error parsing object from localStorage for key " + key, e);
                            }
                        }
                        return obj;
                    },

                    set: function(key, value) {
                        if(typeof value == 'object' && value) {
                            value = JSON.stringify(value);
                        }

                        $window.localStorage.setItem(ns + key,value);
                    },

                    clear: $window.localStorage.clear,

                    removeItem: function(key) {
                        $window.localStorage.removeItem(ns + key);
                    }

                }
            }
        }
    }

})();

