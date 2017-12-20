/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function () {

    var rootURL = "http://localhost:8080/AgendaSurServerREST/webresources/agendasur.entity.usuario";
    
    findAllUsers();
    
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

            /*var botonVer = $('<button/>', {
                text: 'Ver',
                class: 'btn btn-success',
                id: 'btn_ver' + usuario.email,
                click: function () {
                    localStorage.setItem("evento", JSON.stringify(usuario));
                    console.log(usuario);
                    //.then(function (response) {
                    window.location = "verEvento.html";
                    //})
                }

            });*/
            
            var botonModificar = $('<button/>', {
                text: 'Modificar',
                class: 'btn btn-warning',
                id: 'btn_modificar' + usuario.email,
                click: function () {
                    /*localStorage.setItem("evento", JSON.stringify(usuario));
                    console.log(usuario);
                    window.location = "modificarEvento.html";*/
                }
            });
            var botonEliminar = $('<button/>', {
                text: 'Eliminar',
                class: 'btn btn-danger',
                // id: 'btn_refresh'
                click: function () {
                    deleteUsuario(usuario.email);
                    $(this).closest('tr').remove();
                }
            });
            row.append('<td>' + usuario.nombre + '</td>');
            row.append('<td>' + usuario.apellidos + '</td>');
            row.append('<td>' + usuario.email + '</td>');
            row.append('<td>' + usuario.tipoUsuario + '</td>');
            
            //cell.append(botonVer);
            cell.append(botonModificar);
            cell.append(botonEliminar);

            row.append(cell);
            $('#example').append(row);

            //$('#table').append('</tr>');
            //$('#table').append('<li><a href="#" data-identity="' +
            //   wine.id + '">'+wine.name+'</a></li>');
        });

        $('#example').DataTable();
    }
});
