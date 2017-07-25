(function(){
    'use strict';

    angular
        .module('societyPro.sproFactories', [])
        .factory('sproReverseGeocode', sproReverseGeocode)
        //.factory('sproDrawMarkerFactory', sproDrawMarkerFactory)
        .factory('sproRenderMapFactory', sproRenderMapFactory)
        .factory('sproDrawCircleFactory', sproDrawCircleFactory);
    
    sproReverseGeocode.$inject = ['$timeout', '$q'];
    /*function sproDrawMarkerFactory(){
        return{
            drawMarker: function (map, eventName, originalEventArgs) {
                var e = originalEventArgs[0];
                var lat = e.latLng.lat(), lon = e.latLng.lng();
                var marker = {
                    id: Date.now(),
                    coords: {
                        latitude: lat,
                        longitude: lon
                    }
                };
                this.map.markers.pop();
                this.map.markers.push(marker);
                console.log(this.map.markers);
                console.log("latitude : "+lat+" longitude : "+lon);
                this.$apply();
            }
        };
    };*/
    function sproReverseGeocode($timeout, $q){
        return{
            resolveAddress: function (location) {
                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(location.latitude, location.longitude);
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            console.log(results[1].formatted_address);
                            return results[1].formatted_address;
                        } else {
                            console.log('Location not found');
                        }
                    } else {
                        console.log('Geocoder failed due to: ' + status);
                    }
                });
            }
        };
    };
    
    function sproRenderMapFactory(){
        return{
            displayMap: function (mapParams, divId) {
                var lat = mapParams.center.latitude;
                var lang = mapParams.center.longitude;
                var zoomValue = mapParams.zoom;
                if(lat && lang && zoomValue){
                    this.mapOptions = {
                        zoom: zoomValue,
                        center: new google.maps.LatLng(lat, lang),
                        mapTypeControlOptions: {
                            mapTypeId: [google.maps.MapTypeId.ROADMAP]
                        }
                    };
                    this.map = new google.maps.Map(document.getElementById(divId), this.mapOptions);
                    return this.map;
                } else {
                    return console.log("Render Map parameters not provided.");
                }
            }
        };
    };
    
    function sproDrawCircleFactory(){
        return{
            drawCircle: function (location, radiusValue, mapObj) {
                //console.log(location.latitude, radiusValue);
                if(location && location.latitude && location.longitude && radiusValue && mapObj){
                    console.log("lat "+location.latitude+" long "+location.longitude);
                    this.circle = new google.maps.Circle({
                          center: new google.maps.LatLng(location.latitude, location.longitude),
                          radius: radiusValue,
                          map: mapObj,
                          fillColor: '#848484',
                          fillOpacity: 0,
                          strokeColor: '#848484',
                          strokeOpacity: 1
                        });
                    mapObj.fitBounds(this.circle.getBounds());
                    return this.circle;
                } else {
                    return console.log("Draw circle parameters not provided.");
                }
            }
        };
    };
    
})();