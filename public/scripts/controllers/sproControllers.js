(function(){
    'use strict';

    angular
        .module('societyPro.sproControllers', ['societyPro.sproServices', 'societyPro.sproFactories'])
        .controller('societyProCtrl', societyProCtrl)
        .controller('findSrvcCtrl', findSrvcCtrl)
        .controller('reportSrvcCtrl', reportSrvcCtrl)
        .controller('suggestSrvcCtrl', suggestSrvcCtrl);
    
    societyProCtrl.$inject = ['sproApiCallsSvc', 'sproMarkerSvc', 'sproRenderMapFactory', 'sproDrawCircleFactory'];
    societyProCtrl.$inject = ['sproRenderMapFactory'];
    reportSrvcCtrl.$inject = ['sproRenderMapFactory'];
    suggestSrvcCtrl.$inject = ['sproRenderMapFactory'];
    
    function societyProCtrl(sproApiCallsSvc, sproMarkerSvc, sproRenderMapFactory, sproDrawCircleFactory){
        
        //var infoWindow = new google.maps.InfoWindow();
        var ctrl = this;
        
        ctrl.location = {};
        ctrl.selectedServiceName = null;
        ctrl.selectedRadius = null;
        ctrl.circle = null;
        
        ctrl.radius = [{ 
                Key: "1",
                Value: 1000
            }, {
                Key: "2",
                Value: 2000
            }, {
                Key: "5",
                Value: 5000
            }, {
                Key: "10",
                Value: 10000
            }, {
                Key: "20",
                Value: 20000
            }, {
                Key: "50",
                Value: 50000
            }, {
                Key: "100",
                Value: 100000
            }];
        
        ctrl.serviceNames = [{ 
                Key: "Gym",
                Value: "gyms"
            }, {
                Key: "Swimming",
                Value: "swimming"
            }, {
                Key: "Coaching",
                Value: "coaching"
            }, {
                Key: "Ground",
                Value: "ground"
            }, {
                Key: "Police Station",
                Value: "policestation"
            }, {
                Key: "Restaurant",
                Value: "restaurant"
            }, {
                Key: "Pub",
                Value: "pub"
            }];
        
        angular.element(document).ready(function () {
            ctrl.map = sproRenderMapFactory.displayMap(21,78,5);
        });
        
        ctrl.submitForm = function(){
            ctrl.doSearch();
        }

        //----------------Search function------------------//
        ctrl.doSearch = function(){
            if(ctrl.location == ''){
                console.log('Location not selected');
            } else if(!ctrl.selectedServiceName){
                console.log('Service not selected');
            } else if(!ctrl.selectedRadius){
                console.log('Radius not selected');
            } else {
                if(ctrl.circle)
                    ctrl.circle.setMap(null);;
                ctrl.circle = sproDrawCircleFactory.displayCircle(ctrl.location, ctrl.selectedRadius, ctrl.map);
                sproApiCallsSvc.getServiceResults(ctrl.selectedServiceName, ctrl.circle, ctrl.map);    
                }
            };
     };
    
    function findSrvcCtrl(sproRenderMapFactory){
        var ctrl = this;
        
        angular.element(document).ready(function () {
            ctrl.map = sproRenderMapFactory.displayMap(21,78,5);
        });
        
        /*enterLocation();
        drawCircle();
        getServiceResults();
    };
    
    function reportSrvcCtrl(sproRenderMapFactory){
        var ctrl = this;
        
        angular.element(document).ready(function () {
            ctrl.map = sproRenderMapFactory.displayMap(21,78,5);
        });
        
        enterLocation();
        pickLocation();
        addDecription();
    };
    
    function suggestSrvcCtrl(sproRenderMapFactory){
        var ctrl = this;
        
        angular.element(document).ready(function () {
            ctrl.map = sproRenderMapFactory.displayMap(21,78,5);
        });
        
        suggestService();*/
    };
    
})();