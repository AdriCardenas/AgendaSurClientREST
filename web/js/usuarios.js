/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var rootURL = "http://localhost:8080/AgendaSurServerREST/webresources/agendasur.entity.usuario";

$(document).ready(function () {

    findAllUsers();
    
});
    
function findEventos(){
    window.location.replace("listadoEventos.html");
    return true;
}

function findEventosNoValidados(){
    window.location.replace("listadoNoValidados.html");
    return true;
}

function findEventosByLocation(){
    window.location.replace("listadoGeolocation.html");
    return true;
}

function crearEvento() {
    window.location.replace("crearEvento.html");
    return true;
}
    
function findAllUsers() {
    console.log('findAllUsers');
    $.ajax({
        type: 'GET',
        url: rootURL,
        dataType: "json", // data type of response
        success: renderList
    });
}

function deleteUsuario(email){
    console.log('deleteUsuario');
    $.ajax({
        type: 'DELETE',
        url: rootURL + '/' + email.toString(),
        error: function (jqXHR, textStatus, errorThrown) {
            alert('ERROR: ¡Ups!, ha habido un error al eliminar un evento');
        }
    });
}

function renderList(data) {
    // JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
    var list = data == null ? [] : (data instanceof Array ? data : [data]);

    $('#tfoot tr').remove();

    $.each(list, function (index, usuario) {
        var row = $('<tr id=' + usuario.email + '></tr>');
        var cell = $('<td></td>');
        var col1 = $('<div class="col-md-4"></div>');
        var col2 = $('<div class="col-md-4"></div>');

        var buttonModificar = document.createElement("button");
        buttonModificar.className = 'btn btn-warning';
        buttonModificar.innerHTML = "<span class='glyphicon glyphicon-pencil'></span>";
        buttonModificar.id = 'btn_modificar' + usuario.email;
        buttonModificar.onclick = function(){
            localStorage.setItem("usuario", JSON.stringify(usuario));
            console.log(usuario);
            window.location = "modificarUsuario.html";
        };

        var buttonEliminar = document.createElement("button");
        buttonEliminar.className = 'btn btn-danger';
        buttonEliminar.innerHTML = "<span class='glyphicon glyphicon-remove'></span>";
        buttonEliminar.onclick = function(){
            deleteUsuario(usuario.email);
            $(this).closest('tr').remove();
        };

        row.append('<td>' + usuario.nombre + '</td>');
        row.append('<td>' + usuario.apellidos + '</td>');
        row.append('<td>' + usuario.email + '</td>');
        row.append('<td>' + usuario.tipoUsuario + '</td>');
        
        col1.append(buttonModificar);
        col2.append(buttonEliminar);

        //cell.append(botonVer);
        cell.append(col1);
        cell.append(col2);

        row.append(cell);
        $('#example').append(row);

        //$('#table').append('</tr>');
        //$('#table').append('<li><a href="#" data-identity="' +
        //   wine.id + '">'+wine.name+'</a></li>');
    });
    
    //$('#example').DataTable();
    $('#example').DataTable({
        "columns": [{
            "orderable": true
        }, {
            "orderable": true
        }, {
            "orderable": true
        }, {
            "orderable": true
        }, {
            "orderable": false
        }],
        destroy: true,
        searching: true,
        pagination: true
        //destroy: true
    });
       
}

