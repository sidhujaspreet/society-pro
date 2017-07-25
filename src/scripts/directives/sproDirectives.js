(function(){
    'use strict';

    angular
        .module('societyPro.sproDirectives', [])
        .directive('sproMapCanvas', sproMapCanvas)
        .directive('sproSearchLocation', sproSearchLocation)
        .directive('sproPickLocation',sproPickLocation)
        .directive('sproDropdown', sproDropdown);
    
    
    function sproMapCanvas (){
        return {
            restrict:'EA',
            replace:true,
            scope: {
                mapValues: '=',
                map: '='
            },
            link: function(scope, elem, attrs){
                var mapOptions = {
                    zoom: scope.mapValues.zoom,
                    center: new google.maps.LatLng(scope.mapValues.center.latitude, scope.mapValues.center.longitude),
                    mapTypeControlOptions: {
                            mapTypeId: [google.maps.MapTypeId.ROADMAP]
                    }
                };
                scope.map = new google.maps.Map(elem[0], mapOptions);
                console.log("From map directive : " + scope.map);
            } 
        }
    };
    
    function sproSearchLocation(){
        return {
            restrict:'EA',
            replace:true,
            // transclude:true,
            scope: {
                location: '='
            },
            template: '<input id="google_places_ac" name="google_places_ac" type="text" class="form-control" placeholder="Enter City">',
            link: function(scope, elm, attrs){
                var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});
                google.maps.event.addListener(autocomplete, 'place_changed', function() {
                    var place = autocomplete.getPlace();
                    scope.location = {
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng()
                    };
                    scope.$apply();
                });
            }
        }
    };
    
    function sproPickLocation(){
        return {
            restrict: 'EA',
            replace:false,
            scope: {
                items: '=',
                selectedItem: '='
            },
            template:	'<button class="btn btn-primary" ng-click="">Pick Location</button>',
            link: function (scope, element, attrs) {
                scope.label = attrs.label;
                scope.title = attrs.title;
            }
        };
    };
    
    function sproDropdown(){
        return {
            restrict: 'EA',
            replace: false,
            scope: {
                items: '=',
                selectedItem: '='
            },
            template:	'<label><h4>{{label}}</h4></label>' +
                        '<select class="form-control" ng-model="selectedItem" ng-options="i.Value as i.Key for i in items" required>' +
                            '<option value="" selected="selected"> {{title}} </option>' +
                        '</select>',
            link: function (scope, element, attrs) {
                scope.label = attrs.label;
                scope.title = attrs.title;
            }
        };
    };
    
})();