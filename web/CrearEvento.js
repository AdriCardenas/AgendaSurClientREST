/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function(){
    
var rootURL = "http://localhost:8080/AgendaSurServerREST/webresources/agendasur.entity.evento";

$('#crearEvento').click(function (){
    addEvent();
    return false;
});

function addEvent() {
    console.log('addEvent');
    $.ajax({
        type: 'POST',
        //contentType: 'application/json',
        url: rootURL,
        dataType: "json",
        data: formToJSON(),
        success: function (data, textStatus, jqXHR) {
            alert('Wine created successfully');
            window.location = "listadoEventos.html";
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('addWine error: ' + textStatus);
        }
    });
}

function formToJSON() {
    return JSON.stringify({
        nombre : $('#nombreEVento').val(),
        descripcion: $('#descripcionEvento').val(),
        direccion: $('#direccionEvento').val(),
        fechainicio: $('#fechainicio').val(),
        fechafin: $('#fechafin').val(),
        longitud: $('#longitudEvento').val(),
        latitud: $('#latitudEvento').val(),
        creador: { apellidos :"Fernández", email :"cardenitas96@gmail.com", nombre :"Antonio", password :"adri", tipousuario :1}
    });
}

});