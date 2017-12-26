var usuarioSesion = JSON.parse(localStorage.getItem('usuarioSesion'));
var rootURL = "http://localhost:8080/AgendaSurServerREST/webresources/agendasur.entity.";

$(document).ready(function () {

    findAllTag();

});

function findAllTag() {
        console.log(rootURL + 'tag');
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

        if ($('#selectTag').val() == null ) {
            return JSON.stringify({
                creador: usuarioSesion.email,
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
                creador: usuarioSesion.email,
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