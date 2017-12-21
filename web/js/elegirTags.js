/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var rootURL = "http://localhost:8080/AgendaSurServerREST/webresources/agendasur.entity.";

var jsonUsuario;

var listTagUsuario = new Array();

$(document).ready(function () {

    var retrievedObject = localStorage.getItem('usuarioSesion');
    console.log('retrievedObject: ', JSON.parse(retrievedObject));

    jsonUsuario = JSON.parse(retrievedObject);

    mostrarChecked();
});

function cancelar() {
    window.location = "listadoUsuarios.html";
    return false;
}

function mostrarChecked() {
    for (tag in jsonUsuario.tagsUsuario) {
        document.getElementById(jsonUsuario.tagsUsuario[tag]).checked = true;
    }
}

function guardarTags() {
    console.log('usuarioModificado');
    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        url: rootURL + 'usuario/asignarTag/' + jsonUsuario.email,
        data: check(),
        success: function (response) {
            console.log(response);
            window.location = "listadoEventos.html";
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}

function check() {
    $('#.check:checked').each(function () {
        console.log($(this)); 
        var tag = $(this).attr('id');
        listTagUsuario.push(tag);
    });
    console.log(listTagUsuario);
    return JSON.stringify(listTagUsuario);
}
