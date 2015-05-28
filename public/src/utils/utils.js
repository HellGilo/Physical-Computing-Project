/**
 * Created by simonedavico on 12/05/15.
 */
(function(){
    'use strict';

    angular.module('USiBeacon.utils', ['ngMaterial'])
        .provider('$localStorage', [$localStorage])


    .filter('capitalize', function () {
        return function (input, format) {
            if (!input) {
                return input;
            }
            format = format || 'all';
            if (format === 'first') {
                // Capitalize the first letter of a sentence
                return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
            } else {
                var words = input.split(' ');
                var result = [];
                words.forEach(function(word) {
                    if (word.length === 2 && format === 'team') {
                        // Uppercase team abbreviations like FC, CD, SD
                        result.push(word.toUpperCase());
                    } else {
                        result.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
                    }
                });
                return result.join(' ');
            }
        };
    });

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
                                //console.warn("Error parsing object from localStorage for key " + key, e);
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

