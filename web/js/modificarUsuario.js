/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var rootURL = "http://localhost:8080/AgendaSurServerREST/webresources/agendasur.entity.";

var jsonUsuario;

var listTagUsuario = new Array();

$(document).ready(function () {
    
var retrievedObject = localStorage.getItem('usuario');
console.log('retrievedObject: ', JSON.parse(retrievedObject));

jsonUsuario = JSON.parse(retrievedObject);

    document.getElementById('nombre').value = jsonUsuario.nombre;
    document.getElementById('apellidos').value = jsonUsuario.apellidos;
    document.getElementById('email').value = jsonUsuario.email;
    document.getElementById('tipoUsuario').value = jsonUsuario.tipoUsuario;
    
    mostrarChecked();

});

function cancelar(){
    window.location = "listadoUsuarios.html";
    return false;
}

function guardarUsuario(){
    console.log(formToJSON());
    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        url: rootURL + 'usuario/'+jsonUsuario.email,
        data: formToJSON(),
        success: function (response) {
            console.log(response);
            window.location = "listadoUsuarios.html";
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}

function mostrarChecked() {
    for (tag in jsonUsuario.tagsUsuario) {
        document.getElementById(jsonUsuario.tagsUsuario[tag]).checked = true;
    }
}

function formToJSON() {

    /*if ($('#selectTag').val() == null) {
        return JSON.stringify({
            apellidos: $('#apellidos').val(), 
            email: $('#email').val(),
            nombre: $('#nombre').val(),
            tipoUsuario: $('#tipoUsuario').val()
            
        }
        );
    } else {*/
        return JSON.stringify({
            apellidos: $('#apellidos').val(), 
            email: $('#email').val(),
            nombre: $('#nombre').val(),
            tipoUsuario: $('#tipoUsuario').val(),
            tagsUsuario: check()       
        }
        );
    //}
}

function check() {
    $('#.check:checked').each(function () {
        console.log($(this)); 
        var tag = $(this).attr('id');
        listTagUsuario.push(tag);
    });
    console.log(listTagUsuario);
    return listTagUsuario;
}