// The root URL for the RESTful services

var rootURL = "http://localhost:8080/AgendaSurServerREST/webresources/agendasur.entity.evento";

var usuarioSesion = JSON.parse(localStorage.getItem('usuarioSesion'));
var nombre = usuarioSesion.nombre;
var apellidos = usuarioSesion.apellidos;
var email = usuarioSesion.email;
var tipoUsuario = usuarioSesion.tipoUsuario;
var tagsUsuario = usuarioSesion.tagsUsuario;
console.log(nombre + apellidos + email + tipoUsuario + tagsUsuario);
var latitud;
var longitud;

$(document).ready(function () {

    if (!esAdmin()) {
        $("#btnAdminUsuarios").hide();
        $("#btnNoValidados").hide();
    } else {
        $("#btnAdminUsuarios").show();
        $("#btnNoValidados").show();
    }

    addUser();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
    findAllByGeolocalization();
});



function esAdmin() {
    return tipoUsuario == 3;
}

function findEventos() {
    window.location.replace("listadoEventos.html");
    return true;
}

function findEventosNoValidados() {
    window.location.replace("listadoNoValidados.html");
    return true;
}

function findEventosByTags() {
    localStorage.setItem('tag', $('.inputRadio:checked').val());
    window.location.replace("listadoTag.html");
}

function crearEvento() {
    window.location.replace("crearEvento.html");
    return true;
}

function findAllNoValidados() {
    console.log('findAllNoValidados');
    $.ajax({
        type: 'GET',
        url: rootURL + "/eventosNoValidados",
        dataType: "json", // data type of response
        success: renderListNoValidados,
        error: error
    });
}

function error(data) {
    console.log(data);
}

function goToAdmin() {
    window.location = "listadoUsuarios.html";
    return true;
}


function showPosition(position) {
    latitud = position.coords.latitude;
    longitud = position.coords.longitude;
}

function findEventosByLocation() {
    window.location.replace("listadoGeolocation.html");
    return true;
}

function findAllByGeolocalization() {
    console.log('findAllByGeolocalization');
    $.ajax({
        type: 'GET',
        //url: rootURL + "/eventosOrdenadorPorDistancia/" + latitud + "/" + longitud,
        url: rootURL + "/eventosOrdenadorPorDistancia/" + latitud + "/" + longitud,
        dataType: "json", // data type of response
        success: renderList
    });
}

function findAll() {
    console.log('findAll');
    $.ajax({
        type: 'GET',
        url: rootURL + "/eventosNoCaducadosYValidados",
        dataType: "json", // data type of response
        success: renderList
    });
}

function deleteEvent(id) {
    console.log('deleteEvent');
    $.ajax({
        type: 'DELETE',
        url: rootURL + '/' + id.toString(),
        error: function (jqXHR, textStatus, errorThrown) {
            alert('ERROR: ¡Ups!, ha habido un error al eliminar un evento');
        }
    });
}

function renderList(data) {
    // JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
    var list = data == null ? [] : (data instanceof Array ? data : [data]);

    $('#tfoot tr').remove();

    $.each(list, function (index, event) {
        var row = $('<tr id=' + event.id + '></tr>');
        var cell = $('<td></td>');
        var col1 = $('<div class="col-md-4"></div>');
        var col2 = $('<div class="col-md-4"></div>');
        var col3 = $('<div class="col-md-4"></div>');

        var buttonVer = document.createElement("button");
        buttonVer.className = 'btn btn-success';
        buttonVer.innerHTML = "<span class='glyphicon glyphicon-eye-open'></span>";
        buttonVer.id = 'btn_refresh' + event.id;
        buttonVer.onclick = function () {
            localStorage.setItem("evento", JSON.stringify(event));
            console.log(event);
            //.then(function (response) {
            window.location = "verEvento.html";
        };

        row.append('<td>' + event.nombre + '</td>');
        row.append('<td>' + event.descripcion + '</td>');
        row.append('<td>' + event.fechainicio + '</td>');
        row.append('<td>' + event.fechafin + '</td>');
        row.append('<td>' + event.direccion + '</td>');


        col1.append(buttonVer);
        cell.append(col1);
        if (!esAdmin()) {

            var buttonModificar = document.createElement("button");
            buttonModificar.className = 'btn btn-warning';
            buttonModificar.innerHTML = "<span class='glyphicon glyphicon-pencil'></span>";
            buttonModificar.id = 'btn_modificar' + event.id;
            buttonModificar.onclick = function () {
                localStorage.setItem("evento", JSON.stringify(event));
                console.log(event);
                window.location = "modificarEvento.html";
            };

            var buttonEliminar = document.createElement("button");
            buttonEliminar.className = 'btn btn-danger';
            buttonEliminar.innerHTML = "<span class='glyphicon glyphicon-remove'></span>";
            buttonEliminar.onclick = function () {
                deleteEvent(event.id);
                $(this).closest('tr').remove();
            };
            
            col2.append(buttonModificar);
            col3.append(buttonEliminar);

            cell.append(col2);
            cell.append(col3);
        }

        row.append(cell);
        $('#example').append(row);

        //$('#table').append('</tr>');
        //$('#table').append('<li><a href="#" data-identity="' +
        //   wine.id + '">'+wine.name+'</a></li>');
    });

    //$('#example').DataTable();
    $('#example').DataTable({
        "columns": [{
                "orderable": false
            }, {
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
    });
}

function findAllTag() {
    console.log(rootURL + 'tag');
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/AgendaSurServerREST/webresources/agendasur.entity.tag' + '/',
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

function addUser() {
    console.log(nombre);
    console.log(apellidos);
    console.log(email);
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: 'http://localhost:8080/AgendaSurServerREST/webresources/agendasur.entity.usuario',
        dataType: "json",
        data: JSON.stringify({
            "nombre": nombre,
            "apellidos": apellidos,
            "email": email
        }),
        success: function (data, textStatus, jqXHR) {
            //alert('Usuario creado correctamente, señora.');
        }
    });
}

function handleSignOutClick() {
    var esto = localStorage.getItem('oauth');
    console.log(esto);
    esto.auth2.getAuthInstance().disconnect();
    //gapi.auth2.getAuthInstance().disconnect();
    window.location = "index.html";
}

