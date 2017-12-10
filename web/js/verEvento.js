/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var latitud, longitud, nombreEvento;


$(document).ready(function () {
    var retrievedObject = localStorage.getItem('evento');
    console.log('retrievedObject: ', JSON.parse(retrievedObject));

    var jsonEvento = JSON.parse(retrievedObject);

    nombreEvento = jsonEvento.nombre;

    document.getElementById('nombreEvento').innerHTML = nombreEvento;
    document.getElementById('descripcionEvento').innerHTML = jsonEvento.descripcion;
    document.getElementById('fechaInicio').innerHTML = jsonEvento.fechainicio;
    document.getElementById('fechaFin').innerHTML = jsonEvento.fechafin;
    document.getElementById('direccionEvento').innerHTML = jsonEvento.direccion;

    latitud = parseFloat(jsonEvento.latitud);
    longitud = parseFloat(jsonEvento.longitud);

    initMap();
    
    function initMap() {
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: new google.maps.LatLng(latitud, longitud),
            zoom: 15,
            draggable: true
        });
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(latitud, longitud),
            map: map,
            animation: google.maps.Animation.DROP,
            title: nombreEvento
        });

        var infowindow = new google.maps.InfoWindow({
            content: nombreEvento
        });
// Adding a click event to the marker
        google.maps.event.addListener(marker, 'click', function () {
// Calling the open method of the infoWindow
            infowindow.open(map, marker);
        });
    }

});


