(function(){
    'use strict';

    angular
        .module('societyPro.sproFactories', [])
        .factory('sproRenderMapFactory', sproRenderMapFactory)
        .factory('sproDrawCircleFactory', sproDrawCircleFactory);
    
    function sproRenderMapFactory(){
        return{
            displayMap: function (lat, lang, zoomValue) {
                if(lat && lang && zoomValue){
                    this.mapOptions = {
                        zoom: zoomValue,
                        center: new google.maps.LatLng(lat, lang),
                        mapTypeControlOptions: {
                            mapTypeId: [google.maps.MapTypeId.ROADMAP]
                        }
                    };
                    this.map = new google.maps.Map(document.getElementById('mapBody'), this.mapOptions);
                    return this.map;
                } else {
                    return console.log("Render Map parameters not provided.");
                }
            }
        };
    };
    
    function sproDrawCircleFactory(){
        return{
            displayCircle: function (location, radiusValue, mapObj) {
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