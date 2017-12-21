// The root URL for the RESTful services

var rootURL = "http://localhost:8080/AgendaSurServerREST/webresources/agendasur.entity.evento";

var nombre = localStorage.getItem('nombreUsuario');
var apellido = localStorage.getItem('apellidoUsuario');
var email = localStorage.getItem('emailUsuario');

var latitud;
var longitud;

$(document).ready(function () {
    findAllNoValidados();
    addUser();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
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

function error(data){
    console.log(data);
}

function goToAdmin (){
   window.location = "listadoUsuarios.html";
   return true;
}


function showPosition(position) {
    latitud = position.coords.latitude;
    longitud = position.coords.longitude;
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

$('#btnSave').click(function () {
    if ($('#wineId').val() == '')
        addWine();
    else
        updateWine();
    return false;
});

$('#btnDelete').click(function () {
    deleteWine();
    return false;
});

$('#wineList a').live('click', function () {
    findById($(this).data('identity'));
}); 

// Replace broken images with generic wine bottle
 $("img").error(function () {
    $(this).attr("src", "pics/generic.jpg");

}); 


//$("#datepicker").datepicker();


function search(searchKey) {
    if (searchKey == '')
        findAll();
    else
        findByName(searchKey);
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

function findByName(searchKey) {
    console.log('findByName: ' + searchKey);
    $.ajax({
        type: 'GET',
        url: rootURL + '/search/' + searchKey,
        dataType: "json",
        success: renderList
    });
}

function findById(id) {
    console.log('findById: ' + id);
    $.ajax({
        type: 'GET',
        url: rootURL + '/' + id,
        dataType: "json",
        success: function (data) {
            $('#btnDelete').show();
            console.log('findById success: ' + data.name);
            currentWine = data;
            renderDetails(currentWine);
        }
    });
}

function addWine() {
    console.log('addWine');
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: rootURL,
        dataType: "json",
        data: formToJSON(),
        success: function (data, textStatus, jqXHR) {
            alert('Wine created successfully');
            $('#btnDelete').show();
            $('#wineId').val(data.id);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('addWine error: ' + textStatus);
        }
    });
}

function updateWine() {
    console.log('updateWine');
    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        url: rootURL + '/' + $('#wineId').val(),
        dataType: "json",
        data: formToJSON(),
        success: function (data, textStatus, jqXHR) {
            alert('Wine updated successfully');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('updateWine error: ' + textStatus);
        }
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

function renderListNoValidados(data) {
    var list = data == null ? [] : (data instanceof Array ? data : [data]);

    $('#tfoot tr').remove();

    $.each(list, function (index, event) {
        var row = $('<tr id=' + event.id + '></tr>');
        var cell = $('<td></td>');
        var col1 = $('<div class="col-md-3"></div>');
        var col2 = $('<div class="col-md-3"></div>');
        var col3 = $('<div class="col-md-3"></div>');
        var col4 = $('<div class="col-md-3"></div>');

        var buttonVer = document.createElement("button");
        buttonVer.className = 'btn btn-success';
        buttonVer.innerHTML = "<span class='glyphicon glyphicon-eye-open'></span>";
        buttonVer.id = 'btn_refresh' + event.id;
        buttonVer.onclick = function(){
            localStorage.setItem("evento", JSON.stringify(event));
            console.log(event);
            //.then(function (response) {
            window.location = "verEvento.html";
        };

        var buttonModificar = document.createElement("button");
        buttonModificar.className = 'btn btn-warning';
        buttonModificar.innerHTML = "<span class='glyphicon glyphicon-pencil'></span>";
        buttonModificar.id = 'btn_modificar' + event.id;
        buttonModificar.onclick = function(){
            localStorage.setItem("evento", JSON.stringify(event));
            console.log(event);
            window.location = "modificarEvento.html";
        };

        var buttonEliminar = document.createElement("button");
        buttonEliminar.className = 'btn btn-danger';
        buttonEliminar.innerHTML = "<span class='glyphicon glyphicon-remove'></span>";
        buttonEliminar.onclick = function(){
            deleteEvent(event.id);
            $(this).closest('tr').remove();
        };

        var buttonValidar = document.createElement("button");
        buttonValidar.className = 'btn btn-info';
        buttonValidar.innerHTML = "<span class='glyphicon glyphicon-check'></span>";
        buttonValidar.onclick = function(){
            $(this).closest('tr').remove();
                $.ajax({
                    type: 'PUT',
                    url: rootURL + '/validar/' + event.id,
                    success: function (data, textStatus, jqXHR) {
                        console.log("Evento validados");
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert('ERROR: ¡Ups!, ha habido un error al validar un evento');
                    }
                });
        };

        row.append('<td>' + event.nombre + '</td>');
        row.append('<td>' + event.descripcion + '</td>');
        row.append('<td>' + event.fechainicio + '</td>');
        row.append('<td>' + event.fechafin + '</td>');
        row.append('<td>' + event.direccion + '</td>');

        col1.append(buttonVer);
        col2.append(buttonModificar);
        col3.append(buttonEliminar);
        col4.append(buttonValidar);

        cell.append(col1);
        cell.append(col2);
        cell.append(col3);
        cell.append(col4);

        row.append(cell);
        $('#example').append(row);

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
        //destroy: true
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
        buttonVer.onclick = function(){
            localStorage.setItem("evento", JSON.stringify(event));
            console.log(event);
            //.then(function (response) {
            window.location = "verEvento.html";
        };

        var buttonModificar = document.createElement("button");
        buttonModificar.className = 'btn btn-warning';
        buttonModificar.innerHTML = "<span class='glyphicon glyphicon-pencil'></span>";
        buttonModificar.id = 'btn_modificar' + event.id;
        buttonModificar.onclick = function(){
            localStorage.setItem("evento", JSON.stringify(event));
            console.log(event);
            window.location = "modificarEvento.html";
        };

        var buttonEliminar = document.createElement("button");
        buttonEliminar.className = 'btn btn-danger';
        buttonEliminar.innerHTML = "<span class='glyphicon glyphicon-remove'></span>";
        buttonEliminar.onclick = function(){
            deleteEvent(event.id);
            $(this).closest('tr').remove();
        };

        row.append('<td>' + event.nombre + '</td>');
        row.append('<td>' + event.descripcion + '</td>');
        row.append('<td>' + event.fechainicio + '</td>');
        row.append('<td>' + event.fechafin + '</td>');
        row.append('<td>' + event.direccion + '</td>');


        col1.append(buttonVer);
        col2.append(buttonModificar);
        col3.append(buttonEliminar);

        cell.append(col1);
        cell.append(col2);
        cell.append(col3);

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

function renderDetails(wine) {
    $('#wineId').val(wine.id);
    $('#name').val(wine.name);
    $('#grapes').val(wine.grapes);
    $('#country').val(wine.country);
    $('#region').val(wine.region);
    $('#year').val(wine.year);
    $('#pic').attr('src', 'pics/' + wine.picture);
    $('#description').val(wine.description);
}

// Helper function to serialize all the form fields into a JSON string
function formToJSON() {
    var wineId = $('#wineId').val();
    return JSON.stringify({
        "id": wineId == "" ? null : wineId,
        "name": $('#name').val(),
        "grapes": $('#grapes').val(),
        "country": $('#country').val(),
        "region": $('#region').val(),
        "year": $('#year').val(),
        "picture": currentWine.picture,
        "description": $('#description').val()
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
    console.log(apellido);
    console.log(email);
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: 'http://localhost:8080/AgendaSurServerREST/webresources/agendasur.entity.usuario',
        dataType: "json",
        data: JSON.stringify({
            "nombre": nombre,
            "apellidos": apellido,
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

