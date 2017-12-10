/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {

    var rootURL = "http://localhost:8080/AgendaSurServerREST/webresources/agendasur.entity.";

    $('#crearEvento').click(function () {
        addEvent();
        return false;
    });

    findAllTag();

    function findAllTag() {
        console.log(rootURL + 'tag')
        $.ajax({
            type: 'GET',
            url: rootURL + 'tag',
            contentType: 'application/json',
            dataType: "json", // data type of response
            success: mostrarDatos
        });
    }
    function mostrarDatos(data) {
        var list = data == null ? [] : (data instanceof Array ? data : [data]);

        $.each(list, function (index, tag) {
            console.log(tag.nombre);
            var select = $('<option></option><br/>');
            select.val(tag.nombre);
            select.append(tag.nombre);
            $('#selectTag').append(select);
        });
    }
    function addEvent() {
        console.log('addEvent');
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: rootURL + 'evento',
            data: formToJSON(),
            success: function (response) {
                console.log(response);
                window.location = "listadoEventos.html";
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(textStatus);
            }
        });
    }

    function formToJSON() {
        console.log($('#selectTag').val());

        if ($('#selectTag').val() == null || $('#selectTag').val().isEmptyObject()) {
            return JSON.stringify({
                creador: 'cardenitas96@gmail.com',
                descripcion: $('#descripcionEvento').val(),
                direccion: $('#direccionEvento').val(),
                fechainicio: $('#fechainicio').val(),
                fechafin: $('#fechafin').val(),
                longitud: $('#longitudEvento').val(),
                latitud: $('#latitudEvento').val(),
                nombre: $('#nombreEvento').val()
            }
            );
        } else {
            return JSON.stringify({
                creador: 'cardenitas96@gmail.com',
                descripcion: $('#descripcionEvento').val(),
                direccion: $('#direccionEvento').val(),
                fechainicio: $('#fechainicio').val(),
                fechafin: $('#fechafin').val(),
                longitud: $('#longitudEvento').val(),
                latitud: $('#latitudEvento').val(),
                nombre: $('#nombreEvento').val(),
                tags: $('#selectTag').val()
            }
            );
        }


    }

});