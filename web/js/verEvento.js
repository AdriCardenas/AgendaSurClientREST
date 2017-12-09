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

    latitud = jsonEvento.latitud;
    longitud = jsonEvento.longitud;

});


