/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var rootURL = "http://localhost:8080/AgendaSurServerREST/webresources/agendasur.entity.";

var jsonUsuario;

var listTagUsuario;

$(document).ready(function () {
    
var retrievedObject = localStorage.getItem('usuario');
console.log('retrievedObject: ', JSON.parse(retrievedObject));

jsonUsuario = JSON.parse(retrievedObject);

    document.getElementById('nombre').value = jsonUsuario.nombre;
    document.getElementById('apellidos').value = jsonUsuario.apellidos;
    document.getElementById('email').value = jsonUsuario.email;
    document.getElementById('tipoUsuario').value = jsonUsuario.tipoUsuario;
    findAllTag();
    findAllTagUsuario();

});

function cancelar(){
    window.location = "listadoUsuarios.html";
    return false;
}

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

function findAllTagUsuario() {
    console.log(rootURL + 'tag/tagsByUser/' + jsonUsuario.email);
    $.ajax({
        type: 'GET',
        url: rootURL + 'tag/tagsByUser/' + jsonUsuario.email,
        contentType: 'application/json',
        dataType: "json", // data type of response
        success: guardarTag
    });
}

function guardarTag(data) {
    listTagUsuario = data == null ? [] : (data instanceof Array ? data : [data]);

    $.each(listTagUsuario, function (index, tag) {
        console.log(tag.nombre);
        var select = $('#' + tag.id);
        select.attr("selected", "selected");
    });
}

function mostrarDatos(data) {
    var list = data == null ? [] : (data instanceof Array ? data : [data]);

    $.each(list, function (index, tag) {
        console.log(tag.nombre);
        var select = $('<option></option><br/>');
        select.val(tag.nombre);
        select.append(tag.nombre);
        select.attr("id", tag.id);
        $('#selectTag').append(select);
    });
}

function guardarUsuario(){
    console.log('usuarioModificado');
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


function formToJSON() {
    console.log($('#selectTag').val());

    if ($('#selectTag').val() == null) {
        return JSON.stringify({
            apellidos: $('#apellidos').val(), 
            email: $('#email').val(),
            nombre: $('#nombre').val(),
            tipoUsuario: $('#tipoUsuario').val()
            
        }
        );
    } else {
        return JSON.stringify({
            apellidos: $('#apellidos').val(), 
            email: $('#email').val(),
            nombre: $('#nombre').val(),
            tipoUsuario: $('#tipoUsuario').val(),
            tags: $('#selectTag').val()       
        }
        );
    }
}