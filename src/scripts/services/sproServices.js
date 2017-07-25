(function(){
    'use strict';

    angular
        .module('societyPro.sproServices', [])
        .service('sproPlaceDraggableMarkerSrvc', sproPlaceDraggableMarkerSrvc)
        .service('sproReverseGeocodeSrvc', sproReverseGeocodeSrvc)
        .service('sproHelperFunctionSvc', sproHelperFunctionSvc)
        .service('sproMarkerSvc', sproMarkerSvc)
        .service('sproApiCallsSvc', sproApiCallsSvc);
    
    sproPlaceDraggableMarkerSrvc.$inject = ['sproReverseGeocodeSrvc', '$rootScope'];
    sproReverseGeocodeSrvc.$inject = [];
    sproMarkerSvc.$inject = ['sproHelperFunctionSvc'];
    sproApiCallsSvc.$inject = ['$http','sproMarkerSvc'];
    
    
    //----------------------sproPlaceDraggableMarkerSrvc--------------------//
        function sproPlaceDraggableMarkerSrvc(sproReverseGeocodeSrvc, $rootScope){
            this.placeMarker = function(location, idValue, map){
                var pinColor = "66CD00";
                var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                    new google.maps.Size(21, 34),
                    new google.maps.Point(0,0),
                    new google.maps.Point(10, 34));
                var myMarker = {};
                
                //myMarker.setMap(null)
                myMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(location.latitude, location.longitude),
                    icon: pinImage,
                    draggable: true
                });

                google.maps.event.addListener(myMarker, 'dragend', function (evt) {
                    //document.getElementById('pickLocationInputBox').value = 'Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3);
                    //======================
                    location.latitude = evt.latLng.lat();
                    location.longitude = evt.latLng.lng();

                    sproReverseGeocodeSrvc.resolveAddress(location, idValue)
                    $rootScope.$broadcast('eventFired', {
                        //data: 'something'
                    });
                });
                google.maps.event.addListener(myMarker, 'dragstart', function (evt) {
                    document.getElementById(idValue).value = 'Currently dragging marker...';
                });

                map.setCenter(myMarker.position);
                myMarker.setMap(map);
            }
        };
    
    //----------------------sproReverseGeocodeSrvc---------------------------//
        function sproReverseGeocodeSrvc(){
            this.resolveAddress = function (location, idValue) {
                var geocoder = new google.maps.Geocoder();
                //var infowindow = new google.maps.InfoWindow;
                var latlng = new google.maps.LatLng(location.latitude, location.longitude);
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            console.log(results[1].formatted_address);
                            //infowindow.setContent(results[1].formatted_address);
                            //infowindow.open(map, marker);
                            document.getElementById(idValue).value = results[1].formatted_address;
                        } else {
                            console.log('Location not found');
                        }
                    } else {
                        console.log('Geocoder failed due to: ' + status);
                    }
                });
            }
        };
        
    //--------------------helperFunctionService Service-----------------------//
        function sproHelperFunctionSvc(){
            this.clearMarker = function () {
                    //$scope.marker.setmapMap(null);
                    var marker = null;
                };
            this.updateRightPanel = function(selectedInfo) {
                var selectedService = {
                    "id" : selectedInfo.id,
                    "name" : selectedInfo.name,
                    "description" : selectedInfo.description,
                    "contactNo" : selectedInfo.contactInfo.phone.primary
                };
            };
        };

    //--------------------markerService Service-----------------------//
        function sproMarkerSvc(sproHelperFunctionSvc){ 
            
            var infoWindow = new google.maps.InfoWindow();
            
            this.createMarker = function(info, circle, mapObj) {
                var markerPosition = new google.maps.LatLng(info.location.latitude, info.location.longitude);
                var distance = google.maps.geometry.spherical.computeDistanceBetween(markerPosition, circle.center)
                if(distance <= circle.radius){
                    var marker = new google.maps.Marker({
                        map: mapObj,
                        position: new google.maps.LatLng(info.location.latitude, info.location.longitude),
                        title: info.name,
                        content: '<div class="infoWindowContent">ID : ' + info.id + '<br />Name : ' + info.name + '<br />Description : ' + info.description + '<br />Contact No. : ' + info.contactInfo.phone.primary + '</div>'
                    });

                    google.maps.event.addListener(marker, 'click', function () {
                        //sproHelperFunctionSvc.updateRightPanel(info);
                        mapObj.setCenter(new google.maps.LatLng(info.location.latitude, info.location.longitude));
                        if (infoWindow) {
                            infoWindow.close();
                        }
                        infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                        infoWindow.open(mapObj, marker);
                    });
                    this.markers.push(marker);
                    return this.markers;
                }
            }; 
         };
    
    
    function markerSvc(){
        var haightAshbury = {lat: 37.769, lng: -122.446};

        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: haightAshbury,
          mapTypeId: 'terrain'
        });
        
        // This event listener will call addMarker() when the map is clicked.
        map.addListener('click', function(event) {
          addMarker(event.latLng);
        });
        // Adds a marker to the map and push to the array.
      this.addMarker = function(location) {
        var marker = new google.maps.Marker({
          position: location,
          map: map
        });
        markers.push(marker);
      }

      // Sets the map on all markers in the array.
      this.setMapOnAll = function(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      // Removes the markers from the map, but keeps them in the array.
      this.clearMarkers = function() {
        setMapOnAll(null);
      }

      // Shows any markers currently in the array.
      this.showMarkers = function() {
        setMapOnAll(map);
      }

      // Deletes all markers in the array by removing references to them.
      this.deleteMarkers = function() {
        clearMarkers();
        markers = [];
      }
    };
    
    
     //--------------------sproApiCallsSvc Service-----------------------//
        function sproApiCallsSvc($http, sproMarkerSvc){
            this.getServiceResults = function(serviceName, circle, mapObj){
                if(serviceName)
                    {
                     $http.get('/servicelist/'+serviceName).success(function(response){
                         console.log("I got the data I requested.");
                         var data = response;
                         angular.forEach(sproMarkerSvc.markers, function(value, key){
                             value.setMap(null);
                         });
                         sproMarkerSvc.markers = [];
                         angular.forEach(data, function(value, key){
                            sproMarkerSvc.createMarker(value, circle, mapObj);
                         });
                    });
                 }
            };
            this.fa = "";
            
            this.addGym = function(){
                console.log($scope.fa);
                $http.post('/servicelist',$scope.fa).success(function(response) {
                 console.log(response);
                getServiceResults();
                });
            };

            this.remove = function(id){
              console.log(id);
                $http.delete('/servicelist/'+id).success(function(response) {
                 console.log(response);
                getServiceResults();
                });
            };

            this.edit = function(id){
              console.log(id);
                $http.get('/servicelist/'+id).success(function(response) {
                    $scope.fa = response;
                 console.log(response);
                });
            };

            this.update = function(){
              console.log($scope.fa._id);
                $http.put('/servicelist/'+$scope.fa._id, $scope.fa).success(function(response) {
                 console.log(response);
                getServiceResults();
                });
            };
        };
})();