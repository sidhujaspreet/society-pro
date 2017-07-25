(function(){
    'use strict';

    angular
        .module('societyPro.sproDirectives', [])
        .directive('sproReverseGeocode', sproReverseGeocode)
        .directive('sproSearchLocation', sproSearchLocation)
        .directive('sproPickLocation',sproPickLocation)
        .directive('sproDropdown', sproDropdown);
               
    function sproReverseGeocode() {
        return {
            restrict: 'E',
            template: '<div></div>',
            link: function (scope, element, attrs) {
                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(attrs.lat, attrs.lng);
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            element.text(results[1].formatted_address);
                        } else {
                            element.text('Location not found');
                        }
                    } else {
                        element.text('Geocoder failed due to: ' + status);
                    }
                });
            },
            replace: true
        }
    });
    
    function sproSearchLocation(){
        return {
            restrict:'EA',
            replace:true,
            // transclude:true,
            scope: {
                location:'=',
                formID: '='
            },
            template: '<input id="googlePlaces" name="googlePlaces" type="text" class="form-control" placeholder="Enter City" required>',
             link: function(scope, element, attrs){
                var autocomplete = new google.maps.places.Autocomplete($("#googlePlaces")[0], {});
                google.maps.event.addListener(autocomplete, 'place_changed', function() {
                    var place = autocomplete.getPlace();
                    scope.location = {
                        "latitude" : place.geometry.location.lat(),
                        "longitude" : place.geometry.location.lng()
                    };
                    scope.$apply();
                });
                console.log(scope.location);
            }
        };
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
            replace:false,
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